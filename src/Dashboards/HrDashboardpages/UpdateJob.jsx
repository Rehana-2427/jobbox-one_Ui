import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FaEdit, FaSave } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../../pages/Footer';
import DashboardLayout from './DashboardLayout ';

// Retrieve state from location

const UpdateJob = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  // const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const { userEmail, userName, jobId, currentPage, currentPageSize } = location.state || {};
  const [isSaved, setIsSaved] = useState(false); // Track whether the details are saved

  const navigate = useNavigate();

  const [editableJobDetails, setEditableJobDetails] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobType: '',
    location: '',
    salary: '',
    postingDate: '',
    qualifications: '',
    applicationDeadline: '',
    numberOfPosition: '',
    jobsummary: '',
    skills: '',
  });


  const handleBack = () => {
    const state1 = location.state || {};
    console.log(state1)
    navigate('/hr-dashboard/my-jobs', { state: { userEmail, userName, jobId, currentPage, currentPageSize } })
    console.log("sending current page", currentPage, "and page size", currentPageSize)

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
    try {
      await axios.put(`${BASE_API_URL}/updateJob`, formData, {
        params: { jobId: jobId },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // alert('Job details updated successfully.');
      // Assume the job update logic is successful
      toast.success("Job updated successfully!", {
        onClose: () => {
          navigate('/hr-dashboard/my-jobs', {
            state: { userName, userEmail, currentPage, currentPageSize }
          });
        },
        autoClose: 2000 // Optional: auto close after 2 seconds
      });
    } catch (error) {
      console.error('Error updating job details:', error.response ? error.response.data : error.message);
    }
  };



  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

  useEffect(() => {
    // Update the `isSmallScreen` state based on screen resizing
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 767);

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
                  <Form.Group className='numberOfPosition'>
                    <Form.Label htmlFor="numberOfPosition">Number of Positions:</Form.Label>
                    <Form.Control
                      type="number"
                      id="numberOfPosition"
                      name="numberOfPosition"
                      value={formData.numberOfPosition}
                      onChange={handleChange}
                      disabled={!editableJobDetails}
                    />
                  </Form.Group>
                </Col>
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
              </Row>
              <Row style={{ marginBottom: '24px' }}>
                <Col md={6}>
                  <Form.Group className='applicationDeadline'>
                    <Form.Label htmlFor="applicationDeadline">Application Deadline:</Form.Label>
                    <Form.Control
                      type="date"
                      id="applicationDeadline"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
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

export default UpdateJob;
