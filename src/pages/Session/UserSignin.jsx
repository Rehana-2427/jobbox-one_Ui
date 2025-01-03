import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import api from '../../apiClient';
import { auth } from '../../firebase/firebaseConfig';
import CustomNavbar from '../CustomNavbar';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';
const UserSignin = () => {
    const navigate = useNavigate();
    const validationSchema = yup.object().shape({
        userEmail: yup.string().email("Invalid email").required("Email is required"),
        password: yup.string().min(8, "Password must be 8 characters long").required("Password is required")
    });
    const [errorMessage, setErrorMessage] = useState('');
    const initialValues = { userEmail: "", password: "" };
    const location = useLocation();
    const companyId = location.state?.companyId;
    console.log(companyId)
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await api.userLogin(values.userEmail, values.password);
            const user = response.data.user;
            const token = response.data.token;
            // Save user and token in localStorage (or in a global state like context)
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            if (user) {
                if (user.userRole === 'Candidate') {
                    // Check for redirectAfterLogin preference
                    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
                    if (redirectAfterLogin === 'dream-job') {
                        navigate('/candidate-dashboard/dream-job', { state: { userId: user.userId, userName: user.userName } });
                    }
                    else if (redirectAfterLogin === 'dream-company') {
                        navigate('/candidate-dashboard/companyPage', { state: { userId: user.userId, userName: user.userName, companyId: companyId } });
                    }
                    else {
                        navigate('/candidate-dashboard', { state: { userId: user.userId,userName: user.userName, } });
                    }
                    // Clear the redirect target once used
                    localStorage.removeItem('redirectAfterLogin');
                } else {
                    setErrorMessage("Invalid login credentials or role. Please try again.");
                }
            } else {
                setErrorMessage("Invalid email or password.");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred during login. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };
    // Google Sign-In Handler
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        // Force account selection prompt
        provider.setCustomParameters({
            prompt: "select_account" // Forces the account selection screen
        });
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userEmail = user.email;
            const response = await api.checkUser(userEmail)
            const existingUser = response.data;
            // Log existingUser to check if it's undefined
            console.log("Existing User:", existingUser);
            // Save user and token in localStorage (or in a global state like context)
            localStorage.setItem('user', JSON.stringify(existingUser));
            if (existingUser) {
                const userId = existingUser.userId;
                console.log("Existing User ID:", userId);
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome Back!',
                    text: 'You are already registered. click here to go your dashboard.',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/candidate-dashboard', { state: { userRole: 'Candidate', userId: userId,userName: user.userName, } });
                    }
                });
            }
            else {
                // User does not exist, create a new user
                const randomPassword = Math.random().toString(36).slice(-8);
                const newUser = {
                    userName: user.displayName,// Ensure userName is set
                    userEmail: userEmail,
                    password: randomPassword,
                    userRole: 'Candidate',
                    appliedDate: getFormattedDate(),
                };
                // Save new user to the backend
                const saveResponse = await api.saveUser(newUser);
                // Log the entire save response to see what is returned from the backend
                console.log("Response from saveUser:", saveResponse.data);
                // Check if the user is successfully created
                if (saveResponse.data) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful!',
                        text: 'Your registration has been successful. Welcome! Click here to set password.',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/forgetpassword', { state: { userRole: 'Candidate' } });
                        }
                    });
                }
            }
        } catch (error) {
            // Log detailed error information
            console.error("Google Sign-In error:", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error("Error Response:", error.response.data);
                console.error("Error Status:", error.response.status);
                console.error("Error Headers:", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error Request:", error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error Message:", error.message);
            }
            setErrorMessage("Error signing in with Google.");
        }
    };
    function getFormattedDate() {
        const appliedOn = new Date(); // Get current date and time
        const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
        const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
        const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
        return `${year}-${month}-${day}`;
    }
    // Facebook Sign-In Handler
    // const signInWithFacebook = async () => {
    //     const provider = new FacebookAuthProvider();
    //     try {
    //         const result = await signInWithPopup(auth, provider);
    //         const user = result.user;
    //         // You can store user info in localStorage or handle it as needed
    //         localStorage.setItem('user', JSON.stringify(user));
    //         console.log("User signed in with Facebook: ", user);
    //         // Navigate or perform other actions as needed
    //     } catch (error) {
    //         console.error("Error signing in with Facebook: ", error);
    //         setErrorMessage("Error signing in with Facebook.");
    //     }
    // };
    const signInWithFacebook = async () => {
        const provider = new FacebookAuthProvider();
        try {
            // Show Facebook login popup
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userEmail = user.email;
            // Check if the user already exists in the backend
            const response = await api.checkUser(userEmail)
            const existingUser = response.data;
            if (existingUser) {
                const userId = existingUser.userId;
                console.log("Existing User ID:", userId);
                // Show SweetAlert for existing user
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome Back!',
                    text: 'You are already registered. click here to go your dashboard.',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/candidate-dashboard', { state: { userRole: 'Candidate', userId: userId,userName: user.userName, } });
                    }
                });
            } else {
                // User does not exist, create a new user
                const randomPassword = Math.random().toString(36).slice(-8);
                const newUser = {
                    userName: user.displayName,  // Use Facebook user display name
                    userEmail: userEmail,
                    password: randomPassword,
                    userRole: 'Candidate',
                    appliedDate: getFormattedDate(),
                };
                // Save new user to the backend
                const saveResponse = await api.saveUser(newUser);
                // Log the entire save response to see what is returned from the backend
                console.log("Response from saveUser:", saveResponse.data);
                // Check if the user is successfully created
                if (saveResponse.data) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful!',
                        text: 'Your registration has been successful. Welcome! Click here to set password.',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/forgetpassword', { state: { userRole: 'Candidate' } });
                        }
                    });
                }
            }
        } catch (error) {
            // Log detailed error information
            console.error("Facebook Sign-In error:", error);
            console.error("Detailed Error Info:", error.response ? error.response.data : error.message);
            setErrorMessage("Error signing in with Facebook. Please try again.");
        }
    };
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // const navLinkStyle = screenWidth > 990 ? { marginRight: '40px', marginLeft: '150px' } : {};
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
                                    <h1 className="mb-3 text-18">Candidate Login</h1>
                                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                            <Form onSubmit={handleSubmit}>
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
                                                    {isSubmitting ? 'Signing In...' : 'Login'}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                    {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                                    <div className="mt-3 text-center">
                                        <Link to="/forget-password" className="text-muted">
                                            Forgot Password?
                                        </Link>
                                    </div>
{/*                                     
                                    <div>
                                        <hr />
                                        <Nav.Link as={Link} to="/candidate-signup" className="nav-link-custom">
                                            <Button variant='secondary'>Register For Free</Button>
                                        </Nav.Link>
                                    </div> */}
                                </div>
                            </Col>
                            <Col md={6} className="text-center auth-cover">
                                <div className="pe-3 auth-right">
                                    <SocialButtons
                                        isLogin={false}
                                        routeUrl="/candidate-signup"
                                        googleHandler={signInWithGoogle}
                                        facebookHandler={signInWithFacebook}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default UserSignin;





















