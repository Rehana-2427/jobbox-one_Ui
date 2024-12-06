import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DashboardLayout from './DashboardLayout ';

const AddJob = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, userEmail } = location.state || {};
  console.log(userEmail);
  const [formData, setFormData] = useState({
    hrEmail: userEmail || '',
    jobTitle: '',
    jobType: '',
    location: '',
    salary: '',
    postingDate: '',
    qualifications: '',
    applicationDeadline: '',
    numberOfPosition: '',
    jobsummary: '',
    jobCategory: null,
  });

  console.log(formData.jobCategory)
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      userEmail: userEmail || '',
    }));
  }, [userEmail]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await saveJobData(formData);
      if (response.ok) {
        console.log('Job posted successfully!');
        await Swal.fire({
          icon: "success",
          title: "Job post Successful!",
          text: "You have successfully posted this job."
        });
        navigate('/hr-dashboard/my-jobs/addJob/jodAddSuccess', { state: { userName: userName, userEmail: userEmail } });
        // Add any post-submit success logic, e.g. navigation or success message
      } else {
        throw new Error('Job submission failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveJobData = async (formData) => {
    try {
      const response = await fetch(`${BASE_API_URL}/postingJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      return response;
    } catch (error) {
      throw new Error("Invalid Job details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };
  const handleBack = () => {
    navigate(-1);
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
    <DashboardLayout >
      <h3 className='text-center'>Post Job</h3>
      <Card style={{ marginTop: '5px', width: '98%', marginLeft: '10px' }}>
        <Form onSubmit={handleSubmit}>
          <Card.Body>
            <Row style={{ marginBottom: '24px' }}>
              <Col md={6}>
                <Form.Group controlId="jobTitle">
                  <Form.Label>Job Title:</Form.Label>
                  <Form.Control
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder='Eg: Java Developer , Software Developer , Full Stack Developer'
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="jobType">
                  <Form.Label>Job Type:</Form.Label>
                  <Form.Control
                    type="text"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    placeholder='Eg: FullTime , Contarct , Internship'
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }}>
              <Col md={6}>
                <Form.Group controlId="postingDate">
                  <Form.Label>Posting Date:</Form.Label>
                  <Form.Control
                    type="date"
                    name="postingDate"
                    value={formData.postingDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="skills">
                  <Form.Label>Skills:</Form.Label>
                  <Form.Control
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                    placeholder='Eg: Java , Python , C , C++ , React , Node'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }}>
              <Col md={6}>
                <Form.Group controlId="numberOfPosition">
                  <Form.Label>Number of Positions:</Form.Label>
                  <Form.Control
                    type="number"
                    name="numberOfPosition"
                    value={formData.numberOfPosition}
                    onChange={handleChange}
                    placeholder='Number of openings'
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="salary">
                  <Form.Label>Salary:</Form.Label>
                  <Form.Control
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    placeholder='Enter Salary'
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }}>
              <Col md={6}>
                <Form.Group controlId="applicationDeadline">
                  <Form.Label>Application Deadline:</Form.Label>
                  <Form.Control
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="location">
                  <Form.Label>Location :</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="jobsummary">
              <Form.Label>Job summary: (Add Additional Information)</Form.Label>
              <Form.Control
                as="textarea"
                name="jobsummary"
                value={formData.jobsummary}
                onChange={handleChange}
                className="fullWidthTextarea"
                style={{ minHeight: '150px' }}
              />
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <div className="d-flex justify-content-center">
              <Button type="submit" className="btn btn-primary m-1">
                Post Job
              </Button>
              <Button className="btn btn-light m-1" onClick={handleBack}>Back</Button>
            </div>
          </Card.Footer>
        </Form>
      </Card>
    </DashboardLayout>
  );
}
export default AddJob;
