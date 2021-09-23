const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res)=>{
    /* Si quiero filtrar y que salgan 3 parámetros ej
    .select(name email phone) */
    const userList = await User.find().select('-passwordHash');
    if(!userList) {
        res.status(500).json({success : false})
    }
    res.send(userList);
})

router.get(`/:id`, async (req, res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found'})
    }
    res.status(200).send(user);
})

router.post('/', async (req, res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        /* bycrypt permite encriptar la password
           pasa de passwordHash a password en el post (OJO)
        */
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(404).send('the user cannot be created!')

    res.send(user);
})

/* autenticación */
router.post('/login', async (req, res)=> {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;

    if(!user) {
        return res.status(400).send('The user not found');
    }
    /* compara la contraseña del body y la del usuario elegido */
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        /* token generado a través de id | el secret del token (psswd) es secret */
        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            /* el token expira en: 1día */
            {expiresIn: '1d'}
        )

        res.status(200).send({user: user.email , token: token})
    } else {
        res.status(400).send('password is wrong')
    }
})


// exporta el modulo router
module.exports = router;