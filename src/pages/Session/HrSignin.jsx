import axios from 'axios';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Card, Col, Nav, Row } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
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
            const response = await axios.get(`${BASE_API_URL}/login?userEmail=${values.userEmail}&password=${values.password}`);
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
            <div className="auth-layout-wrap" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                <div className="auth-content candidate-login" style={{ position: 'relative', padding: '20px' }}>
                    <Card className="o-hidden user_regi_signin">
                        <Row>
                            <Col md={6}>
                                <div className="p-4">
                                    <h1 className="mb-3 text-20"><b>Employee Login</b></h1>
                                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                            <form onSubmit={handleSubmit} className="w-100">
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
                                                    className="btn btn-rounded btn-primary my-1 mt-2"
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                >
                                                    {isSubmitting ? 'Signing In...' : 'Login'}
                                                </button>
                                            </form>
                                        )}
                                    </Formik>
                                    {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                                    <div className="mt-3 text-center">
                                        <Link to="/forgetpassword" className="text-muted" style={{ color: 'red' }}>
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div>
                                        <hr />
                                        <Nav.Link as={Link} to="/hr-signup" className="nav-link-custom">
                                            <Button variant='secondary'>Register For Free</Button>
                                        </Nav.Link>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="text-center auth-cover">
                                <div className="pe-3 auth-right" style={{ height: '380px' }}>
                                    <div className="auth-logo text-center mb-4">
                                        <img src="/jb_logo.png" alt="JobDB" className="user-signin-column2" style={{ height: '50px', width: '120px' }} />
                                    </div>
                                    <div className='info-wrapper'>
                                        <h3 className="mt-3">Welcome Back!</h3>
                                        <div className='info-list'>
                                            <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Manage Job Postings Seamlessly</h6>
                                            <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Track Applications in Real-Time</h6>
                                            <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Access Detailed Candidate Insights</h6>
                                            <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Simplified Hiring Process</h6>
                                            <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Enhanced Candidate Screening</h6>
                                        </div>
                                    </div>

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
