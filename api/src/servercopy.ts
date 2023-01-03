import 'dotenv/config'
import axios from 'axios'
import express, { Request, Response } from 'express'
import socketio from 'socket.io'
import http from 'http'
import https from 'https'
import cors from 'cors'
import { IAbandonedCartData, IPurchaseDataToSend, IPurchaseResponse, ILineItems, IAddress } from './interface'
import dayjs from 'dayjs'
import { Purchase } from './purchase.entity'
import "reflect-metadata"

import createConnection from "./infra";

createConnection();
const app = express()
app.use(express.json())
app.use(cors())

const httpServer = http.createServer(app)
const base64 = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SERVER}`)
const io = new socketio.Server(httpServer, {
  cors: {
    origin: "https://www.lojadabruna.com/",
    methods: ['GET', 'POST']
  }
})

function convertProvince(val: string) {
  let data: string;
	switch (val.toUpperCase()) {
		case "AC" :	data = "Acre";					break;
		case "AL" :	data = "Alagoas";				break;
		case "AM" :	data = "Amazonas";				break;
		case "AP" :	data = "Amapá";					break;
		case "BA" :	data = "Bahia";					break;
		case "CE" :	data = "Ceará";					break;
		case "DF" :	data = "Distrito Federal";		break;
		case "ES" :	data = "Espírito Santo";		break;
		case "GO" :	data = "Goiás";					break;
		case "MA" :	data = "Maranhão";				break;
		case "MG" :	data = "Minas Gerais";			break;
		case "MS" :	data = "Mato Grosso do Sul";	break;
		case "MT" :	data = "Mato Grosso";			break;
		case "PA" :	data = "Pará";					break;
		case "PB" :	data = "Paraíba";				break;
		case "PE" :	data = "Pernambuco";			break;
		case "PI" :	data = "Piauí";					break;
		case "PR" :	data = "Paraná";				break;
		case "RJ" :	data = "Rio de Janeiro";		break;
		case "RN" :	data = "Rio Grande do Norte";	break;
		case "RO" :	data = "Rondônia";				break;
		case "RR" :	data = "Roraima";				break;
		case "RS" :	data = "Rio Grande do Sul";		break;
		case "SC" :	data = "Santa Catarina";		break;
		case "SE" :	data = "Sergipe";				break;
		case "SP" :	data = "São Paulo";				break;
		case "TO" :	data = "Tocantíns";				break;
	}

	return data;
}

function convertPurchasePaymentStatus(purchaseStatus) {
        
  if (purchaseStatus.aprovado === true && purchaseStatus.cancelado === false) {
    return'PAID';
  } else if (purchaseStatus.aprovado === false && purchaseStatus.cancelado === true) {
    return'NOT_PAID';
  } else if (purchaseStatus.aprovado === false && purchaseStatus.cancelado === false) {
    return 'PENDING';
  }
}

async function getPurchasesList () {
  await axios.get(`https://api.awsli.com.br/v1/pedido/search/?since_atualizado=2022-12-25T00:00:01&chave_api=${process.env.CHAVE_API}&chave_aplicacao=${process.env.CHAVE_APLICACAO}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      let purchasesListData = response.data;
      console.log(purchasesListData);

      purchasesListData.objects.forEach(purchase => {
        console.log(purchase.numero, convertPurchasePaymentStatus(purchase.situacao));

      })
      console.log(purchasesListData.objects.length)
    })
    .catch(function (error) {
      console.error(error);
    });
};

setInterval(getPurchasesList, 60000);

