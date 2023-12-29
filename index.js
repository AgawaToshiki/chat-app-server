const express = require("express");
const cors = require('cors');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}`})


const app = express();
app.use(cors({
  origin: `${process.env.ALLOWED_ORIGIN}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`${process.env.ALLOWED_ORIGIN}`],
    methods: ["GET", "POST"]
  }
});

console.log(process.env.ALLOWED_ORIGIN);
console.log(process.env.NODE_ENV)
const PORT = process.env.PORT

//クライアントと通信
io.on("connection", (socket) => {
  console.log("クライアントと接続しました");

  //クライアントから受信
  socket.on("send_message", (data) => {
    console.log(data);
    //クライアントへ送信
    io.emit("received_message", data)
  })



  socket.on('disconnect', () => {
    console.log('クライアントと接続が切れました');
  });
})

server.listen(PORT, () => console.log(`server is running on ${PORT}`));


