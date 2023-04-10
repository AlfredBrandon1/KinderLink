import React, { useState, useEffect } from "react";
import Navigation from "../../../components/admin/Navigation/Navigation";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "../ManageStudents/ManageStudents.css";

import axios from "axios";

const ManageStudents = () => {
    //modal for REGISTER a student
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    //modal for EDIT student
    const [showEditModal, setShowEditModal] = useState(false);

    //DATA input
    //Child`s details
    const [schoolId, setSchoolId] = useState("");
    const [userType, setUserType] = useState("Student");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [address, setAddress] = useState("");

    //Parent`s details
    const [contactFirstName, setContactFirstName] = useState("");
    const [contactMiddleName, setContactMiddleName] = useState("");
    const [contactLastName, setContactLastName] = useState("");
    const [relationship, setRelationship] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");

    const [password, setPassword] = useState("");

    const [students, setStudents] = useState([]);
    const [currentStudent, setCurrentStudent] = useState(null);

    const [updatedStudent, setUpdatedStudent] = useState({
        schoolId: "",
        lastName: "",
        middleName: "",
        firstName: "",
        sex: "",
        birthdate: "",
        address: "",
        contactFirstName: "",
        contactLastName: "",
        contactMiddleName: "",
        relationship: "",
        contactPhone: "",
        contactEmail: "",
        password: "",
    });

    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/student/")
            .then((response) => {
                setStudents(response.data);
            });
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const configuration = {
            method: "post",
            url: "https://kinderlink.onrender.com/api/v1/student/register",
            data: {
                schoolId: "",
                userType: "Student",
                lastName: "",
                middleName: "",
                firstName: "",
                sex: "",
                birthdate: "",
                address: "",
                contactFirstName: "",
                contactLastName: "",
                contactMiddleName: "",
                relationship: "",
                contactPhone: "",
                contactEmail: "",
                password: "",
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

        // Add new student to list of students
        setStudents((prevState) => [
            ...prevState,
            {
                id: prevState.length + 1,
                schoolId,
                userType,
                firstName,
                middleName,
                lastName,
                sex,
                birthdate,
                address,
                contactFirstName,
                contactLastName,
                contactMiddleName,
                relationship,
                contactPhone,
                contactEmail,
                password,
            },
        ]);
        // Reset form data
        setSchoolId("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSex("");
        setBirthdate("");
        setAddress("");
        setContactFirstName("");
        setContactMiddleName("");
        setContactLastName("");
        setRelationship("");
        setContactEmail("");
        setContactPhone("");
        setPassword("");
        //hide modal
        handleClose();
    };

    /* ====== handler for REGISTER student ====== */
    const handleShow = () => {
        setCurrentStudent(null);
        setShowRegisterModal(true);
    };

    const handleClose = () => setShowRegisterModal(false);

    /* ====== handler for EDIT student ====== */
    const handleShowEditModal = () => {
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    /* TODO: not yet working */
    const handleDelete = (currentStudent) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the student record for ${currentStudent.lastName}?`
        );
        if (confirmDelete) {
            axios
                .delete(
                    `https://kinderlink.onrender.com/api/v1/student/${currentStudent._id}`
                )
                .then((response) => {
                    alert(response.data.message);
                    // remove deleted student from list of students
                    setStudents((prevState) =>
                        prevState.filter(
                            (student) => student._id !== currentStudent._id
                        )
                    );
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        }
    };

    const handleEdit = (student) => {
        setShowEditModal(true);
        setCurrentStudent(student);
        setUpdatedStudent({
            schoolId: student.schoolId,
            lastName: student.lastName,
            middleName: student.middleName,
            firstName: student.firstName,
            sex: student.sex,
            birthdate: student.birthdate,
            address: student.address,
            contactFirstName: student.contactFirstName,
            contactMiddleName: student.contactMiddleName,
            contactLastName: student.contactLastName,
            relationship: student.relationship,
            contactPhone: student.contactPhone,
            contactEmail: student.contactEmail,
            password: student.password,
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdatedStudent({ ...updatedStudent, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .put(
                `https://kinderlink.onrender.com/api/v1/student/${currentStudent._id}`,
                updatedStudent
            )
            .then((response) => {
                console.log(response.data);
                alert("Update successfuly!");
                setCurrentStudent(null);
            })
            .catch((error) => {
                console.error(error);
                alert("Error updating student!");
            });
        handleCloseEditModal();
    };

    return (
        <>
            <Navigation />
            <div className="manage-students-container container mt-5">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h3 className="card-title">Manage Students</h3>
                                <Button
                                    variant="primary"
                                    onClick={handleShow}
                                    className="d-flex align-items-center"
                                >
                                    <FaPlus />
                                    <span className="ml-2">
                                        Register a new student
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                className="register-student-modal"
                show={showRegisterModal}
                onHide={handleClose}
                size="lg"
            >
                <Modal.Header>
                    <Modal.Title>Register a new student </Modal.Title>
                    <span className="exit-button" onClick={handleClose}>
                        &times;
                    </span>
                </Modal.Header>
                <form
                    className="register-student-form"
                    
                >
                    
                        <p> Student`s Basic Details </p>
                        <label htmlFor="schoolId"> School Id number</label>
                        <input
                            className="schoolId"
                            type="text"
                            placeholder="Enter school ID"
                            value={schoolId}
                            onChange={(event) =>
                                setSchoolId(event.target.value)
                            }
                            required
                        />
                        <label htmlFor="userType"> User Type </label>
                        <select
                            className="userType"
                            as="select"
                            value={userType}
                            onChange={(event) =>
                                setUserType(event.target.value)
                            }
                            required
                        >
                            <option value="Student">Student</option>
                        </select>

                        <label htmlFor="firstName"> First Name </label>
                        <input
                            className="firtName"
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(event) =>
                                setFirstName(event.target.value)
                            }
                            required
                        />

                        <label htmlFor="middleName"> Middle Name </label>
                        <input
                            className="middleName"
                            type="text"
                            placeholder="Enter middle name"
                            value={middleName}
                            onChange={(event) =>
                                setMiddleName(event.target.value)
                            }
                            required
                        />

                        <label htmlFor="lastName"> Last Name </label>
                        <input
                            type="text"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={(event) =>
                                setLastName(event.target.value)
                            }
                            required
                        />

                        <label htmlFor="sex"> Sex </label>
                        <select
                            className="sex"
                            as="select"
                            value={sex}
                            onChange={(event) => setSex(event.target.value)}
                            required
                        >
                            <option value="">Select sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <label htmlFor="birthdate"> Birthdate </label>
                        <input
                            className="birthdate"
                            type="date"
                            placeholder="Enter birthdate"
                            value={birthdate}
                            onChange={(event) =>
                                setBirthdate(event.target.value)
                            }
                            required
                        />

                        <label htmlFor="address"> Address </label>
                        <input
                            className="address"
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            required
                        />
                  
                    <hr />
                    
                        <p> Parent/Guardian Details </p>
                        <label htmlFor="contactFirstName"> First Name </label>
                        <input
                            type="text"
                            placeholder="Enter First Name"
                            value={contactFirstName}
                            onChange={(event) =>
                                setContactFirstName(event.target.value)
                            }
                            required
                        />
                        <label htmlFor="contactMiddleName"> Middle Name </label>
                        <input
                            type="text"
                            placeholder="Enter Middle Name"
                            value={contactMiddleName}
                            onChange={(event) =>
                                setContactMiddleName(event.target.value)
                            }
                            required
                        />
                        <label htmlFor="contactLastName"> Last Name </label>
                        <input
                            type="text"
                            placeholder="Enter Last Name"
                            value={contactLastName}
                            onChange={(event) =>
                                setContactLastName(event.target.value)
                            }
                            required
                        />
                        <label htmlFor="relationship"> Relationship </label>
                        <select
                            as="select"
                            value={relationship}
                            onChange={(event) =>
                                setRelationship(event.target.value)
                            }
                            required
                        >
                            <option value="">Select relationship</option>
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Guardian">Guardian</option>
                        </select>

                        <label htmlFor="contactEmail"> Email </label>
                        <input
                            className="contactEmail"
                            type="email"
                            placeholder="Enter Email"
                            value={contactEmail}
                            onChange={(event) =>
                                setContactEmail(event.target.value)
                            }
                            required
                        />

                        <label htmlFor="contactPhone"> Phone Number </label>
                        <input
                            type="tel"
                            placeholder="Enter Phone Number"
                            value={contactPhone}
                            onChange={(event) =>
                                setContactPhone(event.target.value)
                            }
                            required
                        />

                        <label htmlFor="password"> Password </label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                        <Button variant="primary" type="submit" onClick={handleFormSubmit}>
                            Submit
                        </Button>
                    
                </form>
            </Modal>

            {/* Table of students */}
            <div className="students-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th> &nbsp; &nbsp; </th>
                            <th>#</th>
                            <th> School ID </th>
                            <th> Last Name </th>
                            <th> First Name </th>
                            <th> Middle Name </th>
                            <th>Sex</th>
                            <th>Birthdate</th>
                            <th>Address</th>
                            <th> Contact Person`s Name </th>
                            <th> Relationship </th>
                            <th> Email </th>
                            <th> Phone # </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student._id}>
                                <th> &nbsp; &nbsp; </th>
                                <td>{index + 1}</td>
                                <td>{student.schoolId}</td>
                                <td>{student.lastName}</td>
                                <td>{student.middleName}</td>
                                <td>{student.firstName}</td>
                                <td>{student.sex}</td>
                                <td>{student.birthdate}</td>
                                <td>{student.address}</td>
                                <td>{`${student.contactFirstName} ${student.contactMiddleName} ${student.contactLastName}`}</td>
                                <td> {student.relationship}</td>
                                <td> {student.contactEmail}</td>
                                <td> {student.contactPhone}</td>
                                <td>
                                    <FaEdit
                                        onClick={() => handleEdit(student)}
                                        color="green"
                                        size="30px"
                                    >
                                        Edit
                                    </FaEdit>
                                    <FaTrash
                                        onClick={() => handleDelete(student)}
                                        color="red"
                                        size="30px"
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
                            <Modal.Title> Update student </Modal.Title>
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
                                value={updatedStudent.schoolId}
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
                                value={updatedStudent.lastName}
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
                                value={updatedStudent.middleName}
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
                                value={updatedStudent.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <br />
                            <label htmlFor="sex">Sex:</label>
                            <br />
                            <select
                                id="sex"
                                name="sex"
                                value={updatedStudent.sex}
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
                                value={updatedStudent.password}
                                onChange={handleInputChange}
                                required
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

export default ManageStudents;
