const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation')


//Register User
router.post('/register', async (req, res) => {
    //Validation before creating user
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    //check if the user already exist
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('Email already exist')

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    ///create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })

    try {
        const savedUser = await user.save();
        res.send({ user: user._id })

    } catch (error) {
        res.status(400).send(error)
    }

})

//Login
router.post('/login', async (req, res) => {
    //Validation before login user
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    //check if the user already exist
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email is not found')
    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)

    if (!validPass) return res.status(400).send('Invalid Pass')

    //Create and assign a token

    const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).send(token)

})





module.exports = router