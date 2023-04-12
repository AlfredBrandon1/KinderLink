import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Modal, Form } from "react-bootstrap";
import Navigation from "../../components/admin/Navigation/Navigation";

const ManageAnnouncement = () => {
    const BackendApi = "https://kinderlink.onrender.com";

    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        author: localStorage.getItem("currentUserId"),
    });

    const [editedAnnouncement, setEditedAnnouncement] = useState({
        title: "",
        content: "",
        author: localStorage.getItem("currentUserId"),
    });

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${BackendApi}/api/v1/announcement/`);
            setAnnouncements(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAnnouncement((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const currentUser = localStorage.getItem("currentUserId");
        try {
            const res = await axios.post(`${BackendApi}/api/v1/announcement/`, {
                ...newAnnouncement,
                author: currentUser,
                date: new Date(),
            });

            setAnnouncements((prevState) => [...prevState, res.data]);
            setNewAnnouncement({ title: "", content: "" });
            setShowModal(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdate = (event) => {
        event.preventDefault();
        axios
            .put(
                `${BackendApi}/api/v1/announcement/${editedAnnouncement._id}`,
                editedAnnouncement
            )
            .then((res) => {
                const updatedAnnouncement = res.data;
                const updatedAnnouncements = announcements.map((announcement) =>
                    announcement._id === updatedAnnouncement._id
                        ? updatedAnnouncement
                        : announcement
                );
                setAnnouncements(updatedAnnouncements);
                setShowEditModal(false);
            })
            .catch((err) => console.log(err));
    };
    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setEditedAnnouncement((prevAnnouncement) => ({
            ...prevAnnouncement,
            [name]: value,
        }));
    };
    

    return (
        <div className=" container mt-3">
            <Navigation />
            <h2>Manage Announcements</h2>
            <Button variant="success" onClick={() => setShowModal(true)}>
                Add Announcement
            </Button>
            {announcements &&
                announcements.map((announcement) => {
                    return (
                        <div key={announcement._id} className="col-md-4">
                            <div className="card mb-4  ">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {announcement.title}
                                    </h5>
                                    <p className="card-text">
                                        {announcement.content}
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Author: {announcement.author}
                                        </small>
                                    </p>
                                    <button
                                        className="btn btn-danger mr-2"
                                        onClick={() =>
                                            handleDelete(announcement._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => handleEdit(announcement)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}


            {/* Add Announcement Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Announcement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newAnnouncement.title}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="content">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={newAnnouncement.content}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Announcement
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Announcement Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Announcement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group controlId="editTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={editedAnnouncement.title}
                                onChange={handleEditInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="editContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={editedAnnouncement.content}
                                onChange={handleEditInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Announcement
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ManageAnnouncement;
