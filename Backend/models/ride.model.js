const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain'
    },
    pickupLocation: {
        type: String,
        required: true
    },
    dropLocation: {
        type: String,
        required: true
    },
   fare:{
       type: Number,
       required: true
   },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'in-progress', 'completed', 'cancelled'],
        default: 'requested'
    },
    duration: {
        type: Number, // Duration in seconds
        
    },
    distance: {
        type: Number, // Distance in kilometers
        
    },
    paymentID: {
        type: String,
    },
    orderId:{
        type: String,
    },
    signature: {
        type: String,
    },
    otp:{
        type: String,
        select: false ,// Do not return OTP in queries
        required: true
    },
    pickupAddress: {
        type: String
    },
    dropAddress: {
        type: String
    }
    
});

module.exports = mongoose.model('ride', rideSchema);


