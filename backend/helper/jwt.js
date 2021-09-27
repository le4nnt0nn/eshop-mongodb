const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            // Para que el usuario pueda ejecutar GET en products
            {url: `${api}/products` , methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
}

module.exports = authJwt;