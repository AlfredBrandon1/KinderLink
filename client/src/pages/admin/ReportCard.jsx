import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/admin/Navigation/Navigation";

const ReportCard = ({ studentId }) => {
    const BackendApi = "https://kinderlink.onrender.com";
    const [reportCard, setReportCard] = useState(null);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        // Load report card data for the student
        axios
            .get(`${BackendApi}/api/v1/reportCard/${studentId}`)
            .then((response) => {
                setReportCard(response.data);
                setSubjects(response.data.subjects);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [studentId]);

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const newSubjects = [...subjects];
        newSubjects[index][name] = value;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { name: "", grade: "", comments: "" }]);
    };

    const handleDeleteSubject = (index) => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const handleSaveReportCard = () => {
        const updatedReportCard = { ...reportCard, subjects };
        axios
            .put(
                `${BackendApi}/api/v1/${studentId}/report-card`,
                updatedReportCard
            )
            .then((response) => {
                setReportCard(response.data);
                setSubjects(response.data.subjects);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDeleteReportCard = () => {
        axios
            .delete(
                `${BackendApi}/api/v1/${studentId}/report-card/:reportCardId`
            )
            .then(() => {
                // Redirect to student list page
                window.location.href = "/students";
            })
            .catch((error) => {
                console.error(error);
            });
    };

    /*   if (!reportCard) {
    return <div>Loading...</div>;
  }
 */
    return (
        <>
            <Navigation />
            <div>
                <h1>Report Card for {/* {reportCard.studentName} */}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Grade</th>
                            <th>Comments</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        name="name"
                                        value={subject.name}
                                        onChange={(e) =>
                                            handleInputChange(e, index)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="grade"
                                        value={subject.grade}
                                        onChange={(e) =>
                                            handleInputChange(e, index)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="comments"
                                        value={subject.comments}
                                        onChange={(e) =>
                                            handleInputChange(e, index)
                                        }
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleDeleteSubject(index)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleAddSubject}>Add Subject</button>
                <br />
                <button onClick={handleSaveReportCard}>Save Report Card</button>
                <button onClick={handleDeleteReportCard}>
                    Delete Report Card
                </button>
            </div>
        </>
    );
};

export default ReportCard;
