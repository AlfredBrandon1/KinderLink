import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminDashboard.css";

import Navigation from "../../components/admin/Navigation/Navigation"

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
                            <th> Total Admins:  </th>
                            
                            <td> {numAdmins} </td>
                        </tr>

                        <tr>
                            
                            <th> Total Students: </th>{" "}
                            <td> {numStudents}</td>
                        </tr>

                        <tr>
                        <th> Total Teachers:  </th>
                        <td> {numTeachers}</td>
                        </tr>

                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
