const express = require("express");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require("dotenv").config()

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`${process.env.ALLOWED_ORIGIN}`],
    methods: ["GET", "POST"]
  }
});

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


