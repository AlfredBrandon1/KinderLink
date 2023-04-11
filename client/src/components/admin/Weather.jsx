/* 89e70020981ac4ad8c525a2d89373ae9 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FaCloudSun,
    FaMapMarkerAlt,
    FaCloud,
    FaSun,
    FaMoon,
    FaTemperatureHigh,
    FaClock
} from "react-icons/fa";

import "./Weather.css";

const Weather = ({ location, apiKey }) => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
            )
            .then((response) => {
                setWeatherData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [location, apiKey]);

    return (
        <div className="weather-card">
            {weatherData && (
                <div className="weather-card__container">
                    <p className="weather-card__title">
                        <FaCloudSun /> Current Weather
                    </p>
                    <div className="weather-card__info">
                        <div className="weather-card__loc">
                            <FaMapMarkerAlt /> {location}
                        </div>
                        <div className="weather-card__temp">
                            <FaTemperatureHigh />
                            {weatherData.main.temp} °C
                        </div>
                        <div className="weather-card__desc">
                            <FaCloud /> {weatherData.weather[0].description}
                        </div>
                        <div className="weather-card__sunrise">
                            <FaSun /> Sunrise:{" "}
                            {new Date(
                                weatherData.sys.sunrise * 1000
                            ).toLocaleTimeString()}
                        </div>
                        <div className="weather-card__sunset">
                            <FaMoon /> Sunset:{" "}
                            {new Date(
                                weatherData.sys.sunset * 1000
                            ).toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;
