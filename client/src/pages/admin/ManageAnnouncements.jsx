import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    Button,
    Modal,
    Form,
    InputGroup,
    FormControl,
} from "react-bootstrap";
import Navigation from "../../components/admin/Navigation/Navigation";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaSort,
    FaSearch,
} from "react-icons/fa";

const ManageAnnouncement = () => {
    const BackendApi = "https://kinderlink.onrender.com";

    const [userDetails, setUserDetails] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        author: localStorage.getItem("currentUserId"),
        date: "",
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [editedAnnouncement, setEditedAnnouncement] = useState({
        title: "",
        content: "",
    });

    // get all announcements
    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${BackendApi}/api/v1/announcement/`);
            setAnnouncements(res.data);
            console.log(res.data);
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
                author: `${userDetails.firstName} ${userDetails.lastName} (${userDetails.userType})`,
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

    const handleCloseCreateModal = () => setShowModal(false);

    // handles the update/edit of announcement
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleEdit = (announcement) => {
        setShowEditModal(true);
        setCurrentAnnouncement(announcement);
        setEditedAnnouncement({
            title: announcement.title,
            content: announcement.content,
        });
    };

    const handleInputEditChange = (event) => {
        const { name, value } = event.target;
        setEditedAnnouncement({ ...editedAnnouncement, [name]: value });
    };

    const handleSubmitEdit = (event) => {
        event.preventDefault();

        axios
            .put(
                `${BackendApi}/api/v1/announcement/${currentAnnouncement._id}`,
                editedAnnouncement
            )
            .then((response) => {
                console.log(response.data);
                alert("Announcement successfully updated!");
                setCurrentAnnouncement(null);
                handleCloseEditModal();
            })
            .catch((error) => {
                console.error(error);
                alert("Error updating announcement!");
            });
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
                    // remove deleted announcement from list of announcements
                    setAnnouncements((prevState) =>
                        prevState.filter(
                            (announcement) =>
                                announcement._id !== currentAnnouncement._id
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
    const [sortedAnnouncements, setSortedAnnouncements] =
        useState(announcements);

    useEffect(() => {
        axios
            .get(`${BackendApi}/api/v1/announcement/`)
            .then((response) => {
                const sortedResults = response.data.sort((a, b) => {
                    // Sort by author
                    if (a.author.toLowerCase() < b.author.toLowerCase()) {
                        return -1;
                    } else {
                        return a.author.toLowerCase() > b.author.toLowerCase()
                            ? 1
                            : 0;
                    }
                });
                setSortedAnnouncements(sortedResults);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleSort = (field) => {
        setSortedAnnouncements(
            [...sortedAnnouncements].sort((a, b) => {
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
            setSortedAnnouncements(announcements);
            return;
        }
        const filteredResults = announcements.filter(
            (announcement) =>
                announcement.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                announcement.content
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                announcement.author
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                announcement.date
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        setSortedAnnouncements(filteredResults);
    };

    return (
        <div className=" container mt-3">
            <Navigation />
            <h2>Manage Announcements</h2>
            <Button variant="success" onClick={() => setShowModal(true)}>
                Post an announcement
            </Button>
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
            <table className="table table-hover table-responsive-lg">
                <thead className="thead-light">
                    <tr>
                        <th className="list-title" colSpan={17}>
                            {" "}
                            List of announcements{" "}
                        </th>
                    </tr>
                    <tr>
                        <th onClick={() => handleSort("title")}>
                            Title <FaSort />{" "}
                        </th>
                        <th
                            onClick={() => handleSort("content")}
                            className="content-column"
                        >
                            Content <FaSort />
                        </th>
                        <th onClick={() => handleSort("author")}>
                            Author <FaSort />
                        </th>
                        <th onClick={() => handleSort("date")}>
                            Date created <FaSort />
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements &&
                        announcements.map((announcement) => (
                            <tr key={announcement._id}>
                                <td>{announcement.title}</td>
                                <td className="content-row">
                                    {announcement.content}
                                </td>
                                <td>{announcement.author}</td>
                                <td>
                                    {" "}
                                    {new Date(
                                        announcement.date
                                    ).toLocaleDateString()}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger mr-2"
                                        onClick={() =>
                                            handleDelete(announcement)
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
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Add Announcement Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <p className="form-title"> Post an announcement </p>
                    <span
                        className="exit-button"
                        onClick={handleCloseCreateModal}
                    >
                        &times;
                    </span>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label> <br />
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
                            <br />
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={newAnnouncement.content}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Post
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Announcement Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header>
                    <p className="form-title"> Edit announcement </p>
                    <span
                        className="exit-button"
                        onClick={handleCloseEditModal}
                    >
                        &times;
                    </span>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitEdit}>
                        <Form.Group controlId="editTitle">
                            <Form.Label>Title</Form.Label>
                            <br />
                            <Form.Control
                                type="text"
                                name="title"
                                value={editedAnnouncement.title}
                                onChange={handleInputEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="editContent">
                            <Form.Label>Content</Form.Label>
                            <br />
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={editedAnnouncement.content}
                                onChange={handleInputEditChange}
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
