const {GetConnection} = require('../database/connection')

exports.FavoriteCitites =  async (req,res,next) => {
    try {
      const userid = req.user
      const connection = GetConnection()
      const [result,fields] = await connection.query(`SELECT city,id FROM favorite WHERE userid = ?` , [userid]) 
      return res.status(200).json({cities : result[0]})
    } catch (error) {
      console.log(`error : ${error}`)
      next(error)
    }
}

exports.lookup = async (req,res,next) => {
    try {
      const userid = req.user 
      const id = req.params.id
      const connection = GetConnection()
      
      const [result,fields] = await connection.query(`SELECT city FROM favorite WHERE userid = ? and id = ? limit 1` , [userid,id]) 
      if(!result) return res.status(404).json({error:"city not found!"})
      const city = result[0].city

      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.weatherapikey}`;
      const response = await fetch(url)
      const weatherData = await response.json()
      const Weatherdetails = {temperature:weatherData.main.temp + ' °C' , humidity:weatherData.main.humidity + ' %' , speed:weatherData.wind.speed + " km/h" , description:weatherData.weather[0].description , detailedweather:weatherData}

      return res.status(200).json({Weather : Weatherdetails}) //return res.status(200).json({Weather : weatherData}) // all data for now
    } catch (error) {
      console.log(`error : ${error}`)
      next(error)
    }
}
exports.addcity = async(req, res,next) =>{
    try {
      const userid = req.user 
      const city = req.body.city

      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.weatherapikey}`;
      const response = await fetch(url)
      const weatherData = await response.json()
      if(weatherData.cod === '404') return res.status(404).json({error:"this city does not exist!"}) // if the user enters a wrong city meaning a city that doesn't exist , return error

      const connection = GetConnection()
      await connection.query(`INSERT INTO favorite(userid,city) VALUES(?,?)` , [userid,city]) 
      return res.status(200).json({message:"favorite city added!"})
    } catch (error) {
      console.log(`error : ${error}`)
      next(error)
}}

exports.updatecity = async (req,res,next) => {
    try {
      const userid = req.user 
      const {oldcity,newcity} = req.body
      const connection = GetConnection()
      const [result,fields] = await connection.query(`UPDATE favorite SET city = ? WHERE userid = ? and city = ?` , [newcity,userid,oldcity]) 
      return res.status(200).json({message:"city updated"})
    } catch (error) {
      console.log(`error : ${error}`)
      next(error)
    }
  }

exports.deletecity = async (req,res,next) => {
    try {
      const userid = req // req.idk still
      const {city} = req.body.city
      const connection = GetConnection()
      const [result,fields] = await connection.query(`DELETE FROM favorite WHERE userid = ? and city = ?` , [userid,city]) 
      return res.status(200).json({message:"city updated"})
    } catch (error) {
      console.log(`error : ${error}`)
      next(error)
    }
  }
  