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

import axios from "axios";

//style for the Table and Modal
import "../../styles/TableAndModal.css";

const ManageAdmins = () => {
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

    const [showRegisterModal, setShowRegisterModal] = useState(false); //modal for REGISTER a admin
    const [showEditModal, setShowEditModal] = useState(false); //modal for EDIT admin
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

    /* =============================================== GET ALL admins ============================================= */
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/auth/")
            .then((response) => {
                setadmins(response.data);
            });
    }, []);

    /* =============================================== REGISTER a new admin ============================================= */
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

    /* ============================================ SEARCH and SORT =================================================== */
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedAdmins, setSortedAdmins] = useState(admins);
    const [sortOrder, setSortOrder] = useState("asc");
    
    useEffect(() => {
        axios
            .get("https://kinderlink.onrender.com/api/v1/auth/")
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
                setSortedAdmins(sortedResults);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    
    const handleSort = (field) => {
        let order = "asc";
        if (sortOrder === "asc") {
            order = "desc";
        }
        setSortOrder(order);
        setSortedAdmins(
            [...sortedAdmins].sort((a, b) => {
                let comparison = 0;
                if (a[field].toLowerCase() < b[field].toLowerCase()) {
                    comparison = -1;
                } else if (a[field].toLowerCase() > b[field].toLowerCase()) {
                    comparison = 1;
                }
                if (order === "desc") {
                    comparison = comparison * -1;
                }
                return comparison;
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
            setSortedAdmins(admins);
            return;
        }

        const filteredResults = admins.filter(
            (admin) =>
                admin.lastName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                admin.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                admin.middleName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                admin.phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSortedAdmins(filteredResults);
    };

    return (
        <>
            <Navigation />
            <div className="manage-admins-container container mt-5">
                <div>
                    <button className="register-button" onClick={handleShow}>
                        <FaPlus />
                        <span className="ml-2">Register an admin</span>
                    </button>
                </div>
                <p className="page-title">Manage Admins</p>
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
                    <p className="form-title">Register a new admin </p>
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
                                <option value="Admin">Admin</option>
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
                            List of Admins{" "}
                        </th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th onClick={() => handleSort("schoolId")}>
                            School ID {sortOrder === "asc" ? "↑" : "↓"}
                        </th>
                        <th onClick={() => handleSort("lastName")}>
                            {" "}
                            Last Name {sortOrder === "asc" ? "↑" : "↓"}
                        </th>
                        <th onClick={() => handleSort("firstName")}>
                            First Name {sortOrder === "asc" ? "↑" : "↓"}
                        </th>
                        <th>
                            Middle Name 
                        </th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th onClick={() => handleSort("sex")}>Sex {sortOrder === "asc" ? "↑" : "↓"}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAdmins.map((admin, index) => (
                        <tr key={admin._id}>
                            <td>{index + 1}</td>
                            <td>{admin.schoolId}</td>
                            <td>
                                {admin.lastName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    admin.lastName.toLowerCase().slice(1)}
                            </td>
                            <td>
                                {admin.firstName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    admin.firstName.toLowerCase().slice(1)}
                            </td>
                            <td>
                                {admin.middleName
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    admin.middleName.toLowerCase().slice(1)}
                            </td>

                            <td>
                                {admin.email
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                    admin.email.toLowerCase().slice(1)}
                            </td>
                            <td>{admin.phone}</td>
                            <td>{admin.sex}</td>
                            <td>
                                <FaEdit
                                    onClick={() => handleEdit(admin)}
                                    color="green"
                                    size="30px"
                                >
                                    Edit
                                </FaEdit>
                                <FaTrash
                                    onClick={() => handleDelete(admin)}
                                    color="red"
                                    size="30px"
                                >
                                    Delete
                                </FaTrash>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* ====================================== EDIT PROFILE MODAL ==================================================== */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
                <Modal.Header>
                    <p className="form-title"> Update admin profile </p>
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
    );
};

export default ManageAdmins;
