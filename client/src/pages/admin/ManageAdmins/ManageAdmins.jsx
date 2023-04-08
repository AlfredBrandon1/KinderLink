import React, {useState} from "react"
import Navigation from "../../../components/admin/Navigation/Navigation";
import { Table, Button, Modal, Form, Nav } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import axios from 'axios';

const ManageAdmins = () => {
    const [showModal, setShowModal] = useState(false);

    const [schoolId, setSchoolId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')
    const [sex, setSex] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const configuration = {
            method: 'post',
            url: 'https://kinderlink.onrender.com/api/v1/auth/register',
            data: {
                schoolId,
                firstName,
                middleName,
                lastName,
                sex,
                email,
                phone,
                password,
            }
        }

        // make the API call
        axios(configuration).then((result) =>{
            alert(result.data.status);
            /* window.location.reload(false); */
        })
        .catch((error)=>{
            alert(error.response.data.status);
        })

        // Add new admin to list of admins
/*         setAdmins((prevState) => [
            ...prevState,
            {
                id: prevState.length + 1,
                schoolId,
                firstName,
                middleName,
                lastName,
                sex,
                email,
                phone,
                password,
            },
        ]); */
        // Reset form data and hide modal
/*         setFormData({
            schoolId: "",
            firstName: "",
            middleName: "",
            lastName: "",
            sex: "",
            email: "",
            phone: "",
            password: "",
        }); */

        {<clearFormData/>}
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
            password: "",
        });
    }
    return(
        <>
        <Navigation/>
        <div className="manage-teachers-container"> 

            <p> MANAGE ADMINS </p>
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
                                    onChange={(e) => setSchoolId(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="firstName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    name="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="middleName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter middle name"
                                    name="middleName"
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter last name"
                                    name="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
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
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="phone">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter phone number"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Add admin
                            </Button>
                            <Button variant="danger" onClick={clearFormData}>
                                Clear
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
        </>


    )
}

export default ManageAdmins;