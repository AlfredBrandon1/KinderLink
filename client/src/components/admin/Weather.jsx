/* 89e70020981ac4ad8c525a2d89373ae9 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ location, apiKey }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [location, apiKey]);

  return (
    <div>
                <hr/>
      {weatherData && (
        <div>
            <p> just trying to fetch APIs =D </p>
          <h2>{location} </h2>
          <p> Temperature: {weatherData.main.temp} degrees Celsius</p>
          <p> Weather Description: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;


