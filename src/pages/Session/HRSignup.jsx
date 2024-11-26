
import axios from 'axios'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap'
import { FaCheckCircle } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import * as yup from 'yup'
import CustomNavbar from '../CustomNavbar'
import TextField from './sessions/TextField'
import './StyleSession/signup.css'
const HRSignup = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate()
    const initialFormValues = {
        userName: '',
        userEmail: '',
        appliedDate: getFormattedDate(),
        password: '',
        confirmPassword: '',
        agreeToTermsAndCondition: false,
        companyName: '',
        companyWebsite: '',
        userRole: 'HR'
    };
    const [formValues, setFormValues] = useState(initialFormValues);
    const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [protocol, setProtocol] = useState('http');
    const [tld, setTld] = useState('.com');
    const [domain, setDomain] = useState('');
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [disableFormFields, setDisableFormFields] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [enterOtpValue, setEnterOtpValue] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [agreeToTermsAndConditionByCheck, setAgreeToTermsAndConditionByCheck] = useState(false);
    // Function to get formatted date
    function getFormattedDate() {
        const appliedOn = new Date(); // Get current date and time
        const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
        const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
        const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
        return `${year}-${month}-${day}`;
    }
    useEffect(() => {
        localStorage.setItem('HrRegistrationForm', JSON.stringify(formValues));
    }, [formValues]);

    useEffect(() => {
        const storedFormValues = JSON.parse(localStorage.getItem('HrRegistrationForm')) || initialFormValues;
        if (Object.keys(formValues).length === 0 && formValues.constructor === Object) {
            setFormValues(storedFormValues);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('HrRegistrationForm', JSON.stringify(formValues));
    }, [formValues]);

    useEffect(() => {
        // Clear localStorage when the component unmounts
        return () => {
            localStorage.removeItem('HrRegistrationForm');
        };
    }, []);

    const location = useLocation();
    const companyName = location.state?.companyName;
    const companyWebsite = location.state?.companyWebsite;
    console.log(companyName, companyWebsite)
    // Validation schema using Yup
    const validationSchema = yup.object().shape({
        userName: yup.string().required('Name is required'),
        userEmail: yup.string().email('Invalid email').required('Email is required'),
        //  companyName: yup.string().required('Company Name is required'),
        // companyName: yup.string().when('$isCompanyPage', {
        //     is: false, // When navigating from a company page
        //     then: yup.string().required('Company Name is required'),
        //     otherwise: yup.string(),
        // }),
        password: yup
            .string()
            .required('Password is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/,
                'Invalid password match...'
            ),
        confirmPassword: yup.string().required('Repeat Password is required').oneOf([yup.ref('password')], 'Passwords must match'),
        agreeToTermsAndCondition: yup.bool().oneOf([true], 'You must agree to validate your email'),
    });

    // Function to validate password criteria
    const validatePassword = (values) => {
        const { password, confirmPassword } = values;
        const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/.test(password);
        const passwordsMatch = password === confirmPassword;

        if (!isValidPassword) {
            setPasswordCriteriaError(true);
            return false;
        }

        if (!passwordsMatch) {
            setPasswordMatchError(true);
            return false;
        }

        return true;
    };

    // Function to handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        debugger
        setSubmitting(true);

        console.log("Form values before submission:", values);

        if (!validatePassword(values)) {
            console.log("Password validation failed");
            setSubmitting(false);
            return;
        }

        values.companyName = companyName;
        values.companyWebsite = companyWebsite;

        if (domain) {
            values.companyWebsite = `${protocol}://www.${domain}${tld}`;
            console.log("Company Website:", values.companyWebsite);
        }

        const userData = {
            ...values,
            userRole: 'HR',
        };
        console.log("User data to be sent:", userData);

        try {
            const response = await axios.post(`${BASE_API_URL}/saveUser`, userData);
            console.log("Response from API:", response.data);

            if (!response.data || response.data === 'undefined' || response.data === '') {
                setEmailExistsError(true);
                console.log("Email exists error");
                setSubmitting(false);
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Your registration has been successful.',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });
        } catch (error) {
            console.error('Error registering User:', error);
            setErrorMessage('Error registering User. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };


    // Function to handle OTP verification
    const handleOTPVerification = () => {
        if (otpValue == enterOtpValue) {
            setOtpVerified(true);
            setShowOTPModal(false);
            // Proceed to submit form data after OTP verification
            setSuccessMessage('OTP verified successfully!');
        } else {
            setOtpVerified(false);
            setErrorMessage('Invalid OTP. Please try again.');
        }
    };


    // Function to send OTP
    const sendOTP = async (email) => {
        if (!email || email === 'undefined' || email === '') {
            // alert("Please enter an email first.");
            toast.error("Please enter an email first."); // Display error message --->   npm install react-toastify

            setDisableFormFields(false);
            return; // Exit the function early
        } else {
            let loadingPopup;

            try {
                // Show loading message using SweetAlert
                loadingPopup = Swal.fire({
                    title: 'Verifing your email...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                const response = await axios.get(`${BASE_API_URL}/validateUserEmail?userEmail=${email}`);
                setOtpValue(response.data);
                setShowOTPModal(true);
                if (response.data) {
                    Swal.close();
                    toast.success("OTP sent successfully!");
                }
            } catch (error) {
                console.error('Error sending OTP:', error);
                if (loadingPopup) {
                    Swal.close();
                }
                setErrorMessage('Error sending OTP. Please try again later.');
            }
        }
    };
    // Function to update user data (in case of email already exists)
    const updateUserData = async (values) => {
        try {
            const response = await axios.put(`${BASE_API_URL}/updateUserData`, values);

            if (response.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Update Successful!',
                    text: 'Your data has been updated successful.',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/signin');
                    }
                });
            } else {
                setErrorMessage(true);
                return;
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Data not updated');
        }
    };

    // Function to show the password criteria error
    const showErrorToast = () => {
        toast.error(
            <div className="alert alert-info" style={{ maxWidth: '400px', margin: '20px auto', borderRadius: '5px' }}>
                <h5>Password Guidelines</h5>
                <ul className="list-unstyled">
                    <li>• At least one number</li>
                    <li>• One special character</li>
                    <li>• One uppercase letter</li>
                    <li>• One lowercase letter</li>
                    <li>• Between 8 to 12 characters</li>
                </ul>
            </div>
        );
    };


    // Effect to show the toast when the error is true
    React.useEffect(() => {
        if (passwordCriteriaError) {
            showErrorToast();
        }
    }, [passwordCriteriaError]);


    return (
        <div>
            <CustomNavbar />
            <Container component="main" maxWidth="xs" style={{ marginTop: '150px' }} className='employee-register-form'>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontFamily: '"Roboto", sans-serif', color: '#333', fontWeight: '500', marginBottom: '0px', padding: '0px' }}>
                        Employee Registration Form
                    </h3>
                </div>
                <div className="hr-form" style={{ maxHeight: '90vh', marginTop: '0' }}>
                    <Formik
                        initialValues={formValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                            <Form className="form">
                                <Card className="hr-form-card o-hidden" style={{ width: '100%', transition: 'width 0.3s ease' }} >
                                    <Row >
                                        {/* Left Section */}
                                        <Col md={6} className="text-center auth-cover">
                                            <div className="ps-3 auth-right">
                                                <div className="w-100 h-100 justify-content-center d-flex flex-column">
                                                    <h3>Why Join <strong style={{ color: 'purple' }}>Job</strong><strong style={{ color: 'gray' }}>Box.one</strong> as an HR?</h3>
                                                    <div className='info-list'>
                                                        <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Access to Top Talent</h6>
                                                        <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Streamlined Hiring Process</h6>
                                                        <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Advanced Candidate Filtering</h6>
                                                        <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Customizable Job Postings</h6>
                                                        <h6><FaCheckCircle style={{ marginRight: '8px', color: 'green' }} /> Detailed Analytics and Reports</h6>
                                                        <br></br>
                                                        <p>Already have an account? Login</p>
                                                        <Button onClick={() => navigate("/hr-sign-in")} style={{ width: '100px', justifyItems: 'center', alignItems: 'center' }}>Login</Button>
                                                    </div>
                                                </div>
                                            </div>
                                    
                                        </Col>
                                        <Col md={6}>
                                            {/* Name Field */}
                                            <TextField
                                                type="text"
                                                name="userName"
                                                label="Your name"
                                                required
                                                placeholder="Enter your name"
                                                value={values.userName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={errors.userName}
                                                error={errors.userName && touched.userName}
                                                disabled={disableFormFields}
                                                fullWidth
                                                variant="outlined"
                                                margin="normal"
                                                style={{ marginBottom: '15px' }}
                                            />

                                            {/* Email Field */}
                                            <TextField
                                                type="email"
                                                name="userEmail"
                                                label="Your Official Company Email"
                                                required
                                                placeholder="Enter your email"
                                                value={values.userEmail}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={errors.userEmail}
                                                error={touched.userEmail && Boolean(errors.userEmail)}
                                                disabled={disableFormFields || emailExistsError}
                                                fullWidth
                                                variant="outlined"
                                                margin="normal"
                                                style={{ marginBottom: '15px' }}
                                            />

                                            {/* Company Name and Website */}
                                            {!companyName && (
                                                <>
                                                    <TextField
                                                        type="text"
                                                        name="companyName"
                                                        label="Company name"
                                                        required
                                                        placeholder="Enter your company name"
                                                        value={companyName || values.companyName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        helperText={errors.companyName}
                                                        error={errors.companyName && touched.companyName}
                                                        disabled={disableFormFields}
                                                        fullWidth
                                                        variant="outlined"
                                                        margin="normal"
                                                        style={{ marginBottom: '15px' }}
                                                    />

                                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', marginBottom: '5px' }}>
                                                        <label>{<><span>Company Website</span> <span className="required" style={{ color: 'red' }}>*</span></>}</label>
                                                        <div className="protocol-tld-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                                            <div className="select-group" style={{ marginRight: '10px' }}>
                                                                <select
                                                                    id="protocol"
                                                                    value={protocol}
                                                                    onChange={(event) => {
                                                                        const newProtocol = event.target.value;
                                                                        setProtocol(newProtocol);
                                                                    }}
                                                                    onBlur={handleBlur}
                                                                    disabled={disableFormFields}
                                                                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                                >
                                                                    <option value="http">http://www.</option>
                                                                    <option value="https">https://www.</option>
                                                                </select>
                                                            </div>
                                                            <TextField
                                                                type="text"
                                                                name="companyWebsite"
                                                                placeholder="domain"
                                                                style={{ marginRight: '10px', flex: '1' }}
                                                                disabled={disableFormFields}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setDomain(value);
                                                                }}
                                                            />
                                                            <div className="select-group" style={{ marginRight: '10px' }}>
                                                                <select
                                                                    id="tld"
                                                                    value={tld}
                                                                    onChange={(event) => {
                                                                        const newTld = event.target.value;
                                                                        setTld(newTld);
                                                                    }}
                                                                    onBlur={handleBlur}
                                                                    disabled={disableFormFields}
                                                                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                                >
                                                                    <option value=".com">.com</option>
                                                                    <option value=".org">.org</option>
                                                                    <option value=".net">.net</option>
                                                                    <option value=".info">.info</option>
                                                                    <option value=".in">.in</option>
                                                                </select>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Password and Confirm Password */}
                                            <TextField
                                                type="password"
                                                name="password"
                                                label="Password"
                                                required
                                                placeholder="Enter your password"
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={errors.password}
                                                error={errors.password && touched.password}
                                                fullWidth
                                                variant="outlined"
                                                margin="normal"
                                                disabled={disableFormFields}
                                                style={{ marginBottom: '15px' }}
                                            />

                                            <TextField
                                                type="password"
                                                name="confirmPassword"
                                                label="Confirm Password"
                                                required
                                                placeholder="Re-enter your password"
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={errors.confirmPassword}
                                                error={errors.confirmPassword && touched.confirmPassword}
                                                fullWidth
                                                variant="outlined"
                                                margin="normal"
                                                disabled={disableFormFields}
                                                style={{ marginBottom: '15px' }}
                                            />

                                            {/* Password Mismatch Error */}
                                            {passwordMatchError && (
                                                <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                    Passwords did not match, please try again...
                                                </p>
                                            )}

                                            {/* OTP Button */}
                                            {!otpVerified && (
                                                <div className="d-flex justify-content-center" style={{ marginBottom: '20px' }}>
                                                    <Button
                                                        disabled={disableFormFields || otpVerified}
                                                        className="mt-2"
                                                        onClick={() => {
                                                            setDisableFormFields(true);
                                                            sendOTP(values.userEmail);
                                                        }}
                                                        variant="primary"
                                                        fullWidth
                                                    // style={{ padding: '12px', borderRadius: '30px', backgroundColor:'p' }}
                                                    // color="primary"

                                                    >
                                                        Validate my email
                                                    </Button>

                                                </div>
                                            )}

                                            {successMessage && <p className="success-message">{successMessage}</p>}

                                            {/* Terms and Conditions */}
                                            <div className="d-flex justify-content-start align-items-center" style={{ marginBottom: '15px' }}>
                                                <Field
                                                    type="checkbox"
                                                    name="agreeToTermsAndCondition"
                                                    id="agreeToTermsAndCondition"
                                                    checked={values.agreeToTermsAndCondition}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setAgreeToTermsAndConditionByCheck(true);
                                                    }}
                                                    style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                                                />
                                                <label>
                                                    I agree to the{' '}
                                                    <Link to="/terms-and-conditions" target="_blank" style={{ textDecoration: 'underline' }}>
                                                        Terms and Conditions
                                                    </Link>
                                                </label>
                                                {touched.agreeToTermsAndCondition && errors.agreeToTermsAndCondition && (
                                                    <div className="invalid-feedback" style={{ color: 'red' }}>
                                                        {errors.agreeToTermsAndCondition}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Email Exists Error */}
                                            {emailExistsError && (
                                                <div style={{ marginBottom: '20px' }}>
                                                    <p className="error-message">
                                                        Email already exists. Please{' '}
                                                        <Link to="/signin" style={{ color: '#007bff' }}>
                                                            click here for login
                                                        </Link>
                                                    </p>
                                                    <p>OR</p>
                                                    <Button onClick={() => updateUserData(values)} variant="outlined" color="secondary">
                                                        Update Your Data
                                                    </Button>
                                                </div>
                                            )}

                                            {errorMessage && <div className="text-danger" style={{ marginBottom: '20px' }}>{errorMessage}</div>}

                                            {/* Submit Button */}
                                            <div className="d-flex justify-content-center">
                                                <Button
                                                    type="submit"
                                                    className="btn btn-primary w-50 my-1 btn-rounded mt-3"
                                                    disabled={
                                                        !otpVerified ||
                                                        isSubmitting ||
                                                        emailExistsError ||
                                                        agreeToTermsAndConditionByCheck === false
                                                    }
                                                >
                                                    {isSubmitting ? 'Registering...' : 'Register'}
                                                </Button>
                                            </div>
                                        </Col>

                                    </Row>
                                </Card>
                            </Form>
                        )}
                    </Formik>
                    {/* </div> */}
                </div>

                {/* OTP Modal */}
                <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>OTP Verification</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>An OTP has been sent to your email. Please enter it below:</p>
                        <TextField
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={enterOtpValue}
                            onChange={(e) => setEnterOtpValue(e.target.value)}
                            fullWidth
                            variant="outlined"
                            style={{ marginBottom: '20px' }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowOTPModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleOTPVerification}>
                            Verify OTP
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Toast */}
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            </Container >
        </div >
    )
}

export default HRSignup
