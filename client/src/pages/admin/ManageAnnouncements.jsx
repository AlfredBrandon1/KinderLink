import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Modal, Form } from "react-bootstrap";
import Navigation from "../../components/admin/Navigation/Navigation";

const ManageAnnouncement = () => {
    const BackendApi = "https://kinderlink.onrender.com";
  
    const [userDetails, setUserDetails] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [newAnnouncement, setNewAnnouncement] = useState({
      title: "",
      content: "",
      author: localStorage.getItem("currentUserId"),
    });
  
    const [editedAnnouncement, setEditedAnnouncement] = useState({
      title: "",
      content: "",
      author: `Edited by: ${localStorage.getItem("currentUserId")}`,
    });
  
    // get all announcements
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${BackendApi}/api/v1/announcement/`);
        setAnnouncements(res.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    //sets the current user
    const clientInStorage = localStorage.getItem("currentUserId");
  
    useEffect(() => {
      axios
        .get(`${BackendApi}/api/v1/auth/${clientInStorage}`)
        .then((result) => {
          setUserDetails(result.data);
        });
    });
  
    //get the current user
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
  
    //create new announcement
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const res = await axios.post(`${BackendApi}/api/v1/announcement/`, {
          ...newAnnouncement,
          author: `${userDetails.firstName} ${userDetails.lastName}`,
          date: new Date(),
        });
  
        setAnnouncements((prevState) => [...prevState, res.data]);
        setNewAnnouncement({ title: "", content: "" });
        setCurrentAnnouncement(null);
        setShowModal(false);
      } catch (err) {
        console.log(err);
      }
    };
  
    //handles the update/edit of announcement
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
  
    //delete
    const handleDelete = (currentAnnouncement) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the announcement: ${currentAnnouncement.title}?`
        );
        if (confirmDelete) {
            axios
                .delete(
                    `${BackendApi}/api/v1/announcement/${currentAnnouncement._id}`
                )
                .then((response) => {
                    alert(response.data.message);
                    // remove deleted announcement from list of teachers
                    setAnnouncements((prevState) =>
                        prevState.filter(
                            (announcement) => announcement._id !== currentAnnouncement._id
                        )
                    );
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        }
    };
  

    return (
        <div className=" container mt-3">
            <Navigation />
            <h2>Manage Announcements</h2>
            <Button variant="success" onClick={() => setShowModal(true)}>
                Add Announcement
            </Button>
            <table className="table table-hover">
                <thead className="thead-light">
                    <tr>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Author</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements &&
                        announcements.map((announcement) => (
                            <tr key={announcement._id}>
                                <td>{announcement.title}</td>
                                <td>{announcement.content}</td>
                                <td>{announcement.author}</td>
                                <td>
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
                                        onClick={() => handleUpdate(announcement)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

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
