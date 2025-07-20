const { Server } = require('socket.io');
const userModel = require('./models/user.model'); // Assuming you have a user model to manage users
const captainModel = require('./models/captain.model'); // Assuming you have a captain model to manage captains

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });
    io.on('connection', (socket) => {
        // You can add custom connection logic here
        console.log(`Socket connected: ${socket.id}`);

        socket.on('join', async (data) => {
    

    const { userType, userId } = data;

    if (!userId || !userType) {
        console.warn('Missing userType or userId');
        return;
    }

    if (userType === 'user') {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { socketid: socket.id },
            { new: true }
        );
        
        if (!updatedUser) {
            console.warn('No user found with ID:', userId);
        }
    } else if (userType === 'captain') {
        const updatedCaptain = await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        console.log('Updated captain:', updatedCaptain);
        if (!updatedCaptain) {
            console.warn('No captain found with ID:', userId);
        }
    }
});

        // Handle captain location updates
        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;
            if(!location || !location.lat || !location.lng) {
                socket.emit('error', 'Invalid location data');
                return;
            }
            await captainModel.findByIdAndUpdate(userId, { 
                location: {
                    type: 'Point',
                    coordinates: [location.lng, location.lat] // GeoJSON format: [longitude, latitude]
                }
            });
        });

        // Handle user location updates
        socket.on('update-location-user', async (data) => {
            const { userId, location } = data;
            if(!location || !location.lat || !location.lng) {
                socket.emit('error', 'Invalid location data');
                return;
            }
            await userModel.findByIdAndUpdate(userId, { 
                location: {
                    type: 'Point',
                    coordinates: [location.lng, location.lat] // GeoJSON format: [longitude, latitude]
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketid(socketId, messageObject) {
    console.log('Sending message to socketId:', socketId, 'Message:', messageObject);
     if (!io) return console.error('Socket.io not initialized');

    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
        console.warn(`No active socket found for ID: ${socketId}`);
        return;
    }

    console.log('✅ Emitting to connected socketId:', socketId);
    socket.emit(messageObject.event, messageObject.data);
}

module.exports = {
    initializeSocket,
    sendMessageToSocketid
};
