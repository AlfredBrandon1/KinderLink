import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

//images
import ecdclogo from "../../../assets/ecdclogo.jpg";
import loginCartoon from "../../../assets/loginCartoon.png";

const LoginPage = () => {
    const [schoolId, setSchoolId] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const loginAuthentication = (e) => {
        e.preventDefault();
        const configuration = {
            method: "post",
            url: "https://kinderlink.onrender.com/api/v1/auth/login", //TODO: separate this. Trial only.
            data: {
                schoolId,
                password,
            },
        };

        // API call
        axios(configuration)
            .then((result) => {
                alert(result.data.status);
                navigate("/admin-dashboard");
                /* window.location.reload(false);  */
            })
            .catch((error) => {
                alert(error.response.data.status);
                setSchoolId("");
                setPassword("");
            });

/*             const TeacherConfiguration = {
                method: "post",
                url: "https://kinderlink.onrender.com/api/v1/teacher/login", //TODO: separate this. Trial only.
                data: {
                    schoolId,
                    password,
                },
            };
    
            // API call
            axios(TeacherConfiguration)
                .then((result) => {
                    alert(result.data.status);
                    navigate("/teacher-dashboard");
                    window.location.reload(false);
                })
                .catch((error) => {
                    alert(error.response.data.status);
                    setSchoolId("");
                    setPassword("");
                }); */
            
    };

    const handleForgotPassword = () => {
        // TODO: handle forgot password logic
    };

    return (
        <div className="login-page">
            <div className="intro-card">
                <h1>Welcome to KinderLink</h1>
                <p className="intro">
                    KinderLink is a developmental online portal <br />
                    for the Early Childhood Development Center (ECDC) <br />
                    of the Benguet State University (BSU).
                </p>
                <br />
                <button className="contact-us-button">Contact Us</button>
            </div>

            <form className="login-form" onSubmit={loginAuthentication}>
                <p> LOGIN </p>
                <input
                className="login-input"
                    type="text"
                    id="schoolId"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    placeholder="ID number"
                />
                <input
                className="login-input"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                />
                <button type="submit">
                    Login
                </button>
                <a href="#" onClick={handleForgotPassword}>
                    Forgot password?
                </a>
            </form>
        </div>
    );
};

export default LoginPage;
