require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET weather data. */
router.get('/', async function(req, res, next) {
  const city = req.query.city;   // ✅ FIX 1: read city from query
  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  try {
    const apiKey = process.env.OPENWEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    // If city not found
    if (!data || !data.name) {
      return res.status(404).json({ error: "City not found" });
    }

    // Normalize response
    const weatherInfo = {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].description,
      windSpeed: data.wind.speed,
      timestamp: new Date().toISOString()
    };

    res.json(weatherInfo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not fetch weather data" });
  }
});

module.exports = router;
