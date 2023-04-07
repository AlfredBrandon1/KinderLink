import React, { useState } from "react";
import { Table, Button, Modal, Form, Nav } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./ManageTeachers.css";

import Navigation from "../../../components/admin/Navigation/Navigation";
import ViewProfile from "./ViewProfile";

import teachersData from "./teachersData";

const ManageTeachers = () => {
    const [showModal, setShowModal] = useState(false);

    const [teachers, setTeachers] = useState(teachersData);
    const [formData, setFormData] = useState({
        schoolId: "",
        firstName: "",
        middleName: "",
        lastName: "",
        sex: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Add new teacher to list of teachers
        setTeachers((prevState) => [
            ...prevState,
            {
                id: prevState.length + 1,
                schoolId: formData.schoolId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                status: "Active",
            },
        ]);
        // Reset form data and hide modal
        setFormData({
            schoolId: "",
            firstName: "",
            middleName: "",
            lastName: "",
            sex: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            confirmPassword: "",
        });
        handleClose();
    };

    const clearFormData = () => {
        setFormData({
            schoolId: "",
            firstName: "",
            middleName: "",
            lastName: "",
            sex: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            confirmPassword: "",
        });
    }

    const handleDeleteTeacher = (id) => {
        setTeachers((prevState) =>
            prevState.filter((teacher) => teacher.id !== id)
        );
    };
    return (
        <>
            <Navigation />
            <div className="manage-teachers-container">
                <h1>Manage Teachers</h1>
                <Button variant="primary" onClick={handleShow}>
                    <FaPlus /> Add New Teacher
                </Button>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>School ID no. </th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone no. </th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher) => (
                            <tr key={teacher.id}>
                                <td>{teacher.schoolId}</td>
                                <td>{teacher.firstName}</td>
                                <td>{teacher.lastName}</td>
                                <td>{teacher.phone}</td>
                                <td>{teacher.status}</td>
                                <td>
    
                                         <ViewProfile/>
     
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDeleteTeacher(teacher.id)
                                        }
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={handleClose} size="sm">
                    <Modal.Header>
                        <Modal.Title>Add New Teacher</Modal.Title>
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
                                    value={formData.schoolId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="firstName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="middleName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter middle name"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter last name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="sex">
                                <Form.Control
                                    as="select"
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleInputChange}
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
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="phone">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter phone number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="username">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="confirmPassword">
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password again"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Add Teacher
                            </Button>
                            <Button variant="danger" onClick={clearFormData}>
                                Clear
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default ManageTeachers;
