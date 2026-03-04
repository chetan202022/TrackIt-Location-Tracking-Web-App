
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static('public'));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for location updates from the client
  socket.on("send-location", (data) => {
    // Emit the received location to all clients
    io.emit("receive-location", { id: socket.id, ...data });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});