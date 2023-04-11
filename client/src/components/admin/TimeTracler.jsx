import React, { useState, useEffect } from "react";
import "./TimeTracker.scss";

function TimeTracker() {
    const [time, setTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const startDateTime = new Date("March 25, 2023 00:00:00").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = now - startDateTime;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTime({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="timer-container">
            <p className="timer-title">Time spent in making this project:</p>
            <div className="timer">
            
                <div className="timer__item">
                    <div className="timer__time">{time.days}</div>
                    <div className="timer__label">Days</div>
                </div>
                <div className="timer__item">
                    <div className="timer__time">{time.hours}</div>
                    <div className="timer__label">Hours</div>
                </div>
                <div className="timer__item">
                    <div className="timer__time">{time.minutes}</div>
                    <div className="timer__label">Minutes</div>
                </div>
                <div className="timer__item">
                    <div className="timer__time">{time.seconds}</div>
                    <div className="timer__label">Seconds</div>
                </div>
            </div>
        </div>
    );
}

export default TimeTracker;
