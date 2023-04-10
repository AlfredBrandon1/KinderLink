import React, { useState, useEffect } from "react";
import Navigation from "../../../components/admin/Navigation/Navigation";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "../ManageAdmins/ManageAdmins.css";
import RegisterModal from "../ManageAdmins/RegisterModal"

import axios from "axios";

const ManageAdmins = (handleFormSubmit) => {

    const [showRegisterModal, setShowRegisterModal] = useState(false);     //modal for REGISTER a admin
    const [showEditModal, setShowEditModal] = useState(false);     //modal for EDIT admin
    const [admins, setadmins] = useState([]);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [updatedAdmin, setUpdateAdmin] = useState({
        schoolId: "",
        lastName: "",
        middleName: "",
        firstName: "",
        email: "",
        phone: "",
        sex: "",
    });

    /* =============================================== GET ALL admin ============================================= */
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/auth/")
            .then((response) => {
                setadmins(response.data);
            });
    }, []);

    /* =============================================== REGISTER a new admin ============================================= */
    const handleShow = () => {
        setCurrentAdmin(null);
        setShowRegisterModal(true);
    };
    const handleClose = () => setShowRegisterModal(false);

    /* =============================================== EDIT admin ============================================= */
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleEdit = (admin) => {
        setShowEditModal(true);
        setCurrentAdmin(admin);
        setUpdateAdmin({
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
        setUpdateAdmin({ ...updatedAdmin, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .put(
                `https://kinderlink.onrender.com/api/v1/auth/${currentAdmin._id}`,
                updatedAdmin
            )
            .then((response) => {
                console.log(response.data);
                alert("Update successfuly!");
                setCurrentAdmin(null);
            })
            .catch((error) => {
                console.error(error);
                alert("Error updating admin!");
            });
            handleCloseEditModal();
    };
    /* ========================================================================================================= */

    // DELETE REQUEST
    const handleDelete = (currentAdmin) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the admin record for ${currentAdmin.lastName}?`
        );
        if (confirmDelete) {
            axios
                .delete(
                    `https://kinderlink.onrender.com/api/v1/auth/${currentAdmin._id}`
                )
                .then((response) => {
                    alert(response.data.message);
                    // remove deleted admin from list of admins
                    setadmins((prevState) =>
                        prevState.filter(
                            (admin) => admin._id !== currentAdmin._id
                        )
                    );
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        }
    };

    return (
        <>
            <Navigation />
            <div className="manage-admins-container container mt-5">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h3 className="card-title">Manage admins</h3>
                                <Button
                                    variant="primary"
                                    onClick={handleShow}
                                    className="d-flex align-items-center"
                                >
                                    <FaPlus />
                                    <span className="ml-2">
                                        Register a new admin
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RegisterModal
    showRegisterModal={showRegisterModal}
    handleClose={handleClose}
    handleFormSubmit={handleFormSubmit}
/>


            {/* Table of admins */}
            <div className="admins-table">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th> &nbsp; &nbsp; </th>
                            <th>#</th>
                            <th> School ID </th>
                            <th> Last Name </th>
                            <th> First Name </th>
                            <th> Middle Name </th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Sex</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin, index) => (
                            <tr key={admin._id}>
                                <th> &nbsp; &nbsp; </th>
                                <td>{index + 1}</td>
                                <td>{admin.schoolId}</td>
                                <td>{admin.lastName}</td>
                                <td>{admin.middleName}</td>
                                <td>{admin.firstName}</td>
                                <td>{admin.email}</td>
                                <td>{admin.phone}</td>
                                <td>{admin.sex}</td>
                                <td>
                                    <FaEdit onClick={() => handleEdit(admin)} color="green" size="30px">
                                        Edit
                                    </FaEdit>
                                    <FaTrash
                                        onClick={() => handleDelete(admin) }color="red" size="30px"
                                    >
                                        Delete
                                    </FaTrash>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <Modal
                        show={showEditModal}
                        onHide={handleCloseEditModal}
                        size="lg"
                    >
                        <Modal.Header>
                            <Modal.Title> Update admin </Modal.Title>
                            <span
                                className="exit-button"
                                onClick={handleCloseEditModal}
                            >
                                &times;
                            </span>
                        </Modal.Header>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="schoolId">School ID:</label> <br />
                            <input
                                type="text"
                                id="schoolId"
                                name="schoolId"
                                value={updatedAdmin.schoolId}
                                onChange={handleInputChange}
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
                            />
                            <br />
                            <label htmlFor="sex">Sex:</label>
                            <br />
                            <select
                                id="sex"
                                name="sex"
                                value={updatedAdmin.sex}
                                onChange={handleInputChange}
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
                            />
                            <br />
                            <button type="submit">Save</button>
                        </form>
                    </Modal>
                </Table>
            </div>
        </>
    );
};

export default ManageAdmins;
