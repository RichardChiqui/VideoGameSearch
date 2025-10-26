// Define the function to set up socket event handlers
const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('link-request', (userId,email) => {
            console.log('User:' + email + " with id:" + userId + " attemtped to send a link request");
        });

        // socket.on('friend_request', (data) => {
        //     // Handle friend request logic
        //     console.log('Received friend request:', data);
        // });

        // Define other event handlers as needed
    });
};

// Export the function to set up socket event handlers
module.exports = setupSocketHandlers;
