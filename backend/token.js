const jwt = require("jsonwebtoken");
require('dotenv').config();

function token(id,name) {
    const token = jwt.sign(
        {
            userId: id,
            username: name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );
    return token;
}


module.exports = { token };