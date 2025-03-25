const express = require('express');
const router = express.Router();
const authcontroller = require('../controller/authenticationcontroller')


// register user
app.post('/register', authcontroller.register);

// login user
app.post("/login", authcontroller.login);

//logout

module.exports = router;
