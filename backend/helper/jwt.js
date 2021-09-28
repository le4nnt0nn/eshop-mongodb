const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // Excluye de autenticación la carpeta uploads
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS']},
            // Para que el usuario pueda ejecutar GET en products
            // La expresión regular obtiene todas las variantes de products (ej: featured/3)
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
}


// Chequea si Admin o Cliente
async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true)
    }

    done();
}

module.exports = authJwt;