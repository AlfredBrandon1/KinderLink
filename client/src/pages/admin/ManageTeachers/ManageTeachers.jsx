import React, { useState, useEffect } from "react";
import Navigation from "../../../components/admin/Navigation/Navigation";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "../ManageTeachers/ManageTeachers.css";

import axios from "axios";

const ManageTeachers = () => {
    //modal for REGISTER a teacher
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    //modal for EDIT teacher
    const [showEditModal, setShowEditModal] = useState(false);

    //DATA input
    const [schoolId, setSchoolId] = useState("");
    const [userType, setUserType] = useState("Teacher");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [teachers, setTeachers] = useState([]);
    const [currentTeacher, setCurrentTeacher] = useState(null);

    const [updatedTeacher, setUpdatedTeacher] = useState({
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
            .get("https://kinderlink.onrender.com/api/v1/teacher/")
            .then((response) => {
                setTeachers(response.data);
            });
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const configuration = {
            method: "post",
            url: "https://kinderlink.onrender.com/api/v1/teacher/register",
            data: {
                schoolId,
                userType: "Teacher",
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

        // Add new teacher to list of teachers
        setTeachers((prevState) => [
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

    /* ====== handler for REGISTER teacher ====== */
    const handleShow = () => {
        setCurrentTeacher(null);
        setShowRegisterModal(true);
    };

    const handleClose = () => setShowRegisterModal(false);

    /* ====== handler for EDIT teacher ====== */
    const handleShowEditModal = () => {
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    /* TODO: not yet working */
    const handleDelete = (currentTeacher) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the teacher record for ${currentTeacher.lastName}?`
        );
        if (confirmDelete) {
            axios
                .delete(
                    `https://kinderlink.onrender.com/api/v1/teacher/${currentTeacher._id}`
                )
                .then((response) => {
                    alert(response.data.message);
                    // remove deleted teacher from list of teachers
                    setTeachers((prevState) =>
                        prevState.filter(
                            (teacher) => teacher._id !== currentTeacher._id
                        )
                    );
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        }
    };

    const handleEdit = (teacher) => {
        setShowEditModal(true);
        setCurrentTeacher(teacher);
        setUpdatedTeacher({
            schoolId: teacher.schoolId,
            lastName: teacher.lastName,
            middleName: teacher.middleName,
            firstName: teacher.firstName,
            email: teacher.email,
            phone: teacher.phone,
            sex: teacher.sex,
            password: teacher.password,
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdatedTeacher({ ...updatedTeacher, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .put(
                `https://kinderlink.onrender.com/${currentTeacher._id}`,
                updatedTeacher
            )
            .then((response) => {
                console.log(response.data);
                alert("Update successfuly!");
                setCurrentTeacher(null);
            })
            .catch((error) => {
                console.error(error);
                alert("Error updating teacher!");
            });
            handleCloseEditModal();
    };

    return (
        <>
            <Navigation />
            <div className="manage-teachers-container container mt-5">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h3 className="card-title">Manage Teachers</h3>
                                <Button
                                    variant="primary"
                                    onClick={handleShow}
                                    className="d-flex align-items-center"
                                >
                                    <FaPlus />
                                    <span className="ml-2">
                                        Register a new teacher
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showRegisterModal} onHide={handleClose} size="sm">
                <Modal.Header>
                    <Modal.Title>Register a new teacher </Modal.Title>
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
                                <option value="Teacher">Teacher</option>
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

            {/* Table of Teachers */}
            <div className="teachers-table">
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
                        {teachers.map((teacher, index) => (
                            <tr key={teacher._id}>
                                <th> &nbsp; &nbsp; </th>
                                <td>{index + 1}</td>
                                <td>{teacher.schoolId}</td>
                                <td>{teacher.lastName}</td>
                                <td>{teacher.middleName}</td>
                                <td>{teacher.firstName}</td>
                                <td>{teacher.email}</td>
                                <td>{teacher.phone}</td>
                                <td>{teacher.sex}</td>
                                <td>
                                    <button onClick={() => handleEdit(teacher)}>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(teacher)}
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
                            <Modal.Title> Update teacher </Modal.Title>
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
                                value={updatedTeacher.schoolId}
                                onChange={handleInputChange}
                            />
                            <br />
                            <label htmlFor="lastName">Last Name:</label>
                            <br />
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={updatedTeacher.lastName}
                                onChange={handleInputChange}
                            />
                            <br />
                            <label htmlFor="middleName">Middle Name:</label>
                            <br />
                            <input
                                type="text"
                                id="middleName"
                                name="middleName"
                                value={updatedTeacher.middleName}
                                onChange={handleInputChange}
                            />
                            <br />
                            <label htmlFor="firstName">First Name:</label>
                            <br />
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={updatedTeacher.firstName}
                                onChange={handleInputChange}
                            />
                            <br />
                            <label htmlFor="email">Email:</label>
                            <br />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={updatedTeacher.email}
                                onChange={handleInputChange}
                            />
                            <br />
                            <label htmlFor="phone">Phone:</label>
                            <br />
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={updatedTeacher.phone}
                                onChange={handleInputChange}
                            />
                            <br />
                            <label htmlFor="sex">Sex:</label>
                            <br />
                            <select
                                id="sex"
                                name="sex"
                                value={updatedTeacher.sex}
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
                                value={updatedTeacher.password}
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

export default ManageTeachers;
