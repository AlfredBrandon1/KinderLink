import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/admin/Navigation/Navigation";
import "../../styles/MyAccount.css";
import { Modal } from "react-bootstrap";

const MyAccount = () => {
    const userId = localStorage.getItem("currentUserId");
    const userToken = localStorage.getItem("currentUser");

    const [showEditModal, setShowEditModal] = useState(false); //modal for EDIT admin
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [userData, setUserData] = useState(null);
    const [updatedAdmin, setUpdatedAdmin] = useState({
        schoolId: "",
        lastName: "",
        middleName: "",
        firstName: "",
        email: "",
        phone: "",
        sex: "",
        password: "",
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`https://kinderlink.onrender.com/api/v1/auth/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [userId, userToken]);

    /* =============================================== EDIT my account ============================================= */
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleEdit = (admin) => {
        setShowEditModal(true);
        setCurrentAdmin(admin);
        setUpdatedAdmin({
            schoolId: admin.schoolId,
            lastName: admin.lastName,
            middleName: admin.middleName,
            firstName: admin.firstName,
            email: admin.email,
            phone: admin.phone,
            sex: admin.sex,
            password: admin.password,
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdatedAdmin({ ...updatedAdmin, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .put(
                `https://kinderlink.onrender.com/api/v1/auth/${userId}`,
                updatedAdmin,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                alert("Update successfully!");
                setCurrentAdmin(null);
            })
            .catch((error) => {
                console.error(error);
                alert("Error updating admin!");
            });
        handleCloseEditModal();
    };

    return (
        <>
            <Navigation />
            <div className="my-account-container">
                {error ? (
                    <p className="error-message">{error}</p>
                ) : userData ? (
                    <>
                        <div className="my-account-container">
                            {error ? (
                                <p className="error-message">{error}</p>
                            ) : userData ? (
                                <div className="user-info">
                                    <h2>My Account</h2>
                                    <div className="grid-container">
                                        <div className="grid-item">
                                            <span className="info-label">
                                                School ID:
                                            </span>
                                            {userData.schoolId}
                                        </div>
                                        <div className="grid-item">
                                            <span className="info-label">
                                                User Type:
                                            </span>
                                            {userData.userType}
                                        </div>
                                        <div className="grid-item">
                                            <span className="info-label">
                                                Name:
                                            </span>
                                            {`${userData.firstName} ${userData.middleName} ${userData.lastName}`}
                                        </div>
                                        <div className="grid-item">
                                            <span className="info-label">
                                                Sex:
                                            </span>
                                            {userData.sex}
                                        </div>
                                        <div className="grid-item">
                                            <span className="info-label">
                                                Email:
                                            </span>
                                            {userData.email}
                                        </div>
                                        <div className="grid-item">
                                            <span className="info-label">
                                                Phone:
                                            </span>
                                            {userData.phone}
                                        </div>
                                    </div>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(userData)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        {/* =============================================== Edit modal ============================================= */}
                        {/* the styling of modals are in the TableAndModals.css */}
                        <Modal
                            show={showEditModal}
                            onHide={handleCloseEditModal}
                            size="lg"
                        >
                            <Modal.Header>
                                <p className="form-title">
                                    {" "}
                                    Update admin profile{" "}
                                </p>
                                <span
                                    className="exit-button"
                                    onClick={handleCloseEditModal}
                                >
                                    &times;
                                </span>
                            </Modal.Header>
                            <form
                                className="register-form"
                                onSubmit={handleSubmit}
                            >
                                <label htmlFor="schoolId">School ID:</label>{" "}
                                <br />
                                <input
                                    type="text"
                                    id="schoolId"
                                    name="schoolId"
                                    value={updatedAdmin.schoolId}
                                    onChange={handleInputChange}
                                    required
                                />
                                <br />
                                <label htmlFor="lastName">Last Name:</label>
                                <br />
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={updatedAdmin.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <br />
                                <label htmlFor="middleName">Middle Name:</label>
                                <br />
                                <input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    value={updatedAdmin.middleName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <br />
                                <label htmlFor="firstName">First Name:</label>
                                <br />
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={updatedAdmin.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <br />
                                <label htmlFor="email">Email:</label>
                                <br />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={updatedAdmin.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <br />
                                <label htmlFor="phone">Phone:</label>
                                <br />
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={updatedAdmin.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <br />
                                <label htmlFor="sex">Sex:</label>
                                <br />
                                <select
                                    id="sex"
                                    name="sex"
                                    value={updatedAdmin.sex}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <br />
                                <label htmlFor="password">Password:</label>
                                <br />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={updatedAdmin.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <br />
                                <button type="submit">Save</button>
                            </form>
                        </Modal>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );
};

export default MyAccount;
