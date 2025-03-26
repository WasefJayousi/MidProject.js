const express = require('express');
const router = express.Router();
const authcontroller = require('../controller/authenticationcontroller')


// register user
router.post('/register', authcontroller.register);

// login user
router.post("/login", authcontroller.login);

//logout

module.exports = router;
