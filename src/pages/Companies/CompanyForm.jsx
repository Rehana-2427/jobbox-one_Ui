import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const CompanyForm = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    contactNumber: '',
    companyEmail: '',
    industry: '',
    location: '',
    description: '',
    date: '',
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    setIsSubmitting(true); // Set submitting flag

    try {
      const response = await saveCompanyData(formData);
      if (response.ok) {
        setSuccessMessage("Company added successfully");
        navigate('/signup/hrSignup', { state: { companyName: formData.companyName } });
        setFormData({
          companyName: '',
          contactNumber: '',
          companyEmail: '',
          industry: '',
          location: '',
          description: '',
          date: '',
        });
      } else {
        setErrorMessage("Company already exists. Please try again.");
      }
    } catch (error) {
      setErrorMessage2("Error adding company. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting flag
    }
  };

  const saveCompanyData = async (formData) => {
    const response = await fetch(`${BASE_API_URL}/saveCompany`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    return response;
  };

  return (
    <Card style={{ marginTop: '30px',width:'100vw',height:'100vh' }}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-center">Fill Company Details</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row style={{ marginBottom: '24px' }}>
            <Col md={6}>
              <Form.Group controlId="companyName">
                <Form.Label><strong>Company Name:</strong></Form.Label>
                <Form.Control type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder='Enter Company Name' required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="contactNumber">
                <Form.Label><strong>Contact Number:</strong></Form.Label>
                <Form.Control type="tel" name="contactNumber" value={formData.contactNumber} placeholder='Enter company contact number' onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ marginBottom: '24px' }}>
            <Col md={6}>
              <Form.Group controlId="companyEmail">
                <Form.Label><strong>Company Email:</strong></Form.Label>
                <Form.Control type="email" name="companyEmail" placeholder='Enter Company Email(companyname@email.com)' value={formData.companyEmail} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="industry">
                <Form.Label><strong>Industry:</strong></Form.Label>
                <Form.Control type="text" name="industry" placeholder='IT OR NON_IT' value={formData.industry} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ marginBottom: '24px' }}>
            <Col md={6}>
              <Form.Group controlId="location">
                <Form.Label><strong>Location:</strong></Form.Label>
                <Form.Control type="text" name="location" placeholder='Location' value={formData.location} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="date">
                <Form.Label><strong>Date:</strong></Form.Label>
                <Form.Control type="date" name="date" placeholder='Date' value={formData.date} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="description">
            <Form.Label><strong>Description:</strong></Form.Label>
            <Form.Control as="textarea" name="description" placeholder='About Company' value={formData.description} onChange={handleChange} />
          </Form.Group>
          <Card.Footer>
            <div className="d-flex justify-content-center">
              <Button type="submit" disabled={isSubmitting}>Submit</Button>
            </div>
          </Card.Footer>
        </Form>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
            <Link
              to={{
                pathname: '/signup/hrSignup',
                state: { companyName: formData.companyName }
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup/hrSignup', { state: { companyName: formData.companyName } });
              }}
            >
              Click here to fill your details
            </Link>
          </div>
        )}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CompanyForm;
