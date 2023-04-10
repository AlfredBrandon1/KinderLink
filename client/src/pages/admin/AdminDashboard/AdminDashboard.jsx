import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

import Navigation from "../../../components/admin/Navigation/Navigation";

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [teachers, setTeachers] = useState([]);

    /* Count all ADMIN users */
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/auth/")
            .then((response) => {
                setAdmins(response.data);
            });
    }, []);
    const numAdmins = admins.length;

    /* Count all TEACHER users */
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/teacher/")
            .then((response) => {
                setTeachers(response.data);
            });
    }, []);
    const numTeachers = teachers.length;

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
                            <th> Total Admins </th>
                            <th> Total Teachers </th>{" "}
                        </tr>

                        <tr>
                            <td> {numAdmins}</td>
                            <td> {numTeachers}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
