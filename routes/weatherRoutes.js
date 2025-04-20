const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../config/verifytoken')
const weathercontroller = require('../controller/weathercontroller')

const validateRequest = require('../config/validateRequest');
const {
  addCityValidator,
  updateCityValidator,
  deleteCityValidator,
  searchCityWeatherValidator,
  cityLookupValidator
} = require('../validators/weatherValidator');

//search weather 
router.get('/SearchCityWeather', searchCityWeatherValidator, validateRequest, weathercontroller.SearchCityWeather);

// get favorite cities of the user
router.get('/favoriteCities', authenticateToken, weathercontroller.FavoriteCitites);

// get a certain city quick lookup using the id of the city in the database
router.get('/favoritecitylookup/:id', authenticateToken, cityLookupValidator, validateRequest, weathercontroller.lookup);

// user add favorite city
router.post('/addcity', authenticateToken, addCityValidator, validateRequest, weathercontroller.addcity);

//update favorite city
router.put('/updatecity', authenticateToken, updateCityValidator, validateRequest, weathercontroller.updatecity);

//delete favorite city
router.delete('/deletecity', authenticateToken, deleteCityValidator, validateRequest, weathercontroller.deletecity);

module.exports = router;
