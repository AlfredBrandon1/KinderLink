import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Modal, Form } from "react-bootstrap";
import Navigation from "../../components/admin/Navigation/Navigation"
 
const ManageAnnouncement = () => {
    const BackendApi = "https://kinderlink.onrender.com";

    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
      title: "",
      content: "",
    });

    const fetchAnnouncements = async () => {
        try {
          const res = await axios.get(`${BackendApi}/api/v1/announcements`);
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
        
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        
        try {
          const res = await axios.post(`${BackendApi}/api/v1/announcements`, {
            ...newAnnouncement,
            author: currentUser.username,
            date: new Date(),
          });
          
          setAnnouncements((prevState) => [...prevState, res.data]);
          setNewAnnouncement({ title: "", content: "" });
          setShowModal(false);
        } catch (err) {
          console.log(err);
        }
      };
      return (

        <div className="container mt-3">
            <Navigation/>
          <h2>Manage Announcements</h2>
          <Button variant="success" onClick={() => setShowModal(true)}>
  Add Announcement
</Button>

          
          {/* Announcement List */}
          {announcements.map((announcement) => (
  <Card key={announcement._id} className="my-3">
    <Card.Body>
      <Card.Title>{announcement.title}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        {announcement.author} | {new Date(announcement.date).toLocaleDateString()}
      </Card.Subtitle>
      <Card.Text>{announcement.content}</Card.Text>
      <Button variant="primary" className="mr-2">
        Edit
      </Button>
      <Button variant="danger">Delete</Button>
    </Card.Body>
  </Card>
))}

          
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

{/* <Button variant="primary" className="mr-2" onClick={() => handleEdit(announcement)}>
  Edit
</Button>
<Button variant="danger" onClick={() => handleDelete(announcement._id)}>
  Delete
</Button>

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
 */}


          
        </div>
      );
            
      



}

  export default ManageAnnouncement;