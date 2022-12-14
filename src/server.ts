import 'dotenv/config'
import axios from 'axios'
import express from 'express'
import socketio from 'socket.io'
import http from 'http'
import https from 'https'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

const httpServer = http.createServer(app)
const io = new socketio.Server(httpServer, {
  cors: {
    origin: "https://turbo-partners-teste.lojaintegrada.com.br/",
    methods: ['GET', 'POST']
  }
})

let oneTimeout;

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`)

  socket.on('sendAbandonedCartInfo', (data) => {
    async function sendCartInfo () {
      const dataToSend = data

      console.log(dataToSend)

      const base64 = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SERVER}`)
      const response = await axios.post('https://api.reportana.com/2022-05/abandoned-checkouts', dataToSend, {
        headers: {
          Authorization: `Basic ${base64}`,
          'Content-Type': 'application/json'
        }
      })

      console.log(response.status, response.data)

      if (response.status <= 400) {
        socket.emit('infoSent', 'enviado')
      } else {
        socket.emit('infoSent', 'erro ao enviar')
      }
    };

    oneTimeout = setTimeout(sendCartInfo, 5000)
    console.log('Envio timer iniciado')

    socket.on('setTimeOut', () => {
      clearTimeout(oneTimeout)
      oneTimeout = setTimeout(sendCartInfo, 5000)
      console.log('Envio adiado')
      socket.emit('infoSent', 'Envio adiado')
    })

    socket.on('checkoutComplete', () => {
      clearTimeout(oneTimeout)
      console.log('Compra feita')
    })
  })

  socket.emit('connected', 'connected')
})

httpServer.listen(3000, () => console.log('Server-test is running!'))