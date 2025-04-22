const {GetConnection} = require('../database/connection')

exports.SearchCityWeather = async (req,res,next) => {
  try {
    const city = req.query.city

    if(!city) return res.status(400).json({error:"city not provided"})

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.weatherapikey}`;
    const response = await fetch(url)
    const weatherData = await response.json()
    if(weatherData.cod === '404') return res.status(404).json({error:"this city does not exist!"}) // if the user enters a wrong city meaning a city that doesn't exist , return error

    const Weatherdetails = {temperature:weatherData.main.temp + ' °C' , humidity:weatherData.main.humidity + ' %' , speed:weatherData.wind.speed + " km/h" , description:weatherData.weather[0].description , detailedweather:weatherData}

    return res.status(200).json({Weather : Weatherdetails}) //return res.status(200).json({Weather : weatherData}) // all data for now
  } catch (error) {
    console.log(`error : ${error}`)
    next(error)
  }
}

exports.FavoriteCitites =  async (req,res,next) => {
    try {
      const userid = req.user.id
      if(!userid) return res.status(400).json({error:"user id not provided"})
      const connection = GetConnection()
      const [result,fields] = await connection.query(`SELECT city,id FROM favorite WHERE userid = ?` , [userid]) 
      return res.status(200).json({cities : result})
    } catch (error) {
      console.log(`error : ${error}`)
      next(error)
    }
}

exports.lookup = async (req, res, next) => {
  try {
    const userid = req.user.id;
    const id = req.params.id;

    if (!id) return res.status(400).json({ error: "City ID not provided!" });
    if(!userid) return res.status(400).json({error:"user id not provided"})

    const connection = GetConnection();

    
    const [result] = await connection.query(
      `SELECT city FROM favorite WHERE userid = ? AND id = ? LIMIT 1`,
      [userid, id]
    );

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "City not found!" });
    }

    const city = result[0].city;

   
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.weatherapikey}`;
    const response = await fetch(url);
    const weatherData = await response.json();


    if (weatherData.cod === '404') {
      return res.status(404).json({ error: "This city does not exist in weather API!" });
    }

    const Weatherdetails = {
      temperature: weatherData.main.temp + ' °C',
      humidity: weatherData.main.humidity + ' %',
      speed: weatherData.wind.speed + ' km/h',
      description: weatherData.weather[0].description,
      detailedweather: weatherData
    };

    return res.status(200).json({ Weather: Weatherdetails });
  } catch (error) {
    console.log(`error : ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addcity = async(req, res,next) =>{
    try {
      const userid = req.user.id 
      const city = req.body.city
      if(!city) return res.status(400).json({error:"no city provided to add"})
      if(!userid) return res.status(400).json({error:"user id not provided"})
        
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.weatherapikey}`;
      const response = await fetch(url)
      const weatherData = await response.json()
      if(weatherData.cod === '404') return res.status(404).json({error:"this city does not exist!"}) // if the user enters a wrong city meaning a city that doesn't exist , return error

      const connection = GetConnection()
      const [result,fields] = await connection.query(`SELECT city FROM favorite WHERE userid = ? and city = ?` , [userid,city])
      if(result.length > 0) return res.status(200).json({error:"city already exists in you're database list!"})
    
      await connection.query(`INSERT INTO favorite(userid,city) VALUES(?,?)` , [userid,city]) 
      return res.status(200).json({message:"favorite city added!"})

    } catch (error) {
      console.log(`error : ${error}`)
      next(error)}
    }


exports.updatecity = async (req,res,next) => {
    try {
      const userid = req.user.id 
      const {oldcity,newcity} = req.body
      if(!userid) return res.status(400).json({error:"user id not provided"})
      if(!oldcity && !newcity) return res.status(400).json({error:"oldcity and newcity not provided!"})
      const connection = GetConnection()

      const [exists,f] = await connection.query(`SELECT city FROM favorite WHERE userid = ? and city = ?` , [userid,newcity])
      if(exists.length > 0) return res.status(200).json({error:"city already exists in you're database list!"})

      const url = `http://api.openweathermap.org/data/2.5/weather?q=${newcity}&units=metric&appid=${process.env.weatherapikey}`;
      const response = await fetch(url)
      const weatherData = await response.json()
      if(weatherData.cod === '404') return res.status(404).json({error:"this city does not exist!"}) // if the user enters a wrong city meaning a city that doesn't exist , return error

      const [result,fields] = await connection.query(`UPDATE favorite SET city = ? WHERE userid = ? and city = ?` , [newcity,userid,oldcity]) 
      return res.status(200).json({message:"city updated"})

    } catch (error) {
      console.log(`error : ${error}`)
      next(error)
    }
  }

exports.deletecity = async (req,res,next) => {
    try {
      const userid = req.user.id
      const city = req.body.city
      if(!userid) return res.status(400).json({error:"user id not provided"})
      if(!city) return res.status(400).json({message:"city not provided!"})
      const connection = GetConnection()
      const [result,fields] = await connection.query(`DELETE FROM favorite WHERE userid = ? and city = ?` , [userid,city])
      if(result.affectedRows === 0) return res.status(404).json({error:"City does not exist in db!"})
      return res.status(200).json({message:"city deleted"})
    } catch (error) {
      console.log(`error : ${error}`)
      next(error)
    }
  }
      
