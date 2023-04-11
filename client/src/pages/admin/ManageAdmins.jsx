import React, { useState, useEffect } from "react";
import Navigation from "../../components/admin/Navigation/Navigation";
import { Table, Button, Modal, Form, InputGroup, FormControl } from "react-bootstrap";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaSort,
    FaSearch,
} from "react-icons/fa";
import RegisterModal from "../admin/RegisterModal";
import axios from "axios";

//style for the Table and Modal
import "../../styles/TableAndModal.css";

const ManageAdmins = (handleFormSubmit) => {
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

 /* ============================================ SEARCH and SORT =================================================== */
 const [searchTerm, setSearchTerm] = useState("");
 const [sortedAdmins, setSortedAdmins] = useState(admins);

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
     setSortedAdmins(
         [...sortedAdmins].sort((a, b) => {
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
   
     if (searchTerm.trim() === '') {
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
             admin.email
                 .toLowerCase()
                 .includes(searchTerm.toLowerCase()) ||
             admin.phone.toLowerCase().includes(searchTerm.toLowerCase())
     );
     setSortedAdmins(filteredResults);
 };


    return (
        <>
            <Navigation />
            <div className="manage-admins-container container mt-5">
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        <FaPlus />
                        <span className="ml-2">Register a new admin</span>
                    </Button>
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
            <RegisterModal
                showRegisterModal={showRegisterModal}
                handleClose={handleClose}
                handleFormSubmit={handleFormSubmit}
            />

            {/* ====================================== TABLE LIST ==================================================== */}
            <div className="admins-table">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th> &nbsp; &nbsp; </th>
                            <th> &nbsp; &nbsp; </th>
                            <th>#</th>
                            <th onClick={() => sortTable("schoolId")}>
                                School ID <FaSort />
                            </th>
                            <th onClick={() => sortTable("lastName")}>
                                {" "}
                                Last Name <FaSort />
                            </th>
                            <th onClick={() => sortTable("firstName")}>
                                First Name <FaSort />
                            </th>
                            <th onClick={() => sortTable("middleName")}>
                                Middle Name <FaSort />
                            </th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th onClick={() => handleSort("sex")}>Sex</th>
                            <th>Action</th>
                            <th> &nbsp; &nbsp; </th>
                            <th> &nbsp; &nbsp; </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAdmins.map((admin, index) => (
                            <tr key={admin._id}>
                                <td> &nbsp; &nbsp; </td>
                                <td> &nbsp; &nbsp; </td>
                                <td>{index + 1}</td>
                                <td>{admin.schoolId}</td>
                                <td>{admin.lastName}</td>
                                <td>{admin.middleName}</td>
                                <td>{admin.firstName}</td>
                                <td>{admin.email}</td>
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
            </div>
        </>
    );
};

export default ManageAdmins;
