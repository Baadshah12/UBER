const mongoose = require('mongoose');

function connectToDatabase() {
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => {
            console.log('MongoDB connected successfully');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
}

module.exports = connectToDatabase;