app.post("/finalizacao/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  let purchaseData: IPurchaseResponse;
  const purchaseDataToSend = new Purchase();

  await axios.get(`https://api.awsli.com.br/v1/pedido/${id}?chave_api=${process.env.CHAVE_API}&chave_aplicacao=${process.env.CHAVE_APLICACAO}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      purchaseData = response.data;
    })
    .catch(function (error) {
      console.error(error);
    });

    if(purchaseData) {
      purchaseDataToSend.reference_id = purchaseData.numero.toString();
      purchaseDataToSend.number = purchaseData.numero.toString();
      purchaseDataToSend.admin_url = 'https://example.com/admin/orders/123456789';
      purchaseDataToSend.customer_name = purchaseData.cliente.nome;
      purchaseDataToSend.customer_email = purchaseData.cliente.email;
      purchaseDataToSend.customer_phone = `+55${purchaseData.cliente.telefone_celular}`;

      const address: IAddress = {
        name: purchaseData.cliente.nome,
        first_name: purchaseData.cliente.nome.split(' ')[0],
        last_name: purchaseData.cliente.nome.split(' ')[purchaseData.cliente.nome.split(' ').length - 1],
        company: null,
        phone: `+55${purchaseData.cliente.telefone_celular}`,
        address1: `${purchaseData.endereco_entrega.endereco}, ${purchaseData.endereco_entrega.numero}`,
        address2: `${purchaseData.endereco_entrega.endereco}, ${purchaseData.endereco_entrega.numero}`,
        city: purchaseData.endereco_entrega.cidade,
        province: convertProvince(purchaseData.endereco_entrega.estado),
        province_code: purchaseData.endereco_entrega.estado,
        country: purchaseData.endereco_entrega.pais,
        country_code: 'BR',
        zip: purchaseData.endereco_entrega.cep,
        latitude: null,
        longitude: null,
      }
      purchaseDataToSend.billing_address = address;
      purchaseDataToSend.shipping_address = address;

      const itemArray: ILineItems[] = [];
      purchaseData.itens.forEach(item => {
        const itemObj: ILineItems = {
          title: item.nome,
          variant_title: item.nome,
          quantity: parseInt(item.quantidade),
          price: parseFloat(item.preco_cheio),
          path: item.produto,
          image_url: "", 
          tracking_number: item.sku
        }
        
        itemArray.push(itemObj)
      })

      purchaseDataToSend.line_items = itemArray;
      purchaseDataToSend.currency = 'BRL';
      purchaseDataToSend.total_price = parseFloat(purchaseData.valor_total);
      purchaseDataToSend.subtotal_price = parseFloat(purchaseData.valor_subtotal);

      if (purchaseData.situacao.aprovado === true && purchaseData.situacao.cancelado === false) {
        purchaseDataToSend.payment_status = 'PAID';
      } else if (purchaseData.situacao.aprovado === false && purchaseData.situacao.cancelado === true) {
        purchaseDataToSend.payment_status = 'NOT_PAID';
      } else if (purchaseData.situacao.aprovado === false && purchaseData.situacao.cancelado === false) {
        purchaseDataToSend.payment_status = 'PENDING';
      }

      purchaseDataToSend.payment_method = 'PIX',
      purchaseDataToSend.tracking_numbers = purchaseData.pagamentos[0].transacao_id,
      purchaseDataToSend.referring_site = 'https://www.lojadabruna.com/',
      purchaseDataToSend.status_url = `https://www.lojadabruna.com/conta/pedido/${purchaseData.numero}/listar_reduzido`,
      purchaseDataToSend.billet_url = '',
      purchaseDataToSend.billet_line = '',
      purchaseDataToSend.billet_expired_at = purchaseData.data_criacao,
      purchaseDataToSend.original_created_at = purchaseData.data_expiracao

      await axios.post('https://api.reportana.com/2022-05/orders', purchaseDataToSend,{
      headers: {
        Authorization: `Basic ${base64}`,
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress"
      }
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });

      return res.status(201).send();
    }

});

io.on('connection', (socket) => {
  let sendCartTimeout;

  let dataToSend: IAbandonedCartData;

  console.log(`New connection: ${socket.id}`)

  socket.on('sendAbandonedCartInfo', (data) => {
    dataToSend = data;

    if(typeof dataToSend.reference_id === "undefined") {
      console.log("Error 'reference_id' undefined");
      dataToSend.reference_id = Date.now().toString();
    }

    async function sendCartInfo () {
      axios.post('https://api.reportana.com/2022-05/abandoned-checkouts', dataToSend, {
        headers: {
          Authorization: `Basic ${base64}`,
          'Content-Type': 'application/json'
        }
      })
      .then(function () {
        console.log(`${socket.id} ${dataToSend.reference_id} - enviado`);
      })
      .catch(function (error) {
        console.log(`${socket.id} ${dataToSend.reference_id} - ${error}`);
      });
    };

    sendCartTimeout = setTimeout(sendCartInfo, 900000);
    console.log(`${socket.id} ${dataToSend.reference_id} - Timer de envio iniciado`);
  })

  socket.on('updateAbandonedCartInfo', (data: IAbandonedCartData) => {
    dataToSend = data;
    console.log(`${socket.id} ${dataToSend.reference_id} - Dados atualizados`);
  })

  socket.on('checkoutComplete', () => {
    setTimeout(() => {
      if(socket.connected === false) {
        clearTimeout(sendCartTimeout);
        console.log(`${socket.id} ${dataToSend.reference_id} - Compra feita`);
      } 
    }, 3000); 
  })

  socket.emit('connected', 'connected');
})

httpServer.listen(8080, () => console.log('Server test is running!'));