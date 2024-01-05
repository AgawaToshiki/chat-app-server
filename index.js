const express = require("express");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}`});
const { Thread, Sequelize } = require("./models");
const { createAdapter } = require("@socket.io/postgres-adapter");

async function main() {

  const sequelize = new Sequelize('chat', 'agawa', 'agawa', {
    host: 'localhost',
    dialect: 'postgres',
  })

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [`${process.env.ALLOWED_ORIGIN}`],
      methods: ["GET", "POST"]
    },
    connectionStateRecovery: {}
  });


  console.log(process.env.ALLOWED_ORIGIN);
  console.log(process.env.NODE_ENV);
  const PORT = process.env.PORT;


  io.adapter(createAdapter(Sequelize));

  //クライアントと通信
  io.on("connection", async (socket) => {
    const threads = await Thread.findAll({
      attributes: ['id', 'title'],
    });
    io.emit("received_thread", threads);
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


    socket.on("create_thread", async(data) => {
      console.log(data);
      try{
        await Thread.create({
          id: data.id,
          title: data.title
        })
      } catch(e) {
        console.log(`errorMessage:${e}`)
        return;
      }
    })
  })

  server.listen(PORT, () => console.log(`server is running on ${PORT}`));
}

main();


