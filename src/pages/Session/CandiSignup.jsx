import {
  Box,
  useMediaQuery
} from '@mui/material';
import axios from 'axios';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { auth } from '../../firebase/firebaseConfig';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';


const CandiSignup = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate()
  const initialFormValues = {
    userName: '',
    userEmail: '',
    appliedDate: getFormattedDate(),
    password: '',
    confirmPassword: '',
    agreeToTermsAndCondition: false,
    userRole: 'Candidate', // Setting userRole as 'candidate'
  };


  const [formValues, setFormValues] = useState(initialFormValues);
  const [disableFormFields, setDisableFormFields] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [enterOtpValue, setEnterOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailExistsError, setEmailExistsError] = useState(false);
  const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [agreeToTermsAndConditionByCheck, setAgreeToTermsAndConditionByCheck] = useState(false);

  function getFormattedDate() {
    const appliedOn = new Date(); // Get current date and time
    const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
    const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
    const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    const storedFormValues = JSON.parse(localStorage.getItem('candidateRegistrationForm')) || formValues;
    setFormValues(storedFormValues);
  }, []);

  useEffect(() => {
    localStorage.setItem('candidateRegistrationForm', JSON.stringify(formValues));
  }, [formValues]);

  useEffect(() => {
    const storedFormValues = JSON.parse(localStorage.getItem('candidateRegistrationForm')) || initialFormValues;
    if (Object.keys(formValues).length === 0 && formValues.constructor === Object) {
      setFormValues(storedFormValues);
    }
  }, []);
  useEffect(() => {
    // Clear localStorage when the component unmounts
    return () => {
      localStorage.removeItem('candidateRegistrationForm');
    };
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    // Validate password criteria
    if (!validatePassword(values)) {
      setSubmitting(false);
      return;
    }

    // Ensure userRole is included in the form values
    const userData = {
      ...values,
      userRole: 'Candidate', // Ensure userRole is set to 'candidate'
    };

    try {
      const response = await axios.post(`${BASE_API_URL}/saveUser`, userData);

      if (!response.data || response.data === 'undefined' || response.data === '') {
        setEmailExistsError(true);
        setSubmitting(false);
        return;
      } else {
        // Show SweetAlert for registration success
        let additionalText = '';

        additionalText = 'Welcome!' + '\n' + 'Click here for login';
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your registration has been successful.' + (additionalText ? '\n' + additionalText : ''),
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/signin', { state: { userRole: 'Candidate' } });
          }

        });
      }
    } catch (error) {
      console.error('Error registering User:', error);
      setErrorMessage('Error registering User. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

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

  // Validation schema using Yup
  const validationSchema = yup.object().shape({
    userName: yup.string().required('Name is required'),
    userEmail: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
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
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Check for small screen
  const isMediumScreen = useMediaQuery('(max-width:960px)'); // Check for medium screen


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

      // Now proceed with the API call using the correct userEmail
      const response = await axios.get(`${BASE_API_URL}/checkUser?userEmail=${userEmail}`);
      const existingUser = response.data;
      if (existingUser) {
        const userId = existingUser.userId;
        console.log("Existing User ID:", userId);
        // Show SweetAlert for existing user
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'You are already registered. Click here to login.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/candidate-dashboard', { state: { userRole: 'Candidate', userId: userId } });
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
        const saveResponse = await axios.post(`${BASE_API_URL}/saveUser`, newUser);

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
              navigate('/candidate-dashboard', { state: { userRole: 'Candidate', userId: saveResponse.data.userId } });
            }
          });
        }
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      console.error("Detailed Error Info:", error.response ? error.response.data : error.message);
      setErrorMessage("Error signing in with Google. Please try again.");
    }
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();

    try {
      // Show Facebook login popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userEmail = user.email;

      // Check if the user already exists in the backend
      const response = await axios.get(`${BASE_API_URL}/checkUser?userEmail=${userEmail}`);
      const existingUser = response.data;

      if (existingUser) {
        const userId = existingUser.userId;
        console.log("Existing User ID:", userId);

        // Show SweetAlert for existing user
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'You are already registered. Click here to go dashboard.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/candidate-dashboard', { state: { userRole: 'Candidate', userId: userId } });
          }
        });
      }
      else {
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
        const saveResponse = await axios.post(`${BASE_API_URL}/saveUser`, newUser);

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

  return (
    <Container component="main" maxWidth="xs" className="hr-form-container">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: 2,
          position: 'fixed',
          left: '20px'
        }}
      >
        {/* <img src="/jb_logo.png" alt="JobDB" /> */}
      </Box>
      <Box>
        <h2>Candidate Registration form</h2>
      </Box>
      <div className='hr-form'>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            position: 'relative',
            right: '70px',
            marginTop: '20px' // Adjust the value as needed
          }}

        >

          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize

          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className='form' >
                {/* <Card className="form-card o-hidden" style={{ width: '120%' }}> */}
                <Card className="hr-form-card o-hidden" style={{
                  width: isSmallScreen ? '80%' : isMediumScreen ? '90%' : '150%', // Default for large screens
                  transition: 'width 0.3s ease', position: 'relative', bottom: '40px', right: '70px'
                }}
                >
                  <Row>
                    {/* Left Section */}
                    <Col md={6} className="text-center auth-cover" style={{ marginTop: '15px' }}>
                      <div className="ps-3 auth-right" >
                        <div className="w-100 h-100 justify-content-center d-flex flex-column">
                          <p>Already have an account?Login</p>
                          <SocialButtons
                            isLogin={true} 
                            routeUrl="/signin"
                            googleHandler={signInWithGoogle}
                            facebookHandler={signInWithFacebook}
                          // facebookHandler={() => alert("facebook")}
                          />
                        </div>
                      </div>
                    </Col>
                    {/* Right section */}
                    <Col md={6} >
                      <TextField
                        type="text"
                        name="userName"
                        label={
                          <>
                            Your name <span style={{ color: 'red' }}>*</span>
                          </>
                        }
                        required
                        placeholder="Enter your name"
                        value={values.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.userName}
                        error={errors.userName && touched.userName}
                        errorMessage={touched.userName && errors.userName}
                        disabled={disableFormFields}
                      />

                      <TextField
                        type="email"
                        name="userEmail"
                        label={
                          <>
                            Your Email <span style={{ color: 'red' }}>*</span>
                          </>
                        }
                        required
                        placeholder="Enter your email"
                        value={values.userEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.userEmail}
                        error={errors.userEmail && touched.userEmail}
                        errorMessage={touched.userEmail && errors.userEmail}
                        disabled={disableFormFields || emailExistsError}
                      />
                      <TextField
                        type="text"
                        name="phone"
                        label="Phone Number"
                        required
                        placeholder="Enter your phone number"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.phone}
                        error={errors.phone && touched.phone}
                        fullWidth
                        errorMessage={touched.phone && errors.phone}
                        disabled={disableFormFields}
                      />
                      <TextField
                        type="password"
                        name="password"
                        label={
                          <>
                            Password <span style={{ color: 'red' }}>*</span>
                          </>
                        }
                        required
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={(e) => {
                          handleBlur(e);
                          if (errors.password) {
                            setPasswordCriteriaError(true); // Show toast if there's an error
                          }
                        }}
                        helperText={errors.password}
                        error={errors.password && touched.password}
                        fullWidth
                        errorMessage={touched.password && errors.password}
                        disabled={disableFormFields}
                      />
                      {/* {passwordCriteriaError && (
                        <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                          <p>Password should include at least one number,</p>
                          <p>one special character, one uppercase letter,</p>
                          <p>one lowercase letter, and be between 8 to 12 characters.</p>
                        </div>
                      )} */}

                      <TextField
                        type="password"
                        name="confirmPassword"
                        label={
                          <>
                            Confirm Password <span style={{ color: 'red' }}>*</span>
                          </>
                        }
                        required
                        placeholder="Re-enter your password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.confirmPassword}
                        error={errors.confirmPassword && touched.confirmPassword}
                        fullWidth
                        errorMessage={touched.confirmPassword && errors.confirmPassword}
                        disabled={disableFormFields}
                      />
                      {passwordMatchError && (
                        <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                          Password did not match, plese try again...
                        </p>
                      )}


                      {!otpVerified && (
                        <div className="d-flex justify-content-center">
                          <Button
                            disabled={disableFormFields || otpVerified}
                            className="mt-2"
                            onClick={() => {
                              setDisableFormFields(true);
                              sendOTP(values.userEmail);
                            }}
                          >
                            Validate my email
                          </Button>
                        </div>
                      )}
                      <br></br>
                      {successMessage && <p className="success-message">{successMessage}</p>}
                      <br></br>
                      <div>
                        <Field
                          type="checkbox"
                          name="agreeToTermsAndCondition"
                          id="agreeToTermsAndCondition"
                          checked={values.agreeToTermsAndCondition}
                          onChange={(e) => {
                            handleChange(e);
                            setAgreeToTermsAndConditionByCheck(true);
                          }}
                          style={{ marginRight: '10px', transform: 'scale(1)', borderColor: 'black' }}
                        />
                        <label>
                          I agree to the{' '}
                          <Link to="/terms-and-conditions" target="_blank">
                            Terms and Conditions
                          </Link>{' '}
                          of the website
                        </label>
                        {touched.agreeToTermsAndCondition && errors.agreeToTermsAndCondition && (
                          <div className="invalid-feedback">{errors.agreeToTermsAndCondition}</div>
                        )}
                      </div>
                      {emailExistsError && (
                        <div>
                          <p className="error-message">
                            Email already exists. Please{' '}
                            <Link to="/signin">click here for login</Link>
                          </p>
                          <p>OR</p>
                          <Button onClick={() => updateUserData(values)}>Update Your Data</Button>
                        </div>
                      )}

                      {errorMessage && <div className="text-danger">{errorMessage}</div>}
                      <div className="d-flex justify-content-center">
                        <Button
                          type="submit"
                          className="btn btn-primary w-50 my-1 btn-rounded mt-3 d-flex justify-content-center align-items-cen"
                          disabled={!otpVerified || isSubmitting || emailExistsError || agreeToTermsAndConditionByCheck === false}
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
        </Box>
      </div>
      <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)}>
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
      <div>
        {/* Your application components */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </Container>
  )
};

export default CandiSignup
