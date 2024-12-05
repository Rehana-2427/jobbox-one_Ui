import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';

const BASE_API_URL = process.env.REACT_APP_API_URL;

const DreamCompany = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [companyName, setCompanyName] = useState(location.state?.companyName || '');
  const [companySuggestions, setCompanySuggestions] = useState([]); // State for company suggestions
  const [selectedCompany, setSelectedCompany] = useState(null); // Selected company
  const navigate = useNavigate();
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [resumeId, setResumeId] = useState(0);
  const [selectedResume, setSelectedResume] = useState(null); // Store selected resume details

  const handleResumeSelect = async (resume) => {
    const resumeId = resume.target.value

    if (resumeId) {
      setResumeId(resumeId);
      setShowResumePopup(false);  // Close the resume selection popup
    }
  };

  const handleApplyButtonClick = () => {
    if (!selectedCompany) {
      setErrorMessage('Please select a valid company.');
      return;
    }
    if (!resumeId) {
      setErrorMessage('Please select a resume.');
      return;
    }
    applyJob(resumeId);
    setErrorMessage('');
  };

  const [resumes, setResumes] = useState([]);
  useEffect(() => {
    axios.get(`${BASE_API_URL}/getResume?userId=${userId}`)
      .then(response => {
        setResumes(response.data);
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
      });
  }, [userId]);

  const handleCompanySearch = async (e) => {
    const query = e.target.value;
    setCompanyName(query);
    
    if (query.trim() === '') {
      setCompanySuggestions([]); // Clear suggestions if input is empty
      return;
    }

    try {
      const response = await axios.get(`${BASE_API_URL}/searchCompanyNames?companyName=${query}`);
      setCompanySuggestions(response.data); // Set company suggestions based on the response
    } catch (error) {
      console.error('Error searching for companies:', error);
      setCompanySuggestions([]); // Clear suggestions on error
    }
  };

  const handleSelectCompany = (company) => {
    setCompanyName(company.companyName);
    setSelectedCompany(company);
    setCompanySuggestions([]); // Clear suggestions after selection
  };

  const applyJob = async (resumeId) => {
    let loadingPopup;

    try {
      loadingPopup = Swal.fire({
        title: 'Applying to the job...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let appliedSuccessfully = false;
      const appliedOn = new Date();
      const year = appliedOn.getFullYear();
      const month = String(appliedOn.getMonth() + 1).padStart(2, '0');
      const day = String(appliedOn.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;

      const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${selectedCompany.companyName}&formattedDate=${formattedDate}&resumeId=${resumeId}`);

      if (response.data) {
        Swal.close();
        appliedSuccessfully = true;
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Application Failed',
          text: `You have already applied for ${selectedCompany.companyName}`,
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
      if (loadingPopup) {
        Swal.close();
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    } finally {
      if (loadingPopup) {
        Swal.close();
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);
  const toggleLeftSide = () => {
    setIsLeftSideVisible(!isLeftSideVisible);
  };

  return (
    <div className='dashboard-container'>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
        <CandidateLeftSide user={{ userName, userId }} onClose={toggleLeftSide} />
      </div>

      <div className="right-side">
        <Container className="d-flex justify-content-center py-5">
          <div className="content-wrapper w-100" style={{ maxWidth: '600px' }}>
            {/* Header Section */}
            <div className="header-section text-center mb-4">
              <h2 className="display-6 display-sm-5 display-md-4 display-lg-3">Dream Company Application</h2>
              <p className="lead text-wrap">Where you can apply to your dream company by selecting your resume only.</p>
            </div>

            {/* Responsive Form Section */}
            <Form onSubmit={handleSubmit} className="center-form-card p-4 shadow-sm rounded">
              {/* Company Name Input */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="companyName"><h5 className="fw-bold">Company Name:</h5></Form.Label>
                <Form.Control
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyName}
                  onChange={handleCompanySearch} // Trigger company search on input change
                  required
                  className="form-control"
                  placeholder="Enter your company name"
                />
              </Form.Group>

              {/* Display company suggestions */}
              {companySuggestions.length > 0 && (
                <div className="suggestions-list">
                  {companySuggestions.map((company) => (
                    <div
                      key={company.id}
                      className="suggestion-item"
                      onClick={() => handleSelectCompany(company)} // Select company when clicked
                    >
                      {company.companyName}
                    </div>
                  ))}
                </div>
              )}

              {/* Resume Selection */}
              <Form.Group className="mb-3">
                <div className="resume-dropdown-container">
                  <h5 className="fw-bold">Select Resume</h5>
                  <select
                    id="resumeSelect"
                    value={selectedResume}
                    onChange={handleResumeSelect}
                    required
                    className="form-select"
                  >
                    <option value="">Select Resume</option>
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.message}
                      </option>
                    ))}
                  </select>
                </div>
              </Form.Group>

              {/* Apply Button */}
              <Button
                variant="primary"
                onClick={handleApplyButtonClick}
                className="w-50 py-1 mt-3 fw-bold fs-6"
              >
                Apply
              </Button>
            </Form>

            {/* Error Message Display */}
            {errorMessage && <p className="error-message text-danger text-center mt-3">{errorMessage}</p>}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default DreamCompany;
