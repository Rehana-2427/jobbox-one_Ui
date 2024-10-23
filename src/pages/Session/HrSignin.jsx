import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Card, Col, Nav } from 'react-bootstrap';
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

    const isSmallScreen = useMediaQuery('(max-width:600px)'); // Check for small screen
    const isMediumScreen = useMediaQuery('(max-width:960px)'); // Check for medium screen
    return (
        <div>
            <CustomNavbar />
            <div className="login-layout">
                <div className="login-content user_regi_signin">
                    <Card className="hr-form-card o-hidden">
                        <Col md={10} className="p-4 d-flex flex-column align-items-center justify-content-center">
                            <h1 className="mb-4 text-center text-primary"><b>Employee Login</b></h1>
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
                                        <Button
                                            type="submit"
                                            className="btn btn-rounded btn-primary my-1 mt-2"
                                            disabled={isSubmitting}
                                            fullWidth
                                        >
                                            {isSubmitting ? 'Signing In...' : 'Login'}
                                        </Button>
                                    </form>
                                )}
                            </Formik>
                            {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                            <div className="mt-3 text-center">
                                <Link to="/forgetpassword" className="text-muted">Forgot Password?</Link>
                            </div>
                            <div>
                                <hr />
                                <Nav.Link as={Link} to="/hr-signup" className="nav-link-custom">
                                    <Button variant='secondary' style={{ width: '140px' }}>Register For Free</Button>
                                </Nav.Link>
                            </div>
                        </Col>
                    </Card>

                </div>
            </div>
        </div>
    )
}

export default HrSignin
