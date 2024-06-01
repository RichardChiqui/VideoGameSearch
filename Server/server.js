const express = require('express');
const routes = require('./routes');
const controller = require('./controller');
const cors = require('cors');
const http = require('http');
const setupWebSocketServer = require('./websocketserver');
const WebSocket = require('ws'); // Import the 'ws' module

const socketIo = require('socket.io')(5000);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ "users": ["userone", "usertwo"] });
});

app.use('/', routes);

// Create an HTTP server that wraps the Express app
const server = http.createServer(app);
const clients = new Map();

// Setup WebSocket server using WebSocket.Server
const wss = new WebSocket.Server({ server }); // Use WebSocket.Server
console.log("setting websockletconnection");
setupWebSocketServer(wss, clients);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend started on port ${PORT}`);
});
