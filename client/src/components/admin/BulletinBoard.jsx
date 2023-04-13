import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BulletinBoard.css";

const BulletinBoard = () => {
    const BackendApi = "https://kinderlink.onrender.com";
    const [announcements, setAnnouncements] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        axios
            .get(`${BackendApi}/api/v1/announcement/`)
            .then((response) => {
                const sortedAnnouncements = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setAnnouncements(sortedAnnouncements);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handlePrevClick = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? announcements.length - 1 : prevIndex - 1
        );
    };

    const handleNextClick = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="bulletin-board-container">
            <p className="bulletin-title">Bulletin Board</p>
            <div className="bulletin-cards-container">
                {announcements.map((announcement, index) => (
                    <div
                        key={announcement._id}
                        className={`bulletin-card ${
                            index === activeIndex ? "active" : ""
                        }`}
                    >
                        <h3 className="card-title">{announcement.title}</h3>
                        <p className="card-content">{announcement.content}</p>
                        <div className="card-footer">
                            <span className="card-author">
                                By: {announcement.author}
                            </span>
                            <span className="card-date">
                                Date created:{" "}
                                {new Date(announcement.date).toLocaleString(
                                    "en-US",
                                    {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    }
                                )}
                            </span>
                        </div>
                    </div>
                ))}
                <div className="bulletin-nav">
                    <button className="nav-btn" onClick={handlePrevClick}>
                        &lt;
                    </button>
                    <button className="nav-btn" onClick={handleNextClick}>
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulletinBoard;
