require('dotenv').config(); // Add this FIRST LINE
const express = require('express');
const routes = require('./routes');
const userController = require('./Controllers/UsersController');
const controller = require('./controller');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true // IMPORTANT: Allow cookies
}));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser

app.get('/api', (req, res) => {
  res.json({ "users": ["userone", "usertwo"] });
});

app.use('/', routes);
app.use('/user',userController)

// Create an HTTP server that wraps the Express app
const server = http.createServer(app);

// Initialize Socket.IO on the same server
const socketIo = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true // Allow cookies in Socket.IO
  },
});

// Store mapping between user IDs and socket IDs
const userSocketMap = new Map();

// Handle Socket.IO connections
socketIo.on("connection", socket => {
  console.log('New socket connection:', socket.id);

  socket.on("user-connected", (userId, socketId) => {
    console.log(`User ${userId} connected with socket ${socket.id}`);
    userSocketMap.set(userId, socketId);
  });

  socket.on("send-link-request", (senderId, receiverId) => {
    console.log("Received sender from:", senderId + " and receiver:" + receiverId);
    const receiverSocketId = userSocketMap.get(receiverId);
    
    if (receiverSocketId) {
      console.log("Sending friend request to:", receiverSocketId);
      socketIo.to(receiverSocketId).emit("receive-friend-request", { senderId, receiverId });
    } else {
      console.log(`Receiver ${receiverId} is not connected`);
      const senderSocketId = userSocketMap.get(senderId);
      if (senderSocketId) {
        socketIo.to(senderSocketId).emit("offline-receiver", { senderId, receiverId });
      }
    }
  });

  socket.on("send-message", (senderId, receiverId, message) => {
    console.log(`Sending message from ${senderId} to ${receiverId}: "${message}"`);
    const receiverSocketId = userSocketMap.get(receiverId);

    if (receiverSocketId) {
      console.log(`Receiver is connected with socket ID: ${receiverSocketId}`);
      socketIo.to(receiverSocketId).emit("receive-message", { senderId, receiverId, message });
    } else {
      console.log(`Receiver ${receiverId} is not connected`);
      const senderSocketId = userSocketMap.get(senderId);
      if (senderSocketId) {
        socketIo.to(senderSocketId).emit("offline-receive-message", { senderId, receiverId, message });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    // Remove user from map on disconnect
    for (let [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`User ${userId} removed from map`);
        break;
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend started on port ${PORT}`);
});