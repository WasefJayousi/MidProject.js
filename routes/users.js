const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../config/verifytoken')
const usercontroller = require('../controller/usercontroller')

// get favorite cities of the user
router.get('/favoriteCities' , authenticateToken,usercontroller.FavoriteCitites)

// get a certain city quick lookup using the id of the city in the database
router.get('/favoritecitylookup/:id' , authenticateToken,usercontroller.lookup)

// user add favorite city
router.post('/addcity',authenticateToken, usercontroller.addcity);

//update favorite city
router.put('updatecity/:id',authenticateToken,usercontroller.updatecity)

//delete favorite city
router.delete('delete/:id' , authenticateToken , usercontroller.deletecity) 

module.exports = router;
