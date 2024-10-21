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
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();
    const [showResumePopup, setShowResumePopup] = useState(false);

    const handleChange = (e) => {
        setJobRole(e.target.value);
    };

    const handleCompanyInputChange = (e) => {
        setCompanyInput(e.target.value);
    };

    const handleAddCompany = () => {
        if (companyInput.trim() !== '') {
            setCompanies([...companies, companyInput.trim()]);
            setCompanyInput('');
        }
    };

    const handleRemoveCompany = (index) => {
        const newCompanies = companies.filter((_, i) => i !== index);
        setCompanies(newCompanies);
    };

    const handleApplyButtonClick = () => {
        if (jobRole.trim() === '' || companies.length === 0) {
            setErrorMessage('Please enter the company name and job role before selecting a resume.');
            return;
        }
        setErrorMessage(''); // Clear any previous error message
        setShowResumePopup(true);
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

    const handleResumeSelect = async (resumeId) => {
        if (resumeId) {
            // If saving is successful, then apply for the job
            await applyJob(resumeId, companies);

            // Close the resume selection popup
            setShowResumePopup(false);
        }
    };
    const applyJob = async (resumeId, companies) => {
        let loadingPopup;

        try {
            // Show loading message using SweetAlert
            loadingPopup = Swal.fire({
                title: 'Applying to the jobs...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const appliedOn = new Date(); // Get current date and time
            const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
            const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
            const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
            const formattedDate = `${year}-${month}-${day}`;

            // Iterate over companies array
            for (const companyName of companies) {
                const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${encodeURIComponent(companyName)}&jobRole=${jobRole}&formattedDate=${formattedDate}&resumeId=${resumeId}`);
                console.log(`Applied to ${companyName}:`, response.data);
            }

            // Close loading popup and show success message
            Swal.close();
            await Swal.fire({
                icon: "success",
                title: "Apply Successful!",
                text: "You have successfully applied for the selected jobs."
            });

            navigate(-1);

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

    const toggleLeftSide = () => {
        console.log("Toggling left side visibility");
        setIsLeftSideVisible(!isLeftSideVisible);
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

                        <Card className="center-container-card p-4">
                            <Form onSubmit={handleSubmit} className="center-form-card">
                                <Form.Group className="mb-3">
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
                                <Form.Group className="mb-3">
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
                                    <Form.Text className="text-muted">
                                        Enter company names one by one. Click "Add" to include each company in the list.
                                    </Form.Text>


                                    <div className="mt-3">
                                        {companies.map((company, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-light text-dark me-2"
                                                style={{
                                                    fontSize: '1.25rem',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.25rem',
                                                    position: 'relative',
                                                    display: 'inline-flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {company}
                                                <i
                                                    className="fas fa-times ms-2 "  // icon-remove
                                                    onClick={() => handleRemoveCompany(index)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: '#dc3545',       // Bootstrap's danger color
                                                        fontSize: '1.2rem',
                                                        position: 'absolute',   // Position relative to the badge
                                                        right: '3px',          // Align to the right edge of the badge
                                                        top: '12%',             // Center vertically within the badge
                                                        transform: 'translateY(-50%)' // Correct vertical centering
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faClose} />
                                                </i>
                                            </span>
                                        ))}
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3">
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
}

export default DreamJob;
