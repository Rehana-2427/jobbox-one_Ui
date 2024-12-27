import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from '../../pages/Footer';
import DashboardLayout from './DashboardLayout';

const BASE_API_URL = process.env.REACT_APP_API_URL;

const DreamJob = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [jobRole, setJobRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [companies, setCompanies] = useState(new Set());
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

  const [resumeId, setResumeId] = useState(0);
  const [selectedResume, setSelectedResume] = useState(null); // Store selected resume details

  const handleResumeSelect = async (resume) => {
    const resumeId = resume.target.value

    if (resumeId) {
      setResumeId(resumeId);
      setShowResumePopup(false);  // Close the resume selection popup
    }
  };

  const handleApplyButtonClick = async () => {
    if (jobRole.trim() === '' || companies.size === 0) {
      setErrorMessage('Please enter the company name and job role before selecting a resume.');
      return;
    }

    else if (!resumeId) {
      setErrorMessage('Please select a resume.');
      return;
    }
    await applyJob(resumeId, Array.from(companies));
    setErrorMessage(''); // Clear any previous error message
    setShowResumePopup(true);
  };
  const applyJob = async (resumeId, companies) => {
    let loadingPopup;
    try {


      const appliedOn = new Date();
      const formattedDate = `${appliedOn.getFullYear()}-${String(appliedOn.getMonth() + 1).padStart(2, '0')}-${String(appliedOn.getDate()).padStart(2, '0')}`;

      // Get the list of already applied companies
      const response = await axios.get(`${BASE_API_URL}/checkAppliedCompanies?userId=${userId}&companies=${Array.from(companies)}&jobRole=${jobRole}`);
      console.log("Applied companies --- > " + response.data);

      const alreadyApplied = response.data;  // Array of companies that the user has already applied to
      let uniqueElements;

      if (alreadyApplied.length > 0) {
        // Get unique elements that are in either companies or alreadyApplied but not both
        uniqueElements = [
          ...new Set([
            ...Array.from(companies).filter(x => !alreadyApplied.includes(x)),
            ...alreadyApplied.filter(x => !Array.from(companies).includes(x))
          ])
        ];
      } else {
        uniqueElements = Array.from(companies); // All companies to apply to if none have been applied to
      }
      console.log("Unique companies to apply to: ", uniqueElements);  // Display unique companies

      // If the user has already applied to some companies, show the confirmation dialog
      if (alreadyApplied.length > 0) {
        if (uniqueElements.length > 0) {
          const companiesList = alreadyApplied.join(", ");  // Join the array into a string
          const confirmResult = await Swal.fire({
            title: 'You have already applied to these companies:',
            html: `${companiesList}<br><br>If you want to continue and apply to the remaining companies, click OK.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
          });
          // If user cancels, stop the operation
          if (!confirmResult.isConfirmed) {
            console.log('Operation canceled by user.');
            return; // Abort the operation
          }
        } else {
          const confirmResult = await Swal.fire({
            title: 'You have already applied to these companies.',
            //html: `${companiesList}<br><br>If you want to continue and apply to the remaining companies, click OK.`,
            icon: 'warning',
            // showCancelButton: true,
            confirmButtonText: 'OK',
            // cancelButtonText: 'Cancel',
          });
          // If user cancels, stop the operation
          if (confirmResult.isConfirmed) {
            console.log('Operation canceled by user.');
            return; // Abort the operation
          }
        }
      }


      loadingPopup = Swal.fire({
        title: 'Applying to the jobs...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      // Proceed with applying to unique companies
      let appliedSuccessfully = true;
      for (const companyName of uniqueElements) {
        const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${encodeURIComponent(companyName)}&jobRole=${jobRole}&formattedDate=${formattedDate}&resumeId=${resumeId}`);
        console.log(`Applied to ${companyName}: `, response.data);
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
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <DashboardLayout>
      <div className="main-content">
        <Button variant='primary' onClick={handleBack} style={{ width: '100px', marginLeft: '12px' }}>Back</Button>
        <Container className="d-flex justify-content-center py-5">
          <div className="content-wrapper w-100" style={{ maxWidth: '600px' }}>
            {/* Header Section */}
            <div className="header-section text-center mb-4">
              <h2 className="display-6 display-sm-5 display-md-4 display-lg-3">Dream Company Application</h2>
              <p className="lead text-wrap">Where you can apply to your dream position by selecting your resume only.</p>
            </div>


            {/* Responsive Form Section */}
            <Form onSubmit={handleSubmit} className="center-form-card p-4 shadow-sm rounded">
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
                  Enter company names one by one. <br /> Click "Add" to include each company in the list.
                </Form.Text>

              </Form.Group>

              <br />

              <div className='mb-3 d-flex flex-wrap'>
                {Array.from(companies).map((company, index) => (
                  <span
                    key={index}
                    className="badge bg-light text-dark me-2 mb-2 position-relative d-inline-flex align-items-center"
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
              <br />
              <Form.Group>
                {/* <Form.Label htmlFor="resume">Resume:</Form.Label> */}
                {/* <Button onClick={handleApplyButtonClick}>Select Resume</Button> */}

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
              <Button
                variant="primary"
                onClick={handleApplyButtonClick}
                className="w-50 py-1 mt-3 fw-bold fs-6"
              >
                Apply
              </Button>
            </Form>


            {errorMessage &&
              <p className="error-message" style={{ maxWidth: '350px', textWrap: 'auto' }}>
                {errorMessage}
              </p>
            }

            {/* {showResumePopup && (
              <ResumeSelectionPopup
                resumes={resumes}
                onSelectResume={handleResumeSelect}
                onClose={() => setShowResumePopup(false)}
              />
            )} */}

          </div>
        </Container>

      </div>
      <Footer />
    </DashboardLayout>

  );
};

export default DreamJob;
