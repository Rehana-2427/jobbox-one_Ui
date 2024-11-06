import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';

// const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
const BASE_API_URL = process.env.REACT_APP_API_URL;
const DreamCompany = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [companyName, setCompanyName] = useState('');
  console.log(companyName);
const navigate = useNavigate();
  const [showResumePopup, setShowResumePopup] = useState(false);
  const handleApplyButtonClick = () => {

    if (companyName.trim() === '') {
      setErrorMessage('Please enter the company name before selecting a resume.');
      return;
    }
    setErrorMessage(''); // Clear any previous error message
    setShowResumePopup(true);
  };

  const [resumes, setResumes] = useState([]);
  useEffect(() => {
    // Fetch resumes data from the backend
    axios.get(`${BASE_API_URL}/getResume?userId=${userId}`)
      .then(response => {
        setResumes(response.data);
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
      });
  }, [userId]);

  const handleChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleResumeSelect = async (resumeId) => {
    if (resumeId) {
      // If saving is successful, then apply for the job
      await applyJob(resumeId);

      // Close the resume selection popup
      setShowResumePopup(false);
    }
  };

  const applyJob = async (resumeId) => {
    let loadingPopup;

    try {
      // Show loading message using SweetAlert
      loadingPopup = Swal.fire({
        title: 'Applying to the job...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  // Iterate over companies array and apply
  let appliedSuccessfully = false;
      const appliedOn = new Date(); // Get current date and time
      const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
      const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
      const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month

      const formattedDate = `${year}-${month}-${day}`;

      const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${companyName}&formattedDate=${formattedDate}&resumeId=${resumeId}`);
      console.log(response.data);

        if (response.data) {
          Swal.close();
          appliedSuccessfully = true;
       
        
      } else {
          await Swal.fire({
              icon: 'error',
              title: 'Application Failed',
              text: `You have already applied for ${companyName}`,
            });
      }

      if (appliedSuccessfully) {
        await Swal.fire({
          icon: 'success',
          title: 'Apply Successful!',
          text: 'You have successfully applied for the selected jobs.',
        });
        setCompanyName('');
        navigate(-1);
      }
     
      
  
    } catch (error) {
      console.error('Error applying for job:', error);
      // Close loading popup on error
      if (loadingPopup) {
        Swal.close();
      }
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    } finally {
      // Ensure loading popup is closed if still open
      if (loadingPopup) {
        Swal.close();
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  };
 
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);
  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };
  return (
    <div className='dashboard-container'>
      <div>
        <button className="hamburger-icon" onClick={toggleLeftSide} >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
      <CandidateLeftSide user={{ userName, userId }} onClose={toggleLeftSide} />
      </div>

      <div className="right-side">
      <Container className='d-flex justify-content-center'>

          <div className="centered-content" style={{ minHeight: 'fit-content',Width: '100%' }} >
            {showResumePopup && (
              <ResumeSelectionPopup
                resumes={resumes}
                onSelectResume={handleResumeSelect}
                onClose={() => setShowResumePopup(false)}
              />
            )}

            <Card className="center-container-card" >
              <Form onSubmit={handleSubmit} className="center-form-card">
                <Form.Group>
                  <Form.Label htmlFor="companyName">Company Name:</Form.Label>
                  <Form.Control
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={companyName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label htmlFor="resume">Resume:</Form.Label>
                  <Button onClick={handleApplyButtonClick}>Select Resume</Button>
                </Form.Group>
              </Form>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </Card>

          </div>
        </Container>
      </div>
    </div>
  );
};

export default DreamCompany;
