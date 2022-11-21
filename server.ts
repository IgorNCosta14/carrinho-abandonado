import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  }
});

app.use(express.json());

io.on('connection', (socket) => {
  socket.on('joinChat', () => {
    console.log('on')
  })

  socket.on;
})

app.listen(3001, () =>
  console.log(`Server is running: https://localhost:3001`),
);

