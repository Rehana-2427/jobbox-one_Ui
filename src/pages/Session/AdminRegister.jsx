import { Formik } from 'formik';
import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';

const AdminRegister = () => {
    const navigate = useNavigate();

    // Define the correct admin email and password
    const adminCredentials = {
        email: 'jobbox2024@gmail.com', // Replace this with your admin email
        password: 'JB@Admin2024'   // Replace this with your admin password
    };

    const validationSchema = yup.object().shape({
        userEmail: yup.string().email("Invalid email").required("Email is required"),
        password: yup.string().min(8, "Password must be 8 characters long").required("Password is required")
    });
    
    const [errorMessage, setErrorMessage] = useState('');
    const initialValues = { userEmail: "", password: "" };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Check if entered credentials match admin credentials
            if (values.userEmail === adminCredentials.email && values.password === adminCredentials.password) {
                // If credentials match, navigate to admin dashboard
                navigate("/admin-dashboard");
            } else {
                // Optionally, you can verify credentials through API (if backend has specific endpoint)
                // const response = await axios.get(`${BASE_API_URL}/login?userEmail=${values.userEmail}&password=${values.password}`);
                // const user = response.data;

                // If the credentials do not match, display an error
                setErrorMessage("Invalid email or password. Please try again.");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred during login. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-layout-wrap">
            <div className="auth-content">
                <Card className="o-hidden">
                    <Row>
                        <Col md={6}>
                            <div className="p-4">
                                <h1 className="mb-3 text-18">Admin Login</h1>
                                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                        <form onSubmit={handleSubmit}>
                                            <TextField 
                                                type="email" 
                                                name="userEmail" 
                                                label="Email address" 
                                                onBlur={handleBlur}
                                                value={values.userEmail} 
                                                onChange={handleChange} 
                                                helperText={errors.userEmail}
                                                error={errors.userEmail && touched.userEmail} 
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
                                            />

                                            <button 
                                                type="submit" 
                                                className="btn btn-rounded btn-primary w-100 my-1 mt-2" 
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                                            </button>
                                        </form>
                                    )}
                                </Formik>
                                {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                                <div className="mt-3 text-center">
                                    <Link to="/forgetpassword" className="text-muted">Forgot Password?</Link>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} className="text-center auth-cover">
                            <div className="pe-3 auth-right">
                                <div className="auth-logo text-center mb-4">
                                    <img src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png" alt="JobBox" />
                                </div>
                                <SocialButtons routeUrl="/signup" googleHandler={() => alert("google")} facebookHandler={() => alert("facebook")} />
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default AdminRegister;
