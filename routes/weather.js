const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../config/verifytoken')
const weathercontroller = require('../controller/weathercontroller')

//search weather 
router.get('/SearchCityWeather' ,weathercontroller.SearchCityWeather)

// get favorite cities of the user
router.get('/favoriteCities' , authenticateToken,weathercontroller.FavoriteCitites)

// get a certain city quick lookup using the id of the city in the database
router.get('/favoritecitylookup/:id' , authenticateToken,weathercontroller.lookup)

// user add favorite city
router.post('/addcity',authenticateToken, weathercontroller.addcity);

//update favorite city
router.put('/updatecity',authenticateToken,weathercontroller.updatecity)

//delete favorite city
router.delete('/deletecity' , authenticateToken , weathercontroller.deletecity) 

module.exports = router;
