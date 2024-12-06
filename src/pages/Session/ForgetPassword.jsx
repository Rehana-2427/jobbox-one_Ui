import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../apiClient';
import SocialButtons from './sessions/SocialButtons';

const ForgetPassword = () => {
    const [userEmail, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [otp, setOtp] = useState();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [stage, setStage] = useState('email');
    const [otpEnter, setOtpEnter] = useState();

    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);

    const handleEmailSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await api.otpGenerate(userEmail)
            if (response.data) {
                setOtp(response.data);
                setStage('otp');
            }

            else
                setErrorMessage("InvalidEmail")
        } catch (error) {
            console.log(error);
        }

    };
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        console.log(otp);
        console.log(otpEnter)
        if (otp == otpEnter)
            setStage('resetPassword');
        else
            setErrorMessage("Invalid otp");
    };


    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }
        try {
            const response = await api.updatePassword(userEmail,newPassword)
            if (response.data) {
                setSuccessMessage("Password reset successfully! Now You can login with your new password.");
            }
            else {
                setErrorMessage('');
                setPasswordMatchError(false);
                setPasswordCriteriaError(false);
            }
        }
        catch (error) {
            console.log(error);
        }
        // Handle the password reset logic here (e.g., send a request to the backend)


    };

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/;
        const isValidPassword = passwordRegex.test(newPassword) && newPassword === confirmPassword;

        if (!isValidPassword) {
            if (newPassword !== confirmPassword) {
                setPasswordMatchError(true);
            } else {
                setPasswordCriteriaError(true);
            }
            return false;
        }
        return true;
    };


    return (
        <div className="auth-layout-wrap">
            <div className="auth-content">
                <Card className="o-hidden">
                    <Row>
                        <Col md={6}>
                            <div className="p-4">

                                <h1 className="mb-3 text-18">Forget Password</h1>
                                <div className='forgetpassword-container'>
                                    {passwordMatchError && (
                                        <p className="error-message">Password and confirm password do not match</p>
                                    )}

                                    {passwordCriteriaError && (
                                        <p className="error-message">Password should include at least one number, one special character, one capital letter, one small letter, and have a length between 8 to 12 characters</p>
                                    )}
                                    {stage === 'email' && (
                                        <Form onSubmit={handleEmailSubmit}>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Label>Enter your email:</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={userEmail}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>

                                            <Button variant="primary" type="submit">
                                                Submit
                                            </Button>
                                        </Form>
                                    )}

                                    {stage === 'otp' && (
                                        <Form onSubmit={handleOtpSubmit}>
                                            <Form.Group className="mb-3" controlId="otp">
                                                <Form.Label>Enter OTP:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={otpEnter}
                                                    onChange={(e) => setOtpEnter(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>

                                            <Button variant="primary" type="submit">
                                                Submit
                                            </Button>

                                            {errorMessage && <div className="error-message mt-2">{errorMessage}</div>}
                                        </Form>
                                    )}

                                    {stage === 'resetPassword' && (
                                        <Form onSubmit={handlePasswordReset}>
                                            <Form.Group className="mb-3" controlId="newPassword">
                                                <Form.Label>New Password:</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="confirmPassword">
                                                <Form.Label>Confirm Password:</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>

                                            <Button variant="primary" type="submit">
                                                Reset Password
                                            </Button>

                                            {successMessage && (
                                                <div className="success-message mt-2">
                                                    {successMessage} <Link to='/signup/candiSignup/registration-success-msg/user-signin'>Login</Link>
                                                </div>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col md={6} className="text-center auth-cover">
                            <div className="pe-3 auth-right">
                                <div className="auth-logo text-center mb-4">
                                    <img src="/jb_logo.png" alt="JobDB" style={{ height: '100px', width: '250px' }} />
                                </div>

                                <SocialButtons
                                    routeUrl="/signup"
                                    googleHandler={() => alert("google")}
                                    facebookHandler={() => alert("facebook")}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    )
}

export default ForgetPassword
