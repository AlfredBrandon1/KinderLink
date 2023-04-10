import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminDashboard.css";

import Navigation from "../../components/admin/Navigation/Navigation";

//APIs
import News from "../../components/admin/News";
import Trivia from "../../components/admin/Trivia";
import Weather from "../../components/admin/Weather";

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);

    /* Count all ADMIN users */
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/auth/")
            .then((response) => {
                setAdmins(response.data);
            });
    }, []);
    const numAdmins = admins.length;

    /* Count all TEACHERS users */
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/teacher/")
            .then((response) => {
                setTeachers(response.data);
            });
    }, []);
    const numTeachers = teachers.length;

    /* Count all STUDENTS users */
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/student/")
            .then((response) => {
                setStudents(response.data);
            });
    }, []);
    const numStudents = students.length;

    return (
        <>
            <Navigation />
            <p> Welcome, Master Admin! </p>
            <div className="admin-dashboard-container">
                <div>
                    <p> ADMIN DASHBOARD</p>
                </div>

                <div>
                    <table>
                        <tr>
                            <th> Total Admins: </th>

                            <td> {numAdmins} </td>
                        </tr>

                        <tr>
                            <th> Total Students: </th> <td> {numStudents}</td>
                        </tr>

                        <tr>
                            <th> Total Teachers: </th>
                            <td> {numTeachers}</td>
                        </tr>
                    </table>
                </div>
                <div>
                <Weather location="La Trinidad, Benguet" apiKey="89e70020981ac4ad8c525a2d89373ae9" />

                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
