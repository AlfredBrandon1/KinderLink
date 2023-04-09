import React, { useState, useEffect } from "react";
import Navigation from "../../../components/admin/Navigation/Navigation";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import '../ManageAdmins/ManageAdmins.css'

import axios from "axios";

const ManageAdmins = () => {
    const [showModal, setShowModal] = useState(false);

    const [schoolId, setSchoolId] = useState("");
    const [userType, setUserType] = useState("Admin");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/auth/")
            .then((response) => {
                setAdmins(response.data);
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
        setAdmins((prevState) => [
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
        // Reset form data and hide modal

        clearFormData();
        handleClose();
    };

    const clearFormData = () => {
        setSchoolId("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSex("");
        setEmail("");
        setPhone("");
        setPassword("");
    };

    return (
        <>
            <Navigation />
            <div className="manage-admins-container">
                <p>MANAGE ADMINS</p>
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        <FaPlus /> Register New Admin
                    </Button>
                    <Modal show={showModal} onHide={handleClose} size="sm">
                        <Modal.Header>
                            <Modal.Title>Register a new admin</Modal.Title>
                            <span className="exit-button" onClick={handleClose}>
                                &times;
                            </span>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleFormSubmit}>
                                <Form.Group controlId="schoolId">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter school ID number"
                                        name="schoolId"
                                        value={schoolId}
                                        onChange={(e) =>
                                            setSchoolId(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="firstName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter first name"
                                        name="firstName"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="middleName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter middle name"
                                        name="middleName"
                                        value={middleName}
                                        onChange={(e) =>
                                            setMiddleName(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="lastName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter last name"
                                        name="lastName"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="sex">
                                    <Form.Control
                                        as="select"
                                        name="sex"
                                        value={sex}
                                        onChange={(e) => setSex(e.target.value)}
                                        required
                                    >
                                        <option value="">Select sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        name="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="phone">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number"
                                        name="phone"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        name="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Add admin
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={clearFormData}
                                >
                                    Clear
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th> School ID </th>
                            <th> Last Name </th>
                            <th> First Name </th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td> {admin.schoolId} </td>
                                <td>{admin.lastName}</td>
                                <td> {admin.firstName} </td>
                                <td>{admin.email}</td>
                                <td>{admin.phone}</td>
                                <td>
                                    <Button variant="view" className="sm-1">
                                        <FaEye />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default ManageAdmins;
