import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Card, Col, Nav, Row } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import api from '../../apiClient';
import CustomNavbar from '../CustomNavbar';
import TextField from './sessions/TextField';

const HrSignin = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const validationSchema = yup.object().shape({
        userEmail: yup.string().email("Invalid email").required("Email is required"),
        password: yup.string().min(8, "Password must be 8 characters long").required("Password is required")
    });
    const [errorMessage, setErrorMessage] = useState('');
    const initialValues = { userEmail: "", password: "" };

    const handleSubmit = async (values, { setSubmitting }) => {
        console.log('Form submitted with values:', values); // Log submitted values
        try {
            const response = await api.userLogin(values.userEmail, values.password)
            const user = response.data.user;
            const token = response.data.token;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            console.log('API Response:', response.data); // Log entire response
            console.log('User Role:', user.userRole, 'User Status:', user.userStatus); // Log user role and status

            if (user) {
                if (user.userRole === 'HR' && user.userStatus === 'Approved') {
                    navigate('/hr-dashboard', { state: { userEmail: user.userEmail } });
                } else {
                    setErrorMessage("Invalid login credentials or role. Please try again.");
                }
            } else {
                setErrorMessage("Invalid email or password.");
            }
        } catch (error) {
            console.log('Login Error:', error); // Log any errors
            setErrorMessage("An error occurred during login. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div>
            <CustomNavbar />
            <div className="auth-layout-wrap">
                <div className="auth-content">
                    <Card className="o-hidden">
                        <Row>
                            <Col md={6}>
                                <div className="p-4">
                                    <div className="auth-logo text-center mb-4">
                                        <img src="/jb_logo.png" alt="jobbox_logo" />
                                    </div>
                                    <h1 className="mb-3 text-18">Employee Login</h1>
                                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                            <Form onSubmit={handleSubmit} className="w-100">
                                                <TextField
                                                    type="email"
                                                    name="userEmail"
                                                    label="Enter your company email"
                                                    onBlur={handleBlur}
                                                    value={values.userEmail}
                                                    onChange={handleChange}
                                                    helperText={errors.userEmail}
                                                    error={errors.userEmail && touched.userEmail}
                                                    fullWidth
                                                />
                                                <TextField
                                                    type="password"
                                                    name="password"
                                                    label="Password"
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    helperText={errors.password}
                                                    error={errors.password && touched.password}
                                                    fullWidth
                                                />
                                                <button
                                                    type="submit"
                                                   className="btn btn-rounded btn-primary w-100 my-1 mt-2"
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                >
                                                    {isSubmitting ? 'Signing In...' : 'Login'}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                    {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}

                                    <div className="mt-3 text-center">
                                        <Link to="/forgot-password" className="text-muted">
                                            Forgot Password?
                                        </Link>
                                      
                                    </div>
                                </div>
                            </Col>

                            <Col md={6} className="text-center auth-cover">
                                <div className="pe-3 auth-right">
                                    <div>
                                        <h6 style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                            <FaCheckCircle style={{ marginRight: '8px', color: 'green' }} />
                                            Manage Job Postings Seamlessly - Post, edit, and archive job openings effortlessly from a centralized platform.
                                        </h6>
                                        <h6 style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                            <FaCheckCircle style={{ marginRight: '8px', color: 'green' }} />
                                            Track Applications in Real-Time - Stay updated on the status of every application as it progresses.
                                        </h6>
                                        <h6 style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                            <FaCheckCircle style={{ marginRight: '8px', color: 'green' }} />
                                            Access Detailed Candidate Insights - View in-depth profiles and resumes to make informed hiring decisions.
                                        </h6>
                                        <h6 style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                            <FaCheckCircle style={{ marginRight: '8px', color: 'green' }} />
                                            Simplified Hiring Process - Streamline hiring workflows with automated tools and customizable templates.
                                        </h6>
                                        <h6 style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                            <FaCheckCircle style={{ marginRight: '8px', color: 'green' }} />
                                            Enhanced Candidate Screening - Utilize filters and assessments to shortlist the best candidates quickly.
                                        </h6>
                                    </div>
                                    <br></br>
                                    <Nav.Link as={Link} to="/hr-signup" className="nav-link-custom">
                                        <Button >Register For Free</Button>
                                    </Nav.Link>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default HrSignin
