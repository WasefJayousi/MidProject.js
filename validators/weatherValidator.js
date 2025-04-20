const { body, param, query } = require('express-validator');

const addCityValidator = [
  body('city').notEmpty().withMessage('City name is required')
];

const updateCityValidator = [
  body('oldcity').notEmpty().withMessage('Old city name is required'),
  body('newcity').notEmpty().withMessage('New city name is required')
];

const deleteCityValidator = [
  body('city').notEmpty().withMessage('City name is required')
];

const searchCityWeatherValidator = [
  query('city').notEmpty().withMessage('City query parameter is required')
];

const cityLookupValidator = [
  param('id').notEmpty().withMessage('City ID is required')
];

module.exports = {
  addCityValidator,
  updateCityValidator,
  deleteCityValidator,
  searchCityWeatherValidator,
  cityLookupValidator
};
