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
    console.log(`JOIN EVENT | socket.id: ${socket.id}, data:`, data);

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
        console.log('Updated user:', updatedUser);
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

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;
            if(!location || !location.lat || !location.lng) {
                socket.emit('error', 'Invalid location data');
                return;
            }
            await captainModel.findByIdAndUpdate(userId, { location: {
                lat: location.lat,
                lng: location.lng
            }});
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketid(socketId, message) {
    if (io) {
        io.to(socketId).emit('message', message);
    }
    else{
        console.error('Socket.io is not initialized');
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketid
};
