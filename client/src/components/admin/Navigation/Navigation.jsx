import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

import {
    FaUserShield,
    FaUserGraduate,
    FaUserTie,
    FaHome,
    FaSignOutAlt,
    FaBullhorn,
    FaBook,
    FaUserCircle,
} from "react-icons/fa";

import "./Navigation.css";

const Navigation = () => {
    const [showMenu, setShowMenu] = useState(false);
    const userId = localStorage.getItem("currentUserId");
    const userToken = localStorage.getItem("currentUser");
    const [userData, setUserData] = useState(null);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    //get an admin using ID

    useEffect(() => {
        axios
            .get(`https://kinderlink.onrender.com/api/v1/auth/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((response) => {
                setUserData(response.data);
            });
    }, [userId, userToken]);

    return (
        <nav className="Navigation">
            <div className="Navigation__logo">
                <Link to="/">
                    {" "}
                    <span className="kinder">Kinder</span>
                    <span className="link">Link</span>{" "}
                </Link>
            </div>
            <div className="Navigation__icon" onClick={toggleMenu}>
                {showMenu ? (
                    <FontAwesomeIcon icon={faTimes} />
                ) : (
                    <FontAwesomeIcon icon={faBars} />
                )}
            </div>
            <ul
                className={`Navigation__list ${
                    showMenu ? "Navigation__list--show" : ""
                }`}
            >
                <li className="Navigation__item">
                    <Link to="/admin-dashboard" onClick={toggleMenu}>
                        <FaHome />
                        Dashboard
                    </Link>
                </li>
                <li className="Navigation__item">
                    <Link to="/manage-teachers" onClick={toggleMenu}>
                        <FaUserTie />
                        Teachers
                    </Link>
                </li>
                <li className="Navigation__item">
                    <Link to="/manage-students" onClick={toggleMenu}>
                        <FaUserGraduate />
                        Students
                    </Link>
                </li>
                <li className="Navigation__item">
                    <Link to="/manage-admins" onClick={toggleMenu}>
                        <FaUserShield />
                        Admins
                    </Link>
                </li>
                <li className="Navigation__item">
                    <Link to="/manage-announcements" onClick={toggleMenu}>
                        <FaBullhorn />
                        Announcement
                    </Link>
                </li>
                <li className="Navigation__item">
                    <Link to="/manage-learning-materials" onClick={toggleMenu}>
                        <FaBook />
                        Learning Materials
                    </Link>
                </li>
                <li className="Navigation__item">
                    <Link to="/my-account" onClick={toggleMenu}>
                        <FaUserCircle />
                        My Account 
                        {userData ? (
                        <span className="user-name">
                            {" "}
                            {userData.firstName} ({userData.userType}){" "}
                        </span>
                    ) : null}
                    </Link>
                </li>
                <li className="Navigation__item">
                    <Link
                    title="logout"
                        to="/"
                        onClick={(event) => {
                            if (
                                window.confirm(
                                    "Are you sure you want to logout?"
                                )
                            ) {
                                window.localStorage.clear();
                            } else {
                                event.preventDefault();
                                return false;
                            }
                        }}
                    >
                        <FaSignOutAlt style={{ cursor: "pointer" }} />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
