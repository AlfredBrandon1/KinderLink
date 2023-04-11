import React, { useState } from "react";
import "./CalendarWidget.scss";

function CalendarWidget() {
    const [selectedDate, setSelectedDate] = useState(null);

    const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

    const getMonthName = (monthIndex) => {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return monthNames[monthIndex];
    };

    const getCurrentDate = () => {
        const now = new Date();
        const day = now.getDate();
        const monthIndex = now.getMonth();
        const monthName = getMonthName(monthIndex);
        const year = now.getFullYear();
        return `${monthName} ${day}, ${year}`;
    };

    const handleDateClick = (event) => {
        const date = parseInt(event.target.textContent);
        setSelectedDate(date);
    };

    return (
        <main className="card">
            <section className="card__header">
                <h3>{getCurrentDate()}</h3>
            </section>
            <section className="card__body">
                <ul className="card__body--days">
                    {daysOfWeek.map((day) => (
                        <li key={day}>{day}</li>
                    ))}
                </ul>
                <ul className="card__body--dates">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                        <li
                            key={date}
                            className={`${
                                date === selectedDate ? "active" : ""
                            }`}
                            onClick={handleDateClick}
                        >
                            {date}
                        </li>
                    ))}
                </ul>
            </section>
            <div className="card__footer">
                <p>{new Date().toLocaleTimeString()}</p>
                <a href="#" className="add">
                    +
                </a>
                <p>
                    12<sup>o</sup> C
                </p>
            </div>
        </main>
    );
}

export default CalendarWidget;
