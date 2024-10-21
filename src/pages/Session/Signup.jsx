import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './StyleSession/signup.css';

const Signup = () => {
  const [userType, setUserType] = useState("");
const navigate = useNavigate();
  const handleUserTypeChange = (type) => {
    setUserType(type);
    if (type === "HR") {
      navigate("/signup/userSignup", { state: { userType: type } });
    }
    if (type === "Candidate") {
      navigate("/signup/userSignup", { state: { userType: type } }); // Navigate to the nested route
    }
    
  };

  return (
    <Container className="centered-form">
      <div className="form-container">
        <h1 className='heading'>User Registration</h1>
        <Form onSubmit={(event) => event.preventDefault()} className="user-registration-form">
          <p style={{ textAlign: 'center' }}>Select your role and please fill the details</p>
          <div className="radio-group">
           
            <Form.Check
              type="radio"
              label="HR"
              name="userType"
              value="HR"
              onChange={() => handleUserTypeChange("HR")}
              checked={userType === "HR"}
            />
            <Form.Check
              type="radio"
              label="Candidate"
              name="userType"
              value="Candidate"
              onChange={() => handleUserTypeChange("Candidate")}
              checked={userType === "Candidate"}
            />
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Signup;
