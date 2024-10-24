import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ResumeSelectionPopup from '../Dashboards/CandidateDashboardpages/ResumeSelectionPopup';
import CustomNavbar from './CustomNavbar';

const Jobdetails = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const location = useLocation();
    const [queryParams, setQueryParams] = React.useState({});
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [hasUserApplied, setHasUserApplied] = useState({});
    const [jobDetails, setJobDetails] = useState({
        jobTitle: '',
        jobType: '',
        skills: '',
        postingDate: '',
        numberOfPosition: '',
        salary: '',
        location: '',
        jobsummary: '',
        applicationDeadline: '',
    })
    // Extract query parameters using window.location.search
    React.useEffect(() => {
        const queryString = window.location.search; // This gives you only the query string (e.g., ?jobId=57&companyName=WIPRO)
        const params = new URLSearchParams(queryString);
        const companyName = decodeURIComponent(params.get('companyName')); // Decoding the company name
        const jobId = params.get('jobId');
        setQueryParams({ companyName, jobId });
    }, [location]);

    const { companyName, jobId } = queryParams;
    const [companyLogo, setCompanyLogo] = useState("");
    const [companyBanner, setCompanyBanner] = useState("");

    useEffect(() => {
        if (companyName) {
            fetchCompanyLogo(companyName);
            fetchCompanyBanner(companyName);
            fetchJobsByCompany(companyName)
        }
    }, [companyName]);
    console.log(companyName)
    const fetchCompanyLogo = async (companyName) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/logo`, { params: { companyName }, responseType: 'arraybuffer' });
            const image = `data:image/jpeg;base64,${btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            )}`;
            setCompanyLogo(image);
        } catch (error) {
            console.error('Error fetching company logo:', error);
        }
    };
    const fetchCompanyBanner = async (companyName) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/banner`, { params: { companyName }, responseType: 'arraybuffer' });
            const image = `data:image/jpeg;base64,${btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            )}`;
            setCompanyBanner(image);
        } catch (error) {
            console.error('Error fetching company banner:', error);
        }
    };
    useEffect(() => {
        if (jobId) {
            fetchJobDetails(jobId);
        }
    }, [jobId]);
    const fetchJobDetails = async (id) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getJob`, { params: { jobId: id } });
            setJobDetails(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };
    const fetchJobsByCompany = async (companyName) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getLatest5JobsByCompany`, { params: { companyName } });
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs by company:', error);
        }
    };
    const calculateDaysAgo = (postingDate) => {
        const now = new Date();
        const postedDate = new Date(postingDate);
        const differenceInTime = now - postedDate; // Difference in milliseconds
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Convert to days
        return differenceInDays;
    };

    const openModal = (content) => {
        setShowModal(true); // Open modal
    };

    const handleCandidateClick = () => {
        openModal('candidate'); // Set modal content for candidate
    };
    const closeModal = () => {
        setShowModal(false); // Close modal
    };

    const handleModalOptionClick = (option) => {
        closeModal();
        if (option === 'login') {
            navigate('/signin', { state: { userType: 'Candidate' } });
        }
        else if (option === 'register') {
            navigate('/candidate-signup', { state: { userType: 'Candidate' } });
        }
    };

    const [applyjobs, setApplyJobs] = useState([]);
    const [showResumePopup, setShowResumePopup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [user, setUser] = useState(null); // Store the user object
    const [userId, setUserId] = useState(null); // State to store userId
    useEffect(() => {
        // Check if user is logged in (you can check localStorage/sessionStorage here)
        const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is saved here after login
        if (loggedInUser && loggedInUser.userName) {
            setIsLoggedIn(true);
            setUser(loggedInUser); // Set user object
            if (loggedInUser.userRole === 'Candidate') {
                setUserId(loggedInUser.userId); // Store userId for candidate
            }
        }
    }, []);
    console.log("User ID:", userId); // Example of using userId


    const handleApplyButtonClick = (jobId) => {
        setSelectedJobId(jobId);
        setShowResumePopup(true);
    };

    const handleResumeSelect = async (resumeId) => {
        if (selectedJobId && resumeId) {
            await applyJob(selectedJobId, resumeId);
            setSelectedJobId(null);
            setShowResumePopup(false);
        }
    };

    const applyJob = async (jobId, resumeId) => {
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

            const appliedOn = new Date(); // Get current date and time
            const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
            const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
            const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month

            const formattedDate = `${year}-${month}-${day}`;

            const response = await axios.put(`${BASE_API_URL}/applyJob`, null, {
                params: { jobId, userId, formattedDate, resumeId },
            });

            if (response.data) {
                setApplyJobs((prevApplyJobs) => [...prevApplyJobs, { jobId, formattedDate }]);
                setHasUserApplied((prev) => ({ ...prev, [jobId]: true }));

                // Close the loading popup
                Swal.close();

                // Show success message
                await Swal.fire({
                    icon: "success",
                    title: "Apply Successful!",
                    text: "You have successfully applied for this job."
                });
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

    useEffect(() => {
        axios.get(`${BASE_API_URL}/getResume`, { params: { userId } })
            .then(response => {
                setResumes(response.data);
            })
            .catch(error => {
                console.error('Error fetching resumes:', error);
            });
    }, [userId]);

    useEffect(() => {
        checkHasUserApplied();
    }, [jobs, userId]);

    const checkHasUserApplied = async () => {
        const applications = {};
        try {
            for (const job of jobs) {
                const response = await axios.get(`${BASE_API_URL}/applicationApplied`, {
                    params: { jobId: job.jobId, userId }
                });
                applications[job.jobId] = response.data;
            }
            setHasUserApplied(applications);
        } catch (error) {
            console.error('Error checking application:', error);
        }
    };

    return (
        <div>
            <div>
                <CustomNavbar />
            </div>
            <div style={{ paddingTop: '150px' }}>
                <div>
                    <Card style={{ width: '100%', height: '60%' }}>
                        <Card.Body style={{ padding: 0, position: 'relative' }}>
                            <div style={{ position: 'relative', height: '55%' }}>
                                <img
                                    src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                                    alt="Company Banner"
                                    className="banner-image"
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                                />
                            </div>
                            <div style={{ position: 'absolute', top: '100%', left: '50px', transform: 'translateY(-50%)' }}>
                                <img
                                    src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                                    alt="Company Logo"
                                    className="logo-image"
                                    style={{
                                        width: '200px', // Fixed width
                                        height: '120px', // Fixed height
                                        cursor: 'pointer',
                                        clipPath: 'ellipse(50% 50% at 50% 50%)', // Creates a horizontal oval
                                        objectFit: 'cover', // Ensures the image covers the dimensions without distortion
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <br></br><br></br>
            </div>
            <Container style={{ width: '100%', marginTop: "30px" }}>
                <Row>
                    <Col lg={9} style={{ height: 'fit-content' }}>
                        <Card style={{ top: '10%', width: '100%', height: "fit-content" }}>
                            <Card.Header>
                                <Card.Title style={{ height: '30px' }}>
                                    <h2 style={{ position: 'relative', top: '8%' }}>Job Description</h2>
                                    {/* <Button style={{ position: 'relative', bottom: '100%', left: '90%' }} onClick={handleCandidateClick}>Apply</Button> */}
                                    {isLoggedIn ? (
                                        user?.userRole === 'Candidate' ? (
                                            // Check if the user has already applied for this job
                                            hasUserApplied[jobId] === true || (applyjobs && applyjobs.jobId === jobId) ? (
                                                <p style={{
                                                    color: '#28a745', // Green color for the text
                                                    fontSize: '18px', // Larger font size
                                                    fontWeight: 'bold', // Bold text
                                                    backgroundColor: '#e9f5e9', // Light green background color
                                                    padding: '10px',
                                                    borderRadius: '5px', // Rounded corners
                                                    textAlign: 'left', // Center-align the text
                                                    margin: '10px 0', // Margin above and below the paragraph
                                                    boxShadow: 'rgba(0, 0, 0, 0.1)', // Subtle shadow effect
                                                    width: '100px',
                                                    position: 'relative', bottom: '100%', left: '90%'
                                                }}>
                                                    Applied</p> // Display 'Applied' if the user has already applied
                                            ) : (
                                                <Button onClick={() => handleApplyButtonClick(jobId)} style={{ position: 'relative', bottom: '100%', left: '90%' }}>Apply</Button> // Display 'Apply' button if the user hasn't applied yet
                                            )
                                        ) : null // No buttons for non-candidates
                                    ) : (
                                        // If the user is not logged in, show the login button
                                        <Button variant="success" onClick={handleCandidateClick} style={{ position: 'relative', bottom: '100%', left: '80%' }}>
                                            Login to Apply
                                        </Button>
                                    )}

                                </Card.Title>
                                <Card.Body>
                                    <p><strong>Job Type:</strong> {jobDetails.jobTitle}</p>
                                    <p><strong>Job Type:</strong> {jobDetails.jobType}</p>
                                    <p><strong>Skills:</strong> {jobDetails.skills}</p>
                                    <p><strong>Posting Date:</strong> {jobDetails.postingDate}</p>
                                    <p><strong>Number of Positions:</strong> {jobDetails.numberOfPosition}</p>
                                    <p><strong>Salary:</strong> {jobDetails.salary}</p>
                                    <p><strong>Location:</strong> {jobDetails.location}</p>
                                    <strong>Job Summary:</strong> <pre className="job-details-text">{jobDetails.jobsummary}</pre>
                                    <p>
                                        <strong>Application Deadline:</strong>
                                        {jobDetails.applicationDeadline ? (
                                            jobDetails.applicationDeadline
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Evergreen Job</span>
                                        )}
                                    </p>
                                </Card.Body>
                            </Card.Header>
                        </Card>
                    </Col>

                    <Col lg={3}>
                        <div style={{ margin: '8px', width: '250px', height: 'fit-content' }}>
                            <h3 style={{ marginTop: '20px', marginLeft: '12px', fontSize: '18px' }}>
                                Other Jobs
                            </h3>
                            {jobs.map((job) => (
                                <Card key={jobId} style={{ width: '250px', height: '150px' }}>
                                    <Card.Body
                                        onClick={() => {
                                            const url = new URL('/#/browse-jobs/job-details', window.location.origin);
                                            url.searchParams.append('companyName', encodeURIComponent(job.companyName || ''));
                                            url.searchParams.append('jobId', encodeURIComponent(job.jobId || ''));
                                            window.open(url.toString(), '_blank', 'noopener,noreferrer');
                                        }}
                                        style={{ padding: '8px' }}
                                        title={job.jobCategory === "evergreen" ? "This position is always open for hiring, feel free to apply anytime!" : ""}
                                    >
                                        <Card.Title style={{ fontSize: '14px' }}>
                                            {job.jobTitle} ({job.jobType})
                                        </Card.Title>

                                        <Card.Text style={{ fontSize: '12px' }}>
                                            <strong>Application Deadline:</strong>
                                            {job.applicationDeadline ? (
                                                job.applicationDeadline
                                            ) : (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>Evergreen Job</span>
                                            )}
                                            <br />
                                            Posted  {calculateDaysAgo(job.postingDate)} days ago
                                            <br />
                                        </Card.Text>
                                        <hr style={{ backgroundColor: 'black' }} />
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>

            {showResumePopup && (
                <ResumeSelectionPopup
                    resumes={resumes}
                    onSelectResume={handleResumeSelect}
                    onClose={() => setShowResumePopup(false)}
                />
            )}

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton style={{ backgroundColor: '#faccc', color: 'white', borderBottom: 'none' }}>
                    <Modal.Title>Choose an Option</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '20px', textAlign: 'center' }}>
                    <Button
                        variant="primary"
                        onClick={() => handleModalOptionClick('login')}
                        style={{ width: '100%', marginBottom: '10px', backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}
                    >
                        Already have an account - Login
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => handleModalOptionClick('register')}
                        style={{ width: '100%', backgroundColor: '#00b894', borderColor: '#00b894' }}
                    >
                        Don't have an account - Register
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Jobdetails;
