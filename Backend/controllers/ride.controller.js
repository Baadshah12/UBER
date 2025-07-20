const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapsService = require('../services/maps.service');
const {sendMessageToSocketid} = require('../socket');
const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickupLocation, dropLocation, vehicleType } = req.body;
    try {   
        const ride = await rideService.createRide({
            user: req.user._id, 
            pickupLocation,
            dropLocation,
            vehicleType
        });

        // Fetch the ride from DB with OTP and user populated
        const rideWithUser = await rideModel.findById(ride._id).select('+otp').populate('user');

        // Get user's current GPS location instead of geocoding pickup address
        const user = await userModel.findById(req.user._id);
        console.log('User location from database:', user.location);

        if (!user.location || !user.location.coordinates || user.location.coordinates.length !== 2) {
            return res.status(400).json({ 
                message: 'User location not available. Please allow location access.',
                pickupLocation
            });
        }

        // Extract lat/lng from GeoJSON coordinates [longitude, latitude]
        const [lng, lat] = user.location.coordinates;

        console.log('Using user GPS coordinates:', { lat, lng, radius: 20 });

        // Search for captains near user's GPS location
        const captainInRadius = await mapsService.getCaptainInTheRadius(
            lat,
            lng,
            20  // Increased radius to 20 km
        );

        captainInRadius.map(captain => {
            sendMessageToSocketid(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });
        
        res.status(201).json({ 
            message: 'Ride created successfully', 
            ride: rideWithUser, 
            captainInRadius,
            userLocation: { lat, lng }
        });

    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }       
};

module.exports.getFare= async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickupLocation, dropLocation } = req.query || {};

    if (!pickupLocation || !dropLocation) {
  return res.status(400).json({ error: "Missing pickupLocation or dropLocation in query" });
    }

    try {
        const fare = await rideService.getFare(pickupLocation, dropLocation);
        res.status(200).json({ fare });
    } catch (error) {
        console.error('Error fetching fare:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    try {
        const ride = await rideService.confirmRide({rideId, captain: req.captain});
        
        // Ensure OTP is included in the response
        const rideWithOtp = await rideModel.findOne({ _id: rideId })
            .populate('user')
            .populate('captain')
            .select('+otp');
            
        console.log('=== RIDE CONFIRMATION DEBUG ===');
        console.log('Ride with OTP:', rideWithOtp);
        console.log('OTP value:', rideWithOtp?.otp);
        console.log('Captain data:', rideWithOtp?.captain);
        console.log('User data:', rideWithOtp?.user);
        console.log('=== END RIDE CONFIRMATION DEBUG ===');
            
        sendMessageToSocketid(ride.user.socketid, {
            event: 'ride-confirmed',
            data: rideWithOtp
        });
        res.status(200).json({ message: 'Ride confirmed successfully', ride: rideWithOtp });
    } catch (error) {
        console.error('Error confirming ride:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.body;
    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });
        
        sendMessageToSocketid(ride.user.socketid, { 
            event: 'ride-started',
            data: ride
        });
        res.status(200).json({ message: 'Ride started successfully', ride });
    } catch (error) {
        console.error('Error starting ride:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports.finishRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    try {
        const ride = await rideService.finishRide({ rideId, captain: req.captain });

        sendMessageToSocketid(ride.user.socketid, {
            event: 'ride-finished',
            data: ride
        });

        res.status(200).json({ message: 'Ride finished successfully', ride });
    } catch (error) {
        console.error('Error finishing ride:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}