import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FindCompany = () => {
    const [formData, setFormData] = useState({
        companyName: '',
    });
    const [modalMessageHR, setModalMessageHR] = useState('');
    const [modalMessageCompany, setModalMessageCompany] = useState('');
    const navigate = useNavigate();
    // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${BASE_API_URL}/findCompany`, {
                params: {
                    companyName: formData.companyName
                }
            });

            if (response.data) {
                // Navigate to HR registration page if company exists
                setModalMessageHR('Company already exists. Please register as HR.');
            } else {
                setModalMessageCompany('Company not found. Please fill in company details.');
            }
        } catch (error) {
            console.error('Error searching company:', error);
        }
    };

    const closeModal = () => {
        setModalMessageHR('');
        setModalMessageCompany('');
    };

    const companyName = formData.companyName;
    
    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100">
        <Form onSubmit={handleSearch} className="searchCompany w-45">
            <Form.Group controlId="companyName">
                <Form.Label><strong>Company Name:</strong></Form.Label>
                <Form.Control
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder='Enter Your Company Name'
                    required
                     className="form-control-xm"
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
                Search
            </Button>
        </Form>

        <Modal show={!!modalMessageHR} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Company Found</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessageHR}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => navigate("/signup/hrSignup", { state: { companyName } })}>
                    Register as HR
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={!!modalMessageCompany} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Company Not Found</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessageCompany}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => navigate("/findCompany/company-form")}>
                    Fill Company Form
                </Button>
            </Modal.Footer>
        </Modal>
    </Container>
    );
};
export default FindCompany;
