import React, { useState, useEffect } from "react";
import Navigation from "../../components/admin/Navigation/Navigation";
import {
    Table,
    Button,
    Modal,
    Form,
    InputGroup,
    FormControl,
} from "react-bootstrap";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaSort,
    FaSearch,
} from "react-icons/fa";

//style for the Table and Modal
import "../../styles/TableAndModal.css";

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

    /* ====== handler for DELETE teacher ====== */
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

    /* ====== handler for EDIT teacher ====== */
    const handleShowEditModal = () => {
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

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
                `https://kinderlink.onrender.com/api/v1/teacher/${currentTeacher._id}`,
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
    /* ============================================ SEARCH and SORT =================================================== */
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedTeachers, setSortedTeachers] = useState(teachers);

    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/teacher/")
            .then((response) => {
                const sortedResults = response.data.sort((a, b) => {
                    // Sort by last name
                    if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) {
                        return -1;
                    } else if (
                        a.lastName.toLowerCase() > b.lastName.toLowerCase()
                    ) {
                        return 1;
                    } else {
                        // If last names are the same, sort by first name
                        if (
                            a.firstName.toLowerCase() <
                            b.firstName.toLowerCase()
                        ) {
                            return -1;
                        } else if (
                            a.firstName.toLowerCase() >
                            b.firstName.toLowerCase()
                        ) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });
                setSortedTeachers(sortedResults);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleSort = (field) => {
        setSortedTeachers(
            [...sortedTeachers].sort((a, b) => {
                if (a[field].toLowerCase() < b[field].toLowerCase()) {
                    return -1;
                } else if (a[field].toLowerCase() > b[field].toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    };

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        handleSearch(event.target.value);
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);

        if (searchTerm.trim() === "") {
            setSortedTeachers(teachers);
            return;
        }

        const filteredResults = teachers.filter(
            (teacher) =>
                teacher.lastName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                teacher.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                teacher.middleName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                teacher.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                teacher.phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSortedTeachers(filteredResults);
    };

    return (
        <>
            <Navigation />
            <div className="manage-teachers-container container mt-5">
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        <FaPlus />
                        <span className="ml-2">Register a new teacher</span>
                    </Button>
                </div>
                <p className="page-title">Manage Teachers</p>
                {/* ==================================================== Search ================================================== */}
                <Form onSubmit={(event) => event.preventDefault()}>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                    </InputGroup>
                </Form>
            </div>
            {/* ====================================== REGISTER MODAL ==================================================== */}
            <Modal
                className="register-modal"
                show={showRegisterModal}
                onHide={handleClose}
                size="sm"
            >
                <Modal.Header>
                    <p className="form-title">Register a new teacher </p>
                    <span className="exit-button" onClick={handleClose}>
                        &times;
                    </span>
                </Modal.Header>
                <Modal.Body>
                    <Form className="register-form" onSubmit={handleFormSubmit}>
                        <Form.Group controlId="schoolId">
                            <Form.Label htmlFor="schoolId">
                                {" "}
                                School ID number{" "}
                            </Form.Label>{" "}
                            <br />
                            <Form.Control
                                type="text"
                                value={schoolId}
                                onChange={(event) =>
                                    setSchoolId(event.target.value)
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="userType">
                            <Form.Label htmlFor="userType">
                                {" "}
                                User Type{" "}
                            </Form.Label>
                            <br />
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
                            <Form.Label htmlFor="firstName">
                                {" "}
                                First Name{" "}
                            </Form.Label>
                            <br />
                            <Form.Control
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="middleName">
                            <Form.Label htmlFor="middleName">
                                {" "}
                                Middle Name{" "}
                            </Form.Label>
                            <br />
                            <Form.Control
                                type="text"
                                value={middleName}
                                onChange={(event) =>
                                    setMiddleName(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="lastName">
                            <Form.Label htmlFor="lastName">
                                {" "}
                                Last Name{" "}
                            </Form.Label>
                            <br />
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="sex">
                            <Form.Label htmlFor="sex"> Sex </Form.Label>
                            <br />
                            <Form.Control
                                as="select"
                                value={sex}
                                onChange={(event) => setSex(event.target.value)}
                                required
                            >
                                <option value="">
                                    {" "}
                                    ------------------------------------- Select
                                    sex -----------------------------{" "}
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label htmlFor="email"> Email </Form.Label>
                            <br />
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="phone">
                            <Form.Label htmlFor="phone">
                                {" "}
                                Phone Number{" "}
                            </Form.Label>
                            <br />
                            <Form.Control
                                type="tel"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(event.target.value)
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label htmlFor="password">
                                {" "}
                                Password{" "}
                            </Form.Label>
                            <br />
                            <Form.Control
                                type="password"
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

            {/* ====================================== TABLE LIST ==================================================== */}
                <Table responsive>
                    <thead>
                        <tr>
                            <th className="list-title" colSpan={13}>
                                {" "}
                                List of Teachers{" "}
                            </th>
                        </tr>
                        <tr>
                            <th> &nbsp; &nbsp; </th>
                            <th> &nbsp; &nbsp; </th>
                            <th>#</th>
                            <th onClick={() => handleSort("schoolId")}>
                                School ID <FaSort />
                            </th>
                            <th onClick={() => handleSort("lastName")}>
                                {" "}
                                Last Name <FaSort />
                            </th>
                            <th onClick={() => handleSort("firstName")}>
                                First Name <FaSort />
                            </th>
                            <th onClick={() => handleSort("middleName")}>
                                Middle Name <FaSort />
                            </th>
                            <th onClick={() => handleSort("email")}>
                                Email <FaSort />
                            </th>
                            <th onClick={() => handleSort("phone")}>
                                Phone <FaSort />
                            </th>
                            <th onClick={() => handleSort("sex")}>
                                Sex
                                <FaSort />
                            </th>
                            <th>Action</th>
                            <th> &nbsp; &nbsp; </th>
                            <th> &nbsp; &nbsp; </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTeachers.map((teacher, index) => (
                            <tr key={teacher._id}>
                                <td> &nbsp; &nbsp; </td>
                                <td> &nbsp; &nbsp; </td>
                                <td>{index + 1}</td>
                                <td>{teacher.schoolId}</td>
                                <td>{teacher.lastName.toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    teacher.lastName.toLowerCase().slice(1)}</td>
                                <td>{teacher.middleName.toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    teacher.middleName.toLowerCase().slice(1)}</td>
                                <td>{teacher.firstName.toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    teacher.firstName.toLowerCase().slice(1)}</td>
                                <td>{teacher.email.toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    teacher.email.toLowerCase().slice(1)}</td>
                                <td>{teacher.phone}</td>
                                <td>{teacher.sex}</td>
                                <td>
                                    <FaEdit
                                        onClick={() => handleEdit(teacher)}
                                        color="green"
                                        size="30px"
                                    >
                                        Edit
                                    </FaEdit>
                                    <FaTrash
                                        onClick={() => handleDelete(teacher)}
                                        color="red"
                                        size="30px"
                                    >
                                        Delete
                                    </FaTrash>
                                </td>
                                <td> &nbsp; &nbsp; </td>
                                <td> &nbsp; &nbsp; </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* ====================================== EDIT PROFILE MODAL ==================================================== */}
                <Modal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    size="lg"
                >
                    <Modal.Header>
                        <p className="form-title"> Update teacher profile </p>
                        <span
                            className="exit-button"
                            onClick={handleCloseEditModal}
                        >
                            &times;
                        </span>
                    </Modal.Header>
                    <form className="register-form" onSubmit={handleSubmit}>
                        <label htmlFor="schoolId">School ID:</label> <br />
                        <input
                            type="text"
                            id="schoolId"
                            name="schoolId"
                            value={updatedTeacher.schoolId}
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
                            value={updatedTeacher.lastName}
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
                            value={updatedTeacher.middleName}
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
                            value={updatedTeacher.firstName}
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
                            value={updatedTeacher.email}
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
                            value={updatedTeacher.phone}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <label htmlFor="sex">Sex:</label>
                        <br />
                        <select
                            id="sex"
                            name="sex"
                            value={updatedTeacher.sex}
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
                            value={updatedTeacher.password}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <button type="submit">Save</button>
                    </form>
                </Modal>
        </>
    );
};

export default ManageTeachers;
