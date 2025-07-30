const axios = require('axios');
const captainModel = require('../models/captain.model');
const userModel = require('../models/user.model');

// Helper function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

module.exports.getAddressCoordinate = async (address) => {
        const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainInTheRadius = async (lat, lng, radius) => {
    try {
        // Log for debugging
        const allCaptains = await captainModel.find({});
        console.log('=== CAPTAIN SEARCH DEBUG ===');
        console.log('Search center:', { lat, lng });
        console.log('Search radius:', radius, 'km');
        console.log('All captains in database:', allCaptains.length);
        console.log('Captain locations:', allCaptains.map(c => ({
            id: c._id,
            location: c.location,
            coordinates: c.location?.coordinates,
            hasLocation: !!c.location?.coordinates
        })));

        // Check if any captains have valid location data
        const captainsWithLocation = allCaptains.filter(c => c.location && c.location.coordinates && c.location.coordinates.length === 2);
        console.log('Captains with valid location data:', captainsWithLocation.length);

        // Calculate distances for debugging
        captainsWithLocation.forEach(captain => {
            const [captainLng, captainLat] = captain.location.coordinates;
            const distance = calculateDistance(lat, lng, captainLat, captainLng);
            console.log(`Captain ${captain._id}: distance = ${distance.toFixed(2)} km`);
        });

        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radius / 6378.14] // GeoJSON format: [longitude, latitude]
                }
            }
        });
        console.log('Query parameters:', { 
            center: [lng, lat], 
            radiusInRadians: radius / 6378.14,
            radiusInKm: radius
        });
        console.log('Found captains in radius:', captains.length);
        console.log('=== END DEBUG ===');
        return captains;
    } catch (error) {
        console.error('Error in getCaptainInTheRadius:', error);
        throw error;
    }
}

// New function to get user's current location
module.exports.getUserLocation = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        if (user && user.location && user.location.coordinates && user.location.coordinates.length === 2) {
            const [lng, lat] = user.location.coordinates; // GeoJSON format: [longitude, latitude]
            return {
                lat: lat,
                lng: lng
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting user location:', error);
        return null;
    }
}

module.exports.getAddressFromCoordinates = async (lat, lng) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK' && response.data.results.length > 0) {
            return response.data.results[0].formatted_address;
        } else {
            throw new Error('Unable to fetch address from coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

