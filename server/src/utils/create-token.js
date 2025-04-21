const jwt = require('jsonwebtoken');

// This function is used to generate JWT token
generateToken = (payload, expireIn = process.env.JWT_EXPIRES_IN) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expireIn,
    });
};

module.exports = generateToken;