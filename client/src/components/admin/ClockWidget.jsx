import React, { useState, useEffect } from "react";
import "./ClockWidget.css";

const ClockWidget = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (date) => {
    const options = { hour: "numeric", minute: "numeric", second: "numeric" };
    return date.toLocaleTimeString("en-US", options);
  };

  const getRotation = (date) => {
    const seconds = date.getSeconds();
    const minutes = date.getMinutes() + seconds / 60;
    const hours = date.getHours() + minutes / 60;
    const secondDegrees = seconds * 6;
    const minuteDegrees = minutes * 6;
    const hourDegrees = hours * 30;
    return {
      second: `rotate(${secondDegrees}deg)`,
      minute: `rotate(${minuteDegrees}deg)`,
      hour: `rotate(${hourDegrees}deg)`,
    };
  };

  const rotationStyles = getRotation(date);

  return (
    <div className="clock-widget">
      <div className="clock-widget__analog">
        <div className="clock-widget__hand clock-widget__hand--hour" style={{ transform: rotationStyles.hour }}></div>
        <div className="clock-widget__hand clock-widget__hand--minute" style={{ transform: rotationStyles.minute }}></div>
        <div className="clock-widget__hand clock-widget__hand--second" style={{ transform: rotationStyles.second }}></div>
        <div className="clock-widget__face"></div>
      </div>
      <div className="clock-widget__time">
        <span className="clock-widget__text">{formatTime(date)}</span>
      </div>
      <div className="clock-widget__date">
        <span className="clock-widget__text">{formatDate(date)}</span>
      </div>
    </div>
  );
};

export default ClockWidget;
