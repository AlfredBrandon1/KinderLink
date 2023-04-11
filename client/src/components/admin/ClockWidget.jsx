import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
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

  return (
    <div className="clock-widget">
      <div className="clock-widget__time">
        <FaClock />
        <span className="clock-widget__text">{formatTime(date)}</span>
      </div>
      <div className="clock-widget__date">
        <span className="clock-widget__text">{formatDate(date)}</span>
      </div>
    </div>
  );
};

export default ClockWidget;
