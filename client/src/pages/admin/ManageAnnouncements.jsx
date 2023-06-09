import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    Table,
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

    const [userDetails, setUserDetails] = useState(""); /* current user */
    const [announcements, setAnnouncements] = useState(
        []
    ); /* for mapping announcement */
    const [showModal, setShowModal] = useState(false); /* register modal */

    const [selectedFile, setSelectedFile] =
        useState(""); /* selected file for image */
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        author: localStorage.getItem("currentUserId"),
        image: "",
        date: "",
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [editedAnnouncement, setEditedAnnouncement] = useState({
        title: "",
        content: "",
    });

    /* For Table Pagination */
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const totalPages = Math.ceil(announcements.length / itemsPerPage);

    // get all announcements
    useEffect(() => {
        axios.get(`${BackendApi}/api/v1/announcement/`).then((response) => {
            setAnnouncements(response.data);
        });
    }, []);

    //sets the current user
    const clientInStorage = localStorage.getItem("currentUserId");
    //get the current user through user storage
    useEffect(() => {
        axios
            .get(`${BackendApi}/api/v1/auth/${clientInStorage}`)
            .then((result) => {
                setUserDetails(result.data);
            });
    });

    //get the current user
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAnnouncement({ ...newAnnouncement, [name]: value });
    };

    //create new announcement
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Create a new 'FormData' object to hold the announcement data and image file
            const formData = new FormData();
            formData.append("title", newAnnouncement.title);
            formData.append("content", newAnnouncement.content);
            formData.append("image", selectedFile); // 'image' is the selected image file

            // Create a new 'axios' instance with 'multipart/form-data' content type
            const axiosInstance = axios.create({
                headers: {
                    "content-type": "multipart/form-data",
                },
            });

            // Create the new announcement in the database
            const res = await axiosInstance.post(
                `${BackendApi}/api/v1/announcement/`,
                formData,
                {
                    withCredentials: true, // If using cookies for authentication
                }
            );

            setAnnouncements((prevState) => [...prevState, res.data]);
            setNewAnnouncement({ title: "", content: "", image: "" });
            setCurrentAnnouncement(null);
            setShowModal(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCloseCreateModal = () => {
        setShowModal(false);
        setNewAnnouncement({ title: "", content: "", image: "" });
        setSelectedFile("");
    };

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
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        axios
            .get(`${BackendApi}/api/v1/announcement/`)
            .then((response) => {
                setSortedAnnouncements(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleSort = (field) => {
        let newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        setSortedAnnouncements(
            [...sortedAnnouncements].sort((a, b) => {
                if (field === "title" || field === "author") {
                    let valueA = a[field].toLowerCase();
                    let valueB = b[field].toLowerCase();
                    if (valueA < valueB) {
                        return newSortOrder === "asc" ? -1 : 1;
                    } else if (valueA > valueB) {
                        return newSortOrder === "asc" ? 1 : -1;
                    } else {
                        return 0;
                    }
                } else if (field === "date") {
                    let dateA = new Date(a[field]);
                    let dateB = new Date(b[field]);
                    if (dateA < dateB) {
                        return newSortOrder === "asc" ? -1 : 1;
                    } else if (dateA > dateB) {
                        return newSortOrder === "asc" ? 1 : -1;
                    } else {
                        return 0;
                    }
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
        <>
            <Navigation />
            <div className=" manage-teachers-container container mt-5">
                <button
                    className="register-button"
                    onClick={() => setShowModal(true)}
                >
                    <FaPlus />
                    <span className="ml-2">Create an announcement </span>
                </button>
                <p className="page-title">Manage Announcements </p>
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
            <Table responsive>
                <thead className="thead-light">
                    {/* table pagination */}
                    <tr>
                        <td colSpan={9}>
                            <div>
                                Showing table {currentPage} of {totalPages}
                            </div>

                            <div>
                                <button
                                    className="arrow-buttons"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                >
                                    &larr; prev
                                </button>
                                &nbsp;
                                <button
                                    className="arrow-buttons"
                                    disabled={
                                        lastIndex >= sortedAnnouncements.length
                                    }
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                >
                                    next &rarr;
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th className="list-title" colSpan={10}>
                            {" "}
                            List of announcements{" "}
                        </th>
                    </tr>
                    <tr>
                        <th> # </th>
                        <th onClick={() => handleSort("date")}>
                            Date posted {sortOrder === "asc" ? "↑" : "↓"}
                        </th>
                        <th onClick={() => handleSort("title")}>
                            Title {sortOrder === "asc" ? "↑" : "↓"}{" "}
                        </th>
                        <th className="content-column">Content</th>
                        <th onClick={() => handleSort("author")}>
                            Author {sortOrder === "asc" ? "↑" : "↓"}
                        </th>

                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAnnouncements &&
                        sortedAnnouncements
                            .slice(firstIndex, lastIndex)
                            .map((announcement, index) => (
                                <tr key={announcement._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {(() => {
                                            const today = new Date();
                                            const announcementDate = new Date(
                                                announcement.date
                                            );
                                            const sameDate =
                                                today.getDate() ===
                                                    announcementDate.getDate() &&
                                                today.getMonth() ===
                                                    announcementDate.getMonth() &&
                                                today.getFullYear() ===
                                                    announcementDate.getFullYear();
                                            const options = {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                            };
                                            const dateString =
                                                announcementDate.toLocaleString(
                                                    "en-US",
                                                    options
                                                );
                                            return sameDate
                                                ? `${dateString} (today)`
                                                : dateString;
                                        })()}
                                    </td>

                                    <td>
                                        {announcement.title
                                            .toLowerCase()
                                            .charAt(0)
                                            .toUpperCase() +
                                            announcement.title
                                                .toLowerCase()
                                                .slice(1)}
                                    </td>
                                    <td className="content-row">
                                        {announcement.content}
                                    </td>
                                    <td>{announcement.author}</td>

                                    <td>
                                        <FaEdit
                                            onClick={() =>
                                                handleEdit(announcement)
                                            }
                                            color="green"
                                            size="30px"
                                        >
                                            Edit
                                        </FaEdit>
                                        <FaTrash
                                            onClick={() =>
                                                handleDelete(announcement)
                                            }
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
            <div>
                {/* counts all announcement */}
                <p> Total Announcements: {announcements.length} </p>
            </div>

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
                        <Form.Group controlId="image">
                            <Form.Label>image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={(event) => {
                                    const file = event.target.files[0];
                                    let reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onload = function () {
                                        setSelectedFile(reader.result);
                                    };
                                }}
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
        </>
    );
};

export default ManageAnnouncement;
