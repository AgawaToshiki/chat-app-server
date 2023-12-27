const express = require("express");
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"]
  }
});

const PORT = 5000;

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


