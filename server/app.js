import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const port = 8000;
const app = express();
const server = http.createServer(app);

// io => Circuit
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// cors middleware
app.use(
  cors({
    origin: "http://locahost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.get("/", (req, res) => {
  res.send("Home page");
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // message
  socket.on("message", ({ message, room }) => {
    console.log(message, room);
    io.to(room).emit("receive-message", message);
  });
  // join room
  socket.on("join-room", (data) => {
    socket.join(data);
  });
  // leaveRoom
  socket.on("leave-room", (data) => {
    socket.leave(data);
  });

  io.emit("welcome", `Joined! ${socket.id}`);
  socket.on("disconnect", () => {
    io.emit("someone-disconnected", `disconnected ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});
