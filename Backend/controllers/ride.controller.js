const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapsService = require('../services/maps.service');


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

        console.log('pickupLocation received:', pickupLocation); // log input

        const pickupCoordinates = await mapsService.getAddressCoordinate(pickupLocation);
        console.log('Pickup Coordinates:', pickupCoordinates);

        // Fix typo: support both 'lat' and 'ltd' for debugging
        const lat = pickupCoordinates.lat !== undefined ? pickupCoordinates.lat : pickupCoordinates.ltd;
        const lng = pickupCoordinates.lng;

        console.log('Searching for captains near:', { lat, lng, radius: 5 }); // increased radius for debug

        if (
            lat === undefined ||
            typeof lat !== 'number' ||
            typeof lng !== 'number'
        ) {
            return res.status(400).json({ 
                message: 'Invalid pickup coordinates', 
                pickupLocation, 
                pickupCoordinates 
            });
        }

        // Increase radius to 5 for debugging
        const captainInRadius = await mapsService.getCaptainInTheRadius(
            lat,
            lng,
            5
        );
        console.log('Captains in radius (debug):', captainInRadius);

        res.status(201).json({ message: 'Ride created successfully', ride, captainInRadius });

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
