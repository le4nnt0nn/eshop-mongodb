function errorHandler(err, req, res ,next) {
    // jwt error de autenticación
    if (err === 'UnauthorizedError') {
       return res.status(500).json({message: 'The user is not authorized'})
    }

    // errror de validación
    if(err === 'ValidationError') {
        return res.status(401).json({message: err})
    }

    // default error
    return res = res.status(500).json(err);
}

module.exports = errorHandler;