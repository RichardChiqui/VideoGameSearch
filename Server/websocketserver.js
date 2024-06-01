// const WebSocket = require('ws')
// const wss = new WebSocket.server({server})

const setupWebSocketConnection = (wss, clients) => {
    console.log("connection websocket started:" + clients);
    wss.on('connection', (ws) => {
        console.log("connection websocket pt1");
        ws.on('message', (message) => {
            console.log("Received message:", message);
            try {
                const data = JSON.parse(message);
                console.log("Parsed message:", data);
                console.log("what is datatype:" + data.type);
                switch(data.type) {
                    case 'register':
                        clients.set(data.userId, ws);
                        break;
                    case 'friend_request':
                        console.log("So now we in here:" + data.senderId);
                        const senderWs = clients.get(data.senderId);
                        console.log("That is what we got right?:" + senderWs);
                        if (senderWs) {
                            console.log("And letrs send:" + senderWs)
                            senderWs.send(JSON.stringify({
                                type: 'friend_request',
                                sender: data.senderId,
                                recevier: data.recipientId
                            }));
                        }
                        break;
                    default:
                        console.log("Unknown message type:", data.type);
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        });

        ws.on('close', () => {
            if(clients != null && clients){
                for (let [userId, clientWs] of clients.entries()) {
                    if (clientWs === ws) {
                        clients.delete(userId);
                        break;
                    }
            }
            }
          
        });
    });
};

module.exports = setupWebSocketConnection;
