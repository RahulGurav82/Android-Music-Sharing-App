const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const cors = require('cors');
app.use(cors());

// Store rooms with their IDs and names
const rooms = {};

// Serve a basic HTML page on the root URL
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Socket.IO Server</h1>');
});

// Listen for connections
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Listen for createRoom event
    socket.on('createRoom', (roomName, callback) => {
        const roomId = Math.random().toString(36).substring(2, 15); // Generate room ID
        rooms[roomId] = roomName; // Store room ID and name

        socket.join(roomId); // Join the room
        console.log('Room created: ' + roomId + ' with name: ' + roomName);
        
        // Emit roomCreated event back to the client
        socket.emit('roomCreated', roomId); // Always emit roomCreated
        
        // If the callback exists, call it
        if (typeof callback === 'function') {
            callback(roomId); // Send roomId back via callback if needed
        }
    });

    // Listen for joinRoom event
    socket.on('joinRoom', (roomId, callback) => {
        if (roomId && rooms[roomId]) {
            socket.join(roomId); // Join the room
            const roomName = rooms[roomId]; // Get the room name
            console.log('User ' + socket.id + ' joined room: ' + roomId + ' (' + roomName + ')');
            
            // Emit success response with room name and roomId
            socket.emit('roomJoined', true, roomName);
            
            // Call the callback function if provided, and pass the room name and roomId
            if (typeof callback === 'function') {
                callback(true, roomName);
            }
        } else {
            console.log('Failed to join room: ' + roomId);
            // Emit failure response if room ID is invalid
            socket.emit('roomJoined', false);
            
            if (typeof callback === 'function') {
                callback(false);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://192.168.22.27:3000');
});
