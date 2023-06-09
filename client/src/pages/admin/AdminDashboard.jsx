import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserShield, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import Navigation from "../../components/admin/Navigation/Navigation";
import Weather from "../../components/admin/Weather";
import "../../styles/AdminDashboard.css";
import News from "../../components/admin/News";
import Trivia from "../../components/admin/Trivia";
import ClockWidget from "../../components/admin/ClockWidget";
import QuotesWidget from "../../components/admin/QuotesWidget";
import TimeTracker from "../../components/admin/TimeTracler";
import CoffeeCounter from "../../components/admin/CoffeeCounter";
import BulletinBoard from "../../components/admin/BulletinBoard";
import GithubCommits from "../../components/admin/GithubCommits";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);

    //Read all admins
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/auth/")
            .then((response) => {
                setAdmins(response.data);
            });
    }, []);
    const numAdmins = admins.length; /* Count all ADMIN users */

    //Read all teachers
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/teacher/")
            .then((response) => {
                setTeachers(response.data);
            });
    }, []);
    const numTeachers = teachers.length; /* Count all TEACHERS users */

    //Read all students
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/student/")
            .then((response) => {
                setStudents(response.data);
            });
    }, []);
    const numStudents = students.length; /* Count all STUDENTS users */

    return (
        <>
            <Navigation />
            <p className="page-title">ADMIN DASHBOARD</p>
            <div className="admin-dashboard-container">
                <div className="widget-card">
                    <div>
                        <Weather
                            location="La Trinidad, Benguet"
                            apiKey="89e70020981ac4ad8c525a2d89373ae9"
                        />
                    </div>

                    <div>
                        <ClockWidget />
                    </div>
                    <div>
                        <BulletinBoard />
                    </div>

                    <div>
                        <TimeTracker />
                        <CoffeeCounter />
                    </div>

                    {/*       <QuotesWidget/> */}
                </div>

                <hr className="dashboard-divider" />

                <div className="user-counter-card">
                    <div className="counter-card">
                        <FaUserShield size={32} />
                        <span onClick={() => navigate("/manage-admins")}>
                            Total Admins
                        </span>{" "}
                        {numAdmins}
                    </div>

                    <div className="counter-card">
                        <FaUserGraduate size={32} />
                        <span onClick={() => navigate("/manage-students")}>
                            Total Students
                        </span>{" "}
                        {numStudents}
                    </div>

                    <div className="counter-card">
                        <FaUserTie size={32} />
                        <span onClick={() => navigate("/manage-teachers")}>
                            Total Teachers
                        </span>{" "}
                        {numTeachers}
                    </div>

                    <div className="counter-card">
                        <IoMdPeople size={32} />
                        <span>Total Users</span>{" "}
                        {numAdmins + numStudents + numTeachers}
                    </div>
                </div>
                <hr />

                {/*              <Trivia /> */}
                <div>
                    <GithubCommits />
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
