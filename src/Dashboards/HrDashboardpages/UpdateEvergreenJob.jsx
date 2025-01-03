import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FaEdit, FaSave } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../pages/Footer';
import DashboardLayout from './DashboardLayout ';

const UpdateEvergreenJob = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const { userEmail, userName, jobId, currentPage, currentPageSize } = location.state || {};
    const navigate = useNavigate();
    const [editableJobDetails, setEditableJobDetails] = useState(false);
    const [formData, setFormData] = useState({
        jobTitle: '',
        jobType: '',
        location: '',
        salary: '',
        postingDate: '',
        jobsummary: '',
        skills: '',
    });
    const [isSaved, setIsSaved] = useState(false); // Track whether the details are saved

    const handleBack = () => {
        navigate('/hr-dashboard/evergreen-jobs', { state: { userEmail, userName, jobId, currentPage, currentPageSize } });
    };

    useEffect(() => {
        if (jobId) {
            fetchJobDetails(jobId);
        }
    }, [jobId]);

    const fetchJobDetails = async (id) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getJob`, { params: { jobId: id } });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditJobDetails = () => {
        setEditableJobDetails(true);
    };

    const handleSaveJobDetails = () => {
        setEditableJobDetails(false);
        setIsSaved(true); // Mark the details as saved
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSaved) {
            alert('Please save the changes before posting.');
            return;
        }
        try {
            await axios.put(`${BASE_API_URL}/updateJob`, formData, {
                params: { jobId: jobId },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Job details updated successfully.');
            navigate('/hr-dashboard/evergreen-jobs', { state: { userName, userEmail, currentPage, currentPageSize } });
        } catch (error) {
            console.error('Error updating job details:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <DashboardLayout>
            <div className="main-content">
                <Card style={{ marginTop: '10px', width: '100%' }}>
                    <Card.Header>
                        <Card.Title className="mb-0" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ fontSize: '25px', margin: 0 }}>Update Job</h3>
                            <p style={{ margin: 0 }}>
                                (Edit job details to ensure accurate information and attract the right candidates)
                            </p>
                        </Card.Title>
                    </Card.Header>

                    <Form onSubmit={handleSubmit}>
                        <Card.Body>
                            <Row style={{ marginBottom: '24px' }}>
                                <Col md={6}>
                                    <Form.Group controlId="jobTitle">
                                        <Form.Label htmlFor="jobTitle">Job Title:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="jobTitle"
                                            name="jobTitle"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                            disabled={!editableJobDetails}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='jobType'>
                                        <Form.Label htmlFor="jobType">Job Type:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="jobType"
                                            name="jobType"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                            disabled={!editableJobDetails}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: '24px' }}>
                                <Col md={6}>
                                    <Form.Group className='postingDate'>
                                        <Form.Label htmlFor="postingDate">Posting Date:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            id="postingDate"
                                            name="postingDate"
                                            value={formData.postingDate}
                                            onChange={handleChange}
                                            disabled={!editableJobDetails}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='skills'>
                                        <Form.Label htmlFor="skills">Skills:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="skills"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            disabled={!editableJobDetails}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: '24px' }}>
                                <Col md={6}>
                                    <Form.Group className='salary'>
                                        <Form.Label htmlFor="salary">Salary:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="salary"
                                            name="salary"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            disabled={!editableJobDetails}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='location'>
                                        <Form.Label htmlFor="location">Location:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            disabled={!editableJobDetails}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="jobsummary">
                                <Form.Label htmlFor="jobsummary">Job summary:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    id="jobsummary"
                                    name="jobsummary"
                                    value={formData.jobsummary}
                                    onChange={handleChange}
                                    disabled={!editableJobDetails}
                                    style={{ minHeight: '150px' }}
                                />
                            </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <div className='job-save-edit-buttons'>
                                {editableJobDetails ? (
                                    <Button variant="primary" type="button" onClick={handleSaveJobDetails}><FaSave /> Save</Button>
                                ) : (
                                    <Button variant="info" type="button" onClick={handleEditJobDetails}><FaEdit /> Edit</Button>
                                )}
                                <Button variant="success" type="submit" disabled={!isSaved}>Post</Button>
                                <Button variant='primary' onClick={handleBack}>Back</Button>
                            </div>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
            <Footer />

        </DashboardLayout>
    );
};

export default UpdateEvergreenJob;
