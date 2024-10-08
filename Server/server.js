
const express = require('express');
const routes = require('./routes');
const controller = require('./controller');
const cors = require('cors');
const http = require('http');


// Your code...


const app = express();
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ "users": ["userone", "usertwo"] });
});

app.use('/', routes);

// Create an HTTP server that wraps the Express app
const server = http.createServer(app);

// Initialize Socket.IO on the same server
const socketIo = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:3000"], // Change to the origin you're allowing
  },
});

// Store mapping between user IDs and socket IDs
const userSocketMap = new Map();

// Handle Socket.IO connections
socketIo.on("connection", socket => {
  console.log(socket.id);

  socket.on("user-connected", (userId, socketId) => {
    console.log(`User ${userId} connected with socket ${socket.id}`);
    // Add user ID and socket ID to the map when a user connects
    userSocketMap.set(userId, socketId);
});

  socket.on("send-link-request", (senderId, recevieverId) => {
    console.log("Received sender from:", senderId + " and recevier:" + recevieverId + " can I print map:" + userSocketMap);
    // Get the receiver's socket ID from the map
    const receiverSocketId = userSocketMap.get(recevieverId);
    if (receiverSocketId) {
      console.log("making sure this was hit:" + receiverSocketId);
        // Send the friend request to the receiver's socket
        socketIo.to(receiverSocketId).emit("receive-friend-request", { senderId, recevieverId });
    } else {
        console.log(`Receiver ${recevieverId} is not connected`);
        const senderIdSocketId = userSocketMap.get(senderId);
        socketIo.to(senderIdSocketId).emit("offline-reciever", { senderId, recevieverId });
      
    }
    // You can process the data and emit an event back if needed
    // socket.emit("response-event", { some: "data" });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });

  socket.on("send-message", (senderId, receiverId, message) => {
    console.log(`Sending message from ${senderId} to ${receiverId}: "${message}"`);

    // Get the receiver's socket ID from the map
    const receiverSocketId = userSocketMap.get(receiverId);

    if (receiverSocketId) {
        console.log(`Receiver is connected with socket ID: ${receiverSocketId}`);

        // Send the message to the receiver's socket
        socketIo.to(receiverSocketId).emit("receive-message", { senderId, receiverId, message });
    } else {
        console.log(`Receiver ${receiverId} is not connected`);

        // Notify the sender that the receiver is offline
        const senderSocketId = userSocketMap.get(senderId);
        if (senderSocketId) {
            socketIo.to(senderSocketId).emit("offline-receive-message", { senderId, receiverId, message });
        }
    }
});


});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend started on port ${PORT}`);
});
