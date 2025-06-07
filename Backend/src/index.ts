import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

type Client = {
  ws: WebSocket;
  userId: string;
  roomId: string;
};

const clients: Client[] = [];

wss.on("connection", (ws, req) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "join") {
        clients.push({ ws, userId: data.userId, roomId: data.roomId });
        console.log(`${data.userId} joined room ${data.roomId}`);

      } else if (data.type === "message") {
        clients.forEach(client => {
          if (client.roomId === data.roomId && client.ws !== ws) {
            client.ws.send(JSON.stringify({
              type: "message",
              userId: data.userId,
              text: data.text,
            }));
          }
        });
      }

    } catch (err) {
      console.error("Invalid message", err);
    }
  });

  ws.on("close", () => {
    const index = clients.findIndex(c => c.ws === ws);
    if (index !== -1) clients.splice(index, 1);
    console.log("Client disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
