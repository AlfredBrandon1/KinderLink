import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUserId");
    if (currentUser) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const loginAuthentication = (e) => {
    e.preventDefault();
    const configuration = {
      method: "post",
      url: "https://kinderlink.onrender.com/api/v1/auth/login",
      data: {
        schoolId,
        password,
      },
    };
  
    axios(configuration)
      .then((response) => {
        alert(response.data.status);
        localStorage.setItem("currentUser", response.data.token);
        localStorage.setItem("currentUserId", response.data.userId); // Add user ID to localStorage
        navigate("/admin-dashboard");
        console.log(response.data);
      })
      .catch((error) => {
        alert(error.response.data.status);
        setSchoolId("");
        setPassword("");
      });
  };
  

  const handleForgotPassword = () => {
    // TODO: handle forgot password logic
  };

  const handleContactClick =() => {
    window.location.href = "mailto:calawa.alfredbrandon@gmail.com";
  }

  return (
    <div className="login-page">
      <div className="intro-card">
        <h1>Welcome to <br/> <span className="kinder">Kinder</span><span className="link">Link</span></h1>
        <p className="intro">
          KinderLink is a developmental online portal <br />
          for the Early Childhood Development Center (ECDC) <br />
          of the Benguet State University (BSU).
        </p>
        <br />
        <button onClick={handleContactClick} className="contact-us-button" target="_blank" >Contact Us</button>
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
        <button type="submit">Login</button>
        <a href="#" onClick={handleForgotPassword}>
          Forgot password?
        </a>
      </form>
    </div>
  );
};

export default LoginPage;
