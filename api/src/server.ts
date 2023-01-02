import 'dotenv/config'
import axios from 'axios'
import express, { Request, Response } from 'express'
import socketio from 'socket.io'
import http from 'http'
import https from 'https'
import cors from 'cors'
import { IAbandonedCartData } from './interface'

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

var body = {
  reference_id: '123456789',
  number: '12345678',
  admin_url: 'https://example.com/admin/orders/123456789',
  customer_name: 'Igor Teste',
  customer_email: 'Teste@gmail.com',
  customer_phone: '+5527997737840',
  billing_address: {
      name: 'Igor Teste',
      first_name: 'Igor',
      last_name: 'Teste',
      company: null,
      phone: '+5527997737840',
      address1: 'Av Belisário Ramos, 3735',
      address2: 'Sagrado Coração Jesus',
      city: 'Lages',
      province: 'Santa Catarina',
      province_code: 'SC',
      country: 'Brazil',
      country_code: 'BR',
      zip: '88508100',
      latitude: null,
      longitude: null
  },
  shipping_address: {
    name: 'Igor Teste',
    first_name: 'Igor',
    last_name: 'Teste',
    company: null,
    phone: '+5527997737840',
    address1: 'Av Belisário Ramos, 3735',
    address2: 'Sagrado Coração Jesus',
    city: 'Lages',
    province: 'Santa Catarina',
    province_code: 'SC',
    country: 'Brazil',
    country_code: 'BR',
    zip: '88508100',
    latitude: null,
    longitude: null
  },
  line_items: [
      {
          title: 'Óculos',
          variant_title: 'Preto',
          quantity: 1,
          price: 49.9,
          path: 'https://example.com/products/1234',
          image_url: 'https://example.com/products/1234/image.jpg', 
          tracking_number: 'LB123456789BR'
      }
  ],
  currency: 'BRL',
  total_price: 124.8,
  subtotal_price: 109.8,
  payment_status: 'PAID',
  payment_method: 'PIX',
  tracking_numbers: 'LB123456789BR,LB987654321BR',
  referring_site: 'https://www.facebook.com/',
  status_url: 'https://example.com/orders/123456789',
  billet_url: 'https://example.com/orders/123456789/boleto.pdf',
  billet_line: '000000000000000000000000000000000000000000000000',
  billet_expired_at: '2022-12-22',
  original_created_at: '2022-12-22 17:50'
};

app.post("/finalizacao/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // axios.get('https://api.reportana.com/2022-05/orders',{
  //   headers: {
  //     Authorization: `Basic ${base64}`,
  //     'Content-Type': 'application/json'
  //   }
  // })
  // .then(function (response) {
  //   const data = response;
  // })
  // .catch(function (error) {
  //   console.error(error);
  // });
  
  const data = body;

  axios.post('https://api.reportana.com/2022-05/orders', data,{
    headers: {
      Authorization: `Basic ${base64}`,
      'Content-Type': 'application/json'
    }
  })
  .then(function (response) {
    console.log("test");
  })
  .catch(function (error) {
    console.error(error);
  });

  return res.status(201).send();
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

httpServer.listen(8080, () => console.log('Server is running!'));