import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
    FaList,
    FaTable,
} from "react-icons/fa";

//style for the Table and Modal
import "../../styles/TableAndModal.css";

const BackendApi = "https://kinderlink.onrender.com";

const ManageStudents = () => {
    const navigate = useNavigate();

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

    /* ========================================= Fetch all student  ======================================= */
    useEffect(() => {
        axios.get(`${BackendApi}/api/v1/student/`).then((response) => {
            setStudents(response.data);
        });
    }, []);

    /* ========================================= handler for REGISTER student ======================================= */

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const configuration = {
            method: "post",
            url: `${BackendApi}/api/v1/student/register`,
            data: {
                schoolId,
                userType: "Student",
                lastName,
                middleName,
                firstName,
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

    /* ========================================= handler for REGISTER student =================================== */
    const handleShow = () => {
        setCurrentStudent(null);
        setShowRegisterModal(true);
    };

    const handleClose = () => setShowRegisterModal(false);

    /* ========================================= handler for DELETE student ======================================= */
    const handleDelete = (currentStudent) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the student record for ${currentStudent.lastName}?`
        );
        if (confirmDelete) {
            axios
                .delete(`${BackendApi}/api/v1/student/${currentStudent._id}`)
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

    /* ========================================= handler for EDIT student ======================================= */
    const handleShowEditModal = () => {
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

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
                `${BackendApi}/api/v1/student/${currentStudent._id}`,
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

    /* ============================================ SEARCH and SORT =================================================== */
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedStudents, setSortedStudents] = useState(students);

    useEffect(() => {
        axios
            .get(`${BackendApi}/api/v1/student/`)
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
                setSortedStudents(sortedResults);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleSort = (field) => {
        setSortedStudents(
            [...sortedStudents].sort((a, b) => {
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
            setSortedStudents(students);
            return;
        }
        const filteredResults = students.filter(
            (student) =>
                student.lastName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                student.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                student.middleName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                student.address
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                student.contactFirstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                student.contactMiddleName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                student.contactLastName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                student.contactEmail
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                student.contactPhone
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        setSortedStudents(filteredResults);
    };

    /* ================================================= START of RETURN ======================================================= */

    return (
        <>
            <Navigation />
            <div className="manage-students-container container mt-5">
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        <FaPlus />
                        <span className="ml-2">Register a new student</span>
                    </Button>
                </div>
                <p className="page-title">Manage Students</p>
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
                size="xl"
            >
                <Modal.Header>
                    <p className="form-title">Register a new student </p>
                    <span className="exit-button" onClick={handleClose}>
                        &times;
                    </span>
                </Modal.Header>
                <Form
                    className="register-form"
                    onSubmit={handleFormSubmit}
                    responsive
                >
                    <p className="form-subtitle"> A. Student`s Details </p>
                    <Form.Group>
                        <Form.Label htmlFor="schoolId">
                            School Id number
                        </Form.Label>
                        <br />
                        <Form.Control
                            id="schoolId"
                            type="text"
                            value={schoolId}
                            onChange={(event) =>
                                setSchoolId(event.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="userType">User Type</Form.Label>
                        <br />
                        <Form.Control
                            id="userType"
                            as="select"
                            value={userType}
                            onChange={(event) =>
                                setUserType(event.target.value)
                            }
                            required
                        >
                            <option value="Student">Student</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="firstName">First Name</Form.Label>
                        <br />
                        <Form.Control
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(event) =>
                                setFirstName(event.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="middleName">
                            Middle Name
                        </Form.Label>
                        <br />
                        <Form.Control
                            id="middleName"
                            type="text"
                            value={middleName}
                            onChange={(event) =>
                                setMiddleName(event.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="lastName">Last Name</Form.Label>
                        <br />
                        <Form.Control
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(event) =>
                                setLastName(event.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="sex">Sex</Form.Label>
                        <br />
                        <Form.Control
                            id="sex"
                            as="select"
                            value={sex}
                            onChange={(event) => setSex(event.target.value)}
                            required
                        >
                            <option value="">
                                {" "}
                                --------------------------------- Select sex
                                -----------------------------------{" "}
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="birthdate">Birthdate</Form.Label>
                        <br />
                        <Form.Control
                            id="birthdate"
                            type="date"
                            value={birthdate}
                            onChange={(event) => {
                                setBirthdate(event.target.value);
                            }}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="address">Address</Form.Label>
                        <br />
                        <Form.Control
                            id="address"
                            type="text"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            required
                        />
                    </Form.Group>

                    <hr />

                    <p className="form-subtitle"> B. Parent/Guardian Details</p>

                    <Form.Group>
                        <Form.Label htmlFor="contactFirstName">
                            First Name
                        </Form.Label>
                        <br />
                        <Form.Control
                            id="contactFirstName"
                            type="text"
                            value={contactFirstName}
                            onChange={(event) =>
                                setContactFirstName(event.target.value)
                            }
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="contactMiddleName">
                            Middle Name
                        </Form.Label>
                        <br />
                        <Form.Control
                            id="contactMiddleName"
                            type="text"
                            value={contactMiddleName}
                            onChange={(event) =>
                                setContactMiddleName(event.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="contactLastName">
                            Last Name
                        </Form.Label>
                        <br />
                        <Form.Control
                            id="contactLastName"
                            type="text"
                            value={contactLastName}
                            onChange={(event) =>
                                setContactLastName(event.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="relationship">
                            Relationship
                        </Form.Label>
                        <br />
                        <Form.Control
                            id="relationship"
                            as="select"
                            value={relationship}
                            onChange={(event) =>
                                setRelationship(event.target.value)
                            }
                            required
                        >
                            <option value="">
                                {" "}
                                ------------------------------ Select
                                relationship ------------------------------{" "}
                            </option>
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Guardian">Guardian</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="contactEmail">Email</Form.Label>
                        <br />
                        <Form.Control
                            id="contactEmail"
                            type="email"
                            value={contactEmail}
                            onChange={(event) =>
                                setContactEmail(event.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="contactPhone">
                            Phone Number
                        </Form.Label>
                        <br />
                        <Form.Control
                            id="contactPhone"
                            type="tel"
                            value={contactPhone}
                            onChange={(event) =>
                                setContactPhone(event.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <br />
                        <Form.Control
                            id="password"
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
            </Modal>

            {/* ====================================== TABLE LIST ==================================================== */}
            <Table responsive>
                <thead>
                    <tr>
                        <th className="list-title" colSpan={17}>
                            List of Students
                        </th>
                    </tr>
                    <tr>
                        <th>&nbsp;&nbsp;</th>
                        <th>&nbsp;&nbsp;</th>
                        <th>#</th>
                        <th onClick={() => handleSort("schoolId")}>
                            School ID <FaSort />
                        </th>
                        <th onClick={() => handleSort("lastName")}>
                            Last Name <FaSort />
                        </th>
                        <th onClick={() => handleSort("firstName")}>
                            First Name <FaSort />
                        </th>
                        <th onClick={() => handleSort("middleName")}>
                            Middle Name <FaSort />
                        </th>
                        <th onClick={() => handleSort("sex")}>
                            Sex <FaSort />
                        </th>
                        <th onClick={() => handleSort("birthdate")}>
                            Birthdate <FaSort />
                        </th>
                        <th onClick={() => handleSort("age")}>
                            Age <FaSort />
                        </th>
                        <th onClick={() => handleSort("address")}>
                            Address <FaSort />
                        </th>
                        <th onClick={() => handleSort("contactFirstName")}>
                            Contact Person's Name <FaSort />
                        </th>
                        <th onClick={() => handleSort("relationship")}>
                            Relationship <FaSort />
                        </th>
                        <th onClick={() => handleSort("contactEmail")}>
                            Email <FaSort />
                        </th>
                        <th onClick={() => handleSort("contactPhone")}>
                            Phone # <FaSort />
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStudents.map((student, index) => (
                        <tr key={student._id}>
                            <td>&nbsp;&nbsp;</td>
                            <td>&nbsp;&nbsp;</td>
                            <td>{index + 1}</td>
                            <td>{student.schoolId}</td>
                            <td>
                                {student.lastName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    student.lastName.toLowerCase().slice(1)}
                            </td>
                            <td>
                                {student.middleName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    student.middleName.toLowerCase().slice(1)}
                            </td>
                            <td>
                                {student.firstName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    student.firstName.toLowerCase().slice(1)}
                            </td>
                            <td>
                                {student.sex
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    student.sex.toLowerCase().slice(1)}
                            </td>
                            <td>
                                {new Date(student.birthdate).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </td>
                            <td>
                                {(() => {
                                    const dob = new Date(student.birthdate);
                                    const diff_ms = Date.now() - dob.getTime();
                                    const age_dt = new Date(diff_ms);
                                    return Math.abs(
                                        age_dt.getUTCFullYear() - 1970
                                    );
                                })()}
                            </td>

                            <td>{student.address}</td>
                            <td>{`${
                                student.contactFirstName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                student.contactFirstName.toLowerCase().slice(1)
                            } ${
                                student.contactMiddleName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                student.contactMiddleName.toLowerCase().slice(1)
                            } ${
                                student.contactLastName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                student.contactLastName.toLowerCase().slice(1)
                            }`}</td>
                            <td>{student.relationship}</td>
                            <td>
                                {student.contactEmail
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    student.contactEmail.toLowerCase().slice(1)}
                            </td>
                            <td>{student.contactPhone}</td>
                            <td>
                                <FaEdit
                                    title="Edit"
                                    onClick={() => handleEdit(student)}
                                    color="green"
                                    size="30px"
                                    style={{ cursor: "pointer" }}
                                ></FaEdit>
                                <FaTrash
                                    title="Delete"
                                    onClick={() => handleDelete(student)}
                                    color="red"
                                    size="30px"
                                    style={{ cursor: "pointer" }}
                                ></FaTrash>
                                <FaTable
                                    title="                                    View Report Card"
                                    color="blue"
                                    size="30px"
                                    onClick={() =>
                                        navigate(`/${student._id}/report-card`)
                                    }
                                    style={{ cursor: "pointer" }}
                                ></FaTable>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* ====================================== EDIT PROFILE MODAL ==================================================== */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
                <Modal.Header>
                    <p className="form-title"> Update student profile </p>
                    <span
                        className="exit-button"
                        onClick={handleCloseEditModal}
                    >
                        &times;
                    </span>
                </Modal.Header>
                <Form className="register-form" onSubmit={handleSubmit}>
                    <div>
                        <p className="form-subtitle"> A. Student`s Details </p>
                        <Form.Group>
                            <Form.Label htmlFor="schoolId">
                                School Id number
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="schoolId"
                                name="schoolId"
                                type="text"
                                value={updatedStudent.schoolId}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="userType">
                                User Type
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="userType"
                                name="userType"
                                as="select"
                                value={updatedStudent.userType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Student">Student</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="firstName">
                                First Name
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={updatedStudent.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="middleName">
                                Middle Name
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="middleName"
                                name="middleName"
                                type="text"
                                value={updatedStudent.middleName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="lastName">
                                Last Name
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={updatedStudent.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="sex">Sex</Form.Label>
                            <br />
                            <Form.Control
                                id="sex"
                                name="sex"
                                as="select"
                                value={updatedStudent.sex}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">
                                    {" "}
                                    --------------------------------- Select sex
                                    -----------------------------------{" "}
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="birthdate">
                                Birthdate
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="birthdate"
                                name="birthdate"
                                type="date"
                                value={updatedStudent.birthdate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="address">Address</Form.Label>
                            <br />
                            <Form.Control
                                id="address"
                                name="address"
                                type="text"
                                value={updatedStudent.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <hr />

                        <p className="form-subtitle">
                            {" "}
                            B. Parent/Guardian Details
                        </p>

                        <Form.Group>
                            <Form.Label htmlFor="contactFirstName">
                                First Name
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="contactFirstName"
                                name="contactFirstName"
                                type="text"
                                value={updatedStudent.contactFirstName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="contactMiddleName">
                                Middle Name
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="contactMiddleName"
                                name="contactMiddleName"
                                type="text"
                                value={updatedStudent.contactMiddleName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="contactLastName">
                                Last Name
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="contactLastName"
                                name="contactLastName"
                                type="text"
                                value={updatedStudent.contactLastName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="relationship">
                                Relationship
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="relationship"
                                name="relationship"
                                as="select"
                                value={updatedStudent.relationship}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">
                                    {" "}
                                    ------------------------------ Select
                                    relationship ------------------------------{" "}
                                </option>
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Guardian">Guardian</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="contactEmail">
                                Email
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                value={updatedStudent.contactEmail}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="contactPhone">
                                Phone Number
                            </Form.Label>
                            <br />
                            <Form.Control
                                id="contactPhone"
                                name="contactPhone"
                                type="tel"
                                value={updatedStudent.contactPhone}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <br />
                            <Form.Control
                                id="password"
                                name="password"
                                type="password"
                                value={updatedStudent.password}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </div>

                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default ManageStudents;
