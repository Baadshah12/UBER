const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');
const crypto = require('crypto');


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

    const ride = rideModel.create({
        user,
        pickupLocation,
        dropLocation,
        otp: getOtp(4),
        fare: fare[vehicleType],
    });

    return ride;
};

