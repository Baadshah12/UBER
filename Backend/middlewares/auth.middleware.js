const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');


module.exports.authUser = async (req, res, next) => {
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token:token});
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted. Please log in again.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id)
        req.user = user;
        return next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log('authCaptain: received token:', token);
    if (!token) {
        console.log('authCaptain: No token provided');
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token:token});
    if (isBlacklisted) {
        console.log('authCaptain: Token is blacklisted');
        return res.status(401).json({ message: 'Token is blacklisted. Please log in again.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('authCaptain: decoded payload:', decoded);
        const captain = await captainModel.findById(decoded.id)
        if (!captain) {
            console.log('authCaptain: No captain found for id:', decoded.id);
        }
        req.captain = captain;
        return next()
    } catch (error) {
        console.log('authCaptain: Invalid token error:', error);
        return res.status(400).json({ message: 'Invalid token' });
    }
}