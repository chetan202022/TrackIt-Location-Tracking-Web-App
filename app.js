const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "*"
  }
});

app.use(helmet({
  contentSecurityPolicy: false
}));

app.set("view engine", "ejs");
app.use(express.static("public"));

let connectedUsers = 0;

io.on("connection", (socket) => {
  connectedUsers++;

  io.emit("users-count", connectedUsers);

  console.log(`Connected: ${socket.id}`);

  socket.on("send-location", (data) => {
    io.emit("receive-location", {
      id: socket.id,
      latitude: data.latitude,
      longitude: data.longitude
    });
  });

  socket.on("disconnect", () => {
    connectedUsers--;

    io.emit("users-count", connectedUsers);
    io.emit("user-disconnected", socket.id);

    console.log(`Disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Running on port 3000");
});