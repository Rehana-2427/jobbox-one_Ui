import { faEnvelope, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../apiClient';
import CustomNavbar from './CustomNavbar';

const Contact = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    agreeTerms: false,
  });
  const [isMessageSent, setIsMessageSent] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage
    if (loggedInUser) {
      setFormData((prevData) => ({
        ...prevData,
        name: loggedInUser.userName || '',
        email: loggedInUser.userEmail || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please accept the terms and conditions.');
      return;
    }

    try {
      const response = await api.sendMessage(formData); // Use the API client
      if (response.status === 200) {
        setIsMessageSent(true);
        alert("Mail sent");
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div>
        <Container className="contact-container my-4">
          <Row>
            <Col md={6}>
              <h1>Contact Us</h1>
              <p>
                We are here to assist you with any inquiries or questions you may have. Feel free to reach out to us via email at info@paisafund.com or call us at +1 234 567 890. Our office is located at 123 Job Portal Street, City, Country. We look forward to hearing from you!
              </p>
              <div className="contact-info">
                <p><FontAwesomeIcon icon={faEnvelope} /> Email: info@paisafund.com</p>
                <p><FontAwesomeIcon icon={faPhone} /> Phone: +1 234 567 890</p>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Address: 123 Job Portal Street, City, Country</p>
              </div>
            </Col>
            <Col md={6}>
              <h2>Send Us a Message</h2>
              {isMessageSent ? (
                <Alert variant="success" className="text-center">
                  Your message has been sent successfully! <Link to="/">Go to Home Page</Link>
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled // Disable input for logged-in user
                    />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled // Disable input for logged-in user
                    />
                  </Form.Group>
                  <Form.Group controlId="subject">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="message">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="agreeTerms">
                    <Form.Check
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      label={<span>I agree to the <Link to="/termsandconditions">Terms and Conditions</Link></span>}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Send Message
                  </Button>
                </Form>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Contact;
