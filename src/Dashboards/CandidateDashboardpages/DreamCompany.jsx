import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import Footer from '../../pages/Footer';
import './CandidateDashboard.css';
import DashboardLayout from './DashboardLayout';


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
    // Check if no company is selected or entered
    if (!selectedCompany && !companyName.trim()) {
      toast.error("Please select or enter a valid company.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeButton: true,
      });
      return;
    }

    // Use the entered company name if no selection is made
    const companyToApply = selectedCompany ? selectedCompany.companyName : companyName.trim();

    if (!companyToApply) {
      toast.error("Please select or enter a valid company.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeButton: true,
      });
      return;
    }

    if (!resumeId) {
      toast.error("Please select a resume.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeButton: true,
      });
      return;
    }

    // Proceed to apply the job
    applyJob(resumeId, companyToApply);
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

  const applyJob = async (resumeId, companyToApply) => {
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

      const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${companyToApply}&formattedDate=${formattedDate}&resumeId=${resumeId}`);

      if (response.data) {
        Swal.close();
        appliedSuccessfully = true;
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Application Failed',
          text: `You have already applied for ${companyToApply}`,
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
  const getRandomVariant = (index) => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    return variants[index % variants.length]; // Cycle through the variants
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
              <h2 className="display-6 display-sm-5 display-md-4 display-lg-3 text-primary">Dream Company Application</h2>
              <p className="lead text-muted">Where you can apply to your dream company by selecting your resume only.</p>
            </div>

            {/* Responsive Form Section */}
            <Form onSubmit={handleSubmit} className="center-form-card p-4 shadow-sm rounded bg-white position-relative">

              {/* Company Name Input */}
              <Form.Group className="mb-3 position-relative">
                <Form.Label htmlFor="companyName"><h5 className="fw-bold">Company Name:</h5></Form.Label>
                <Form.Control
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyName}
                  onChange={handleCompanySearch}
                  required
                  className="form-control"
                  placeholder="Enter your company name"
                />

                {/* Display company suggestions */}
                {companySuggestions.length > 0 && (
                  <ListGroup
                    className="suggestions-list bg-white border rounded p-2 position-absolute w-100"
                    style={{
                      top: '100%',
                      left: '0',
                      zIndex: '10',
                      width: '300px', // Fixed width for the suggestions list
                      maxHeight: '200px', // Max height of the suggestions list
                      overflowY: 'scroll', // Always show scrollbar
                      scrollbarWidth: 'thin', // For Firefox: thinner scrollbar
                      scrollbarColor: '#888 #e0e0e0', // For Firefox: customize scrollbar colors (thumb and track)
                    }}
                  >
                    {companySuggestions.map((company, index) => (
                      <ListGroup.Item
                        key={company.id}
                        as="div"
                        action
                        onClick={() => handleSelectCompany(company)} // Select company when clicked
                        variant={getRandomVariant(index)} // Apply different colors for each item
                        className="cursor-pointer"
                      >
                        {company.companyName}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Form.Group>

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
                className="w-50 py-2 mt-4 fw-bold fs-6 d-block mx-auto"
              >
                Apply
              </Button>
            </Form>

            {/* Error Message Display */}
            {/* Toast */}
            <ToastContainer />
          </div>
        </Container>
      </div>
      <Footer />
    </DashboardLayout>


  );
};

export default DreamCompany;
