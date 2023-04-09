import React, { useState, useEffect } from "react";
import Navigation from "../../../components/admin/Navigation/Navigation";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "../ManageAdmins/ManageAdmins.css";

import axios from "axios";

const ManageAdmins = () => {
    //modal for REGISTER a admin
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    //modal for EDIT admin
    const [showEditModal, setShowEditModal] = useState(false);

    //DATA input
    const [schoolId, setSchoolId] = useState("");
    const [userType, setUserType] = useState("Admin");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

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

    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/auth/")
            .then((response) => {
                setadmins(response.data);
            });
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const configuration = {
            method: "post",
            url: "https://kinderlink.onrender.com/api/v1/auth/register",
            data: {
                schoolId,
                userType: "Admin",
                firstName,
                middleName,
                lastName,
                sex,
                email,
                phone,
                password,
            },
        };

        // make the API call
        axios(configuration)
            .then((result) => {
                alert(result.data.status);
                /* window.location.reload(false); */
            })
            .catch((error) => {
                alert(error.response.data.status);
            });

        // Add new admin to list of admins
        setadmins((prevState) => [
            ...prevState,
            {
                id: prevState.length + 1,
                schoolId,
                userType,
                firstName,
                middleName,
                lastName,
                sex,
                email,
                phone,
                password,
            },
        ]);
        // Reset form data
        setSchoolId("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSex("");
        setEmail("");
        setPhone("");
        setPassword("");
        //hide modal
        handleClose();
    };

    /* ====== handler for REGISTER admin ====== */
    const handleShow = () => {
        setCurrentAdmin(null);
        setShowRegisterModal(true);
    };

    const handleClose = () => setShowRegisterModal(false);

    /* ====== handler for EDIT admin ====== */
    const handleShowEditModal = () => {
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    /* TODO: not yet working */
    const handleDelete = (currentAdmin) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the admin record for ${currentAdmin.lastName}?`
        );
        if (confirmDelete) {
            axios
                .delete(
                    `https://kinderlink.onrender.com/${currentAdmin._id}`
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

            <Modal show={showRegisterModal} onHide={handleClose} size="sm">
                <Modal.Header>
                    <Modal.Title>Register a new admin </Modal.Title>
                    <span className="exit-button" onClick={handleClose}>
                        &times;
                    </span>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="schoolId">
                            <Form.Control
                                type="text"
                                placeholder="Enter school ID"
                                value={schoolId}
                                onChange={(event) =>
                                    setSchoolId(event.target.value)
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="userType">
                            <Form.Control
                                as="select"
                                value={userType}
                                onChange={(event) =>
                                    setUserType(event.target.value)
                                }
                                required
                            >
                                <option value="Admin">admin</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="firstName">
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="middleName">
                            <Form.Control
                                type="text"
                                placeholder="Enter middle name"
                                value={middleName}
                                onChange={(event) =>
                                    setMiddleName(event.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="lastName">
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="sex">
                            <Form.Control
                                as="select"
                                value={sex}
                                onChange={(event) => setSex(event.target.value)}
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="phone">
                            <Form.Control
                                type="text"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Table of admins */}
            <div className="admins-table">
                <Table striped bordered hover>
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
                                    <button onClick={() => handleEdit(admin)}>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(admin)}
                                    >
                                        Delete
                                    </button>
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
