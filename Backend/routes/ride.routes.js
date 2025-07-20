const express= require('express');
const router=express.Router();
const {body,query} =require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create',
    authMiddleware.authUser,
    body('pickupLocation').isLength({min:5}).withMessage('Pickup location must be at least 5 characters long'),
    body('dropLocation').isLength({min:5}).withMessage('Drop location must be at least 5 characters long'),
    body('vehicleType').isIn(['moto', 'car', 'auto']).withMessage('Vehicle type must be one of moto, car, or auto'),
    rideController.createRide
)

router.get('/getFare',
    authMiddleware.authUser,
    query('pickupLocation').isLength({min:5}).withMessage('Pickup location must be at least 5 characters long'),
    query('dropLocation').isLength({min:5}).withMessage('Drop location must be at least 5 characters long'),
    rideController.getFare
);

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.confirmRide
);

router.post('/start',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    body('otp').isLength({min:4}).withMessage('OTP must be 4 digits'),
    rideController.startRide
);

router.post('/finish',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.finishRide
);



module.exports=router;