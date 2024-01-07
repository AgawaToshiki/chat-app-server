const express = require("express");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}`});
const { Thread, Chat } = require("./models");

async function main() {

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

  const getThread = async () => {
    const threads = await Thread.findAll({
      attributes: ['id', 'title'],
    });
    io.emit("received_thread", threads);
  };

  const getChat = async (id) => {
    const chat = await Chat.findAll({
      attributes: ["id", "message", "username", "threadId"],
      where: {
        threadId: id
      }
    })
    io.emit("received_message", chat);
  }


  //クライアントと通信
  io.on("connection", async (socket) => {
    //全てのThreadを取得
    await getThread();
    console.log("クライアントと接続しました");

    //クライアントから受信
    socket.on("send_message", async(data) => {
      socket.join(data.threadId);
      console.log(data);
      try {
        await Chat.create({
          id: data.id,
          message: data.message,
          threadId: data.threadId,
          username: data.username
        })
        await getChat(data.threadId);
      } catch(e) {
        console.log(`errorMessage:${e}`)
        return;
      }
    })

    socket.on('disconnect', () => {
      console.log('クライアントと接続が切れました');
    });


    socket.on("create_thread", async(data) => {
      console.log(data);
      try {
        await Thread.create({
          id: data.id,
          title: data.title
        });
        await getThread();
      } catch(e) {
        console.log(`errorMessage:${e}`)
        return;
      }
    })
  })

  server.listen(PORT, () => console.log(`server is running on ${PORT}`));
}

main();


