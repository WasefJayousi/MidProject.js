const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // using .env through process.env
const connect = require('./database/connection');

//database connection
connect.ConnectionToMySql()

const authenticationRouter = require('./routes/authentication');
const usersRouter = require('./routes/users');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/authentication', authenticationRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;

  // json the error
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;

/*
4. Weather App with User Preferences
Stack: Node.js, Express.js, JWT, OpenWeather API
Features:
Users register and log in with JWT.
Users can save their favorite cities for quick weather lookup.
Fetch live weather data from OpenWeather API.
CRUD operations on user preferences.
*/