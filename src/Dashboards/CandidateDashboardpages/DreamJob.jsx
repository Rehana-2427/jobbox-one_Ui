import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';

const BASE_API_URL = process.env.REACT_APP_API_URL;

const DreamJob = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [companies, setCompanies] = useState(new Set());
  const [isSwaling, setIsSwaling] = useState(false);
  const navigate = useNavigate();
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_API_URL}/getResume?userId=${userId}`)
      .then(response => setResumes(response.data))
      .catch(error => console.error('Error fetching resumes:', error));
  }, [userId]);

  const handleChange = (e) => {
    setJobRole(e.target.value);
  };

  const handleCompanyInputChange = (e) => {
    setCompanyInput(e.target.value);
  };

  const handleAddCompany = () => {
    if (companyInput.trim() !== '') {
      setCompanies(prev => new Set(prev.add(companyInput.trim())));
      setCompanyInput('');
    }
  };

  const handleRemoveCompany = (company) => {
    setCompanies(prev => {
      const newCompanies = new Set(prev);
      newCompanies.delete(company);
      return newCompanies;
    });
  };

  const handleApplyButtonClick = () => {
    if (jobRole.trim() === '' || companies.size === 0) {
      setErrorMessage('Please enter the company name and job role before selecting a resume.');
      return;
    }
    setErrorMessage(''); // Clear any previous error message
    setShowResumePopup(true);
  };

  const handleResumeSelect = async (resumeId) => {
    if (resumeId) {
      await applyJob(resumeId, Array.from(companies));
      setShowResumePopup(false);
    }
  };

  const applyJob = async (resumeId, companies) => {
    let loadingPopup;
    try {
      loadingPopup = Swal.fire({
        title: 'Applying to the jobs...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const appliedOn = new Date();
      const formattedDate = `${appliedOn.getFullYear()}-${String(appliedOn.getMonth() + 1).padStart(2, '0')}-${String(appliedOn.getDate()).padStart(2, '0')}`;

      // Iterate over companies array and apply
      let appliedSuccessfully = false;
      for (const companyName of companies) {
        const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${encodeURIComponent(companyName)}&jobRole=${jobRole}&formattedDate=${formattedDate}&resumeId=${resumeId}`);
        console.log(`applied to   ++>  ${companyName}` + response.data )
        if (response.data) {
            appliedSuccessfully = true;
         
          
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Application Failed',
                text: `You have already applied for this job at ${companyName}`,
              });
        }
      }

      // Close loading popup and show success message if applied successfully
      Swal.close();
      if (appliedSuccessfully) {
        await Swal.fire({
          icon: 'success',
          title: 'Apply Successful!',
          text: 'You have successfully applied for the selected jobs.',
        });
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

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const toggleLeftSide = () => {
    setIsLeftSideVisible(prev => !prev);
  };

  return (
    <div className='dashboard-container'>
      <div>
        <button className="hamburger-icon" onClick={toggleLeftSide}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
        <CandidateLeftSide user={{ userName, userId }} onClose={toggleLeftSide} />
      </div>

      <div className="right-side">
        <Container className='d-flex justify-content-center'>
          <div className="centered-content" style={{ minHeight: 'fit-content', width: '100%' }}>
            {showResumePopup && (
              <ResumeSelectionPopup
                resumes={resumes}
                onSelectResume={handleResumeSelect}
                onClose={() => setShowResumePopup(false)}
              />
            )}
            <Card className="center-container-card">
              <Form onSubmit={handleSubmit} className="center-form-card">
                <Form.Group>
                  <Form.Label htmlFor="jobRole">Job Title:</Form.Label>
                  <Form.Control
                    type="text"
                    id="jobRole"
                    name="jobRole"
                    value={jobRole}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="companies">Companies:</Form.Label>
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder="Enter company name one by one"
                      value={companyInput}
                      onChange={handleCompanyInputChange}
                    />
                    <Button
                      variant="primary"
                      onClick={handleAddCompany}
                      disabled={!companyInput.trim()}
                    >
                      Add
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted text-wrap">
                    Enter company names one by one. Click "Add" to include each company in the list.
                  </Form.Text>

                  <div>
                    {Array.from(companies).map((company, index) => (
                      <span
                        key={index}
                        className="badge bg-light text-dark me-2"
                        style={{
                          fontSize: '1.25rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem',
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        {company}
                        <i
                          className="fas fa-times ms-2"
                          onClick={() => handleRemoveCompany(company)}
                          style={{
                            cursor: 'pointer',
                            color: '#dc3545',
                            fontSize: '1.2rem',
                            position: 'absolute',
                            right: '3px',
                            top: '12%',
                            transform: 'translateY(-50%)',
                          }}
                        >
                          <FontAwesomeIcon icon={faClose} />
                        </i>
                      </span>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="resume">Resume:</Form.Label>
                  <Button onClick={handleApplyButtonClick}>Select Resume</Button>
                </Form.Group>
              </Form>
              {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default DreamJob;
