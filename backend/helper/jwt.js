const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    return expressJwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            '/api/v1/users/login'
        ]
    })
}

module.exports = authJwt;