const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');
const crypto = require('crypto');
const { sendMessageToSocketid } = require('../socket');


async function getFare(pickupLocation, dropLocation) {
    if(!pickupLocation || !dropLocation) {
        throw new Error('Pickup and drop locations are required to calculate fare');
    }

    const distanceTime = await mapService.getDistanceTime(pickupLocation, dropLocation);

    const baseFare = {
        moto : 20,
        car: 40,
        auto: 30
    };

    const perKmRates = {
        moto : 8,
        car: 15,
        auto: 10
    };

    const perMinRates = {
        moto : 1,
        car: 2,
        auto: 1.5
    };

    
    const fare={
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRates.auto) + ((distanceTime.duration.value / 60) * perMinRates.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRates.car) + ((distanceTime.duration.value / 60) * perMinRates.car)),
        moto : Math.round(baseFare.moto  + ((distanceTime.distance.value / 1000) * perKmRates.moto ) + ((distanceTime.duration.value / 60) * perMinRates.moto ))
    }
    return fare;
}

module.exports.getFare = getFare;

function getOtp(num){
    function generateOtp(num){
        const otp=crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
        return otp;
        
    }
    return generateOtp(num);
}

module.exports.createRide = async ({
    user,
    pickupLocation,
    dropLocation,
    vehicleType
}) => {
    if (!user || !pickupLocation || !dropLocation || !vehicleType) {
        throw new Error('User ID, pickup location, drop location and vehicle type are required');
    }

    const fare = await getFare(pickupLocation, dropLocation);
    const otp = getOtp(4);
    
    console.log('=== RIDE CREATION DEBUG ===');
    console.log('Generated OTP:', otp);
    console.log('Fare:', fare);
    console.log('Vehicle Type:', vehicleType);
    console.log('Selected Fare:', fare[vehicleType]);

    const ride = await rideModel.create({
        user,
        pickupLocation,
        dropLocation,
        otp: otp,
        fare: fare[vehicleType],
    });

    console.log('Ride created with OTP:', otp);
    console.log('=== END RIDE CREATION DEBUG ===');

    return ride;
};

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride ID and OTP are required');
    }

    const ride = await rideModel.findById(rideId).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if(ride.status !== 'accepted') {
        throw new Error('Ride is not accepted');
    }

    console.log('startRide: expected OTP:', ride.otp, 'received OTP:', otp);
    if(ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'started',
        captain: captain._id
    })

    sendMessageToSocketid(ride.user.socketid, {
        event: 'ride-started',
        data: ride
    });

    return ride;    
}

module.exports.finishRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }


    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if(ride.status !== 'started') {
        throw new Error('Ride is not started');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'finished'})
    return ride;
}

