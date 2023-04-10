import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

import axios from "axios";

const RegisterModal = ({ showRegisterModal, handleClose }) => {
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

    return (
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
                        <Form.Label htmlFor="userType"> User Type </Form.Label>
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
                        <Form.Label htmlFor="lastName"> Last Name </Form.Label>
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
                                ------------------------------------- Select sex
                                -----------------------------{" "}
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
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="phone">
                        <Form.Label htmlFor="phone"> Phone Number </Form.Label>
                        <br />
                        <Form.Control
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label htmlFor="password"> Password </Form.Label>
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
    );
};

export default RegisterModal;
