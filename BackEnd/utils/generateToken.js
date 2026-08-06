const jwt = require("jsonwebtoken");

function generateAccessToken(id, username, isPremiumUser) {
    return jwt.sign(
        {
            userId: id,
            username: username,
            isPremiumUser: isPremiumUser
        },
        "secretkey"
    );
}

module.exports = generateAccessToken;