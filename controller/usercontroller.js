const {GetConnection} = require('../database/connection')

exports.FavoriteCitites =  async (req,res,next) => {
    try {
      const userid = req.user 
      const connection = GetConnection()
      const [result,fields] = await connection.query(`SELECT City FROM favorite WHERE userid = ?` , [userid]) 
      return res.status(200).json({cities : result[0]})
    } catch (error) {
      console.log(`error : ${error}`)
      next()
    }
}

exports.lookup = async (req,res,next) => {
    try {
      const userid = req.user 
      const connection = GetConnection()
      const [result,fields] = await connection.query(`SELECT City FROM favorite WHERE userid = ?` , [userid]) 
      const city = result[0].city
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.weatherapikey}`;
      const response = await fetch(url)
      const weatherData = await response.json()
      return res.status(200).json({cities : weatherData}) // all data for now
    } catch (error) {
      console.log(`error : ${error}`)
      next()
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
      const [result,fields] = await connection.query(`INSERT INTO favorite(userid,city) INTO(?,?) WHERE userid = ?` , [userid,city,userid]) 
      return res.status(200).json({message:"favorite city added!"})
    } catch (error) {
      console.log(`error : ${error}`)
      next()
}
}

exports.updatecity = async (req,res,next) => {
    try {
      const userid = req.user 
      const {oldcity,newcity} = req.body
      const connection = GetConnection()
      const [result,fields] = await connection.query(`UPDATE favorite SET city = ? WHERE userid = ? and city = ?` , [newcity,userid,oldcity]) 
      return res.status(200).json({message:"city updated"})
    } catch (error) {
      console.log(`error : ${error}`)
      next()
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
      next()
    }
  }
  