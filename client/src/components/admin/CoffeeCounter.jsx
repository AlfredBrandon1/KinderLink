import React, { useState, useEffect } from "react";
import "./CoffeeCounter.css";

const CoffeeCounter = () => {
  const startDate = new Date("March 20, 2023");
  const coffeePerDay = 3;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor(
    (new Date() - startDate) / millisecondsPerDay
  );
  const [counter, setCounter] = useState(coffeePerDay * daysSinceStart);

  useEffect(() => {
    const timer = setInterval(() => {
      const daysSinceStart = Math.floor(
        (new Date() - startDate) / millisecondsPerDay
      );
      setCounter(coffeePerDay * daysSinceStart);
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate, coffeePerDay, millisecondsPerDay]);

  return (
    <div className="coffee-counter">
        <div className="coffee-counter__title"> Total Coffee Cups </div>
      <div className="coffee-counter__info">
      <img src="https://img.icons8.com/external-justicon-flat-justicon/60/null/external-hot-coffee-coffee-shop-justicon-flat-justicon-2.png"/>
        <div className="coffee-counter__count">{counter}</div>
      </div>
    </div>
  );
};

export default CoffeeCounter;
