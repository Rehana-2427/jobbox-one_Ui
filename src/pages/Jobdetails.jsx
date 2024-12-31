import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../apiClient';
import ResumeSelectionPopup from '../Dashboards/CandidateDashboardpages/ResumeSelectionPopup';
import CustomNavbar from './CustomNavbar';

const Jobdetails = () => {
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

    useEffect(() => {
        const queryString = location.search; // This gives you only the query string (e.g., ?jobId=57&companyName=WIPRO)
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
            const response = await api.getLogo(companyName);
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
            const response = await api.getBanner(companyName);
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
            const response = await api.getJob(id)
            setJobDetails(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };
    const fetchJobsByCompany = async (companyName) => {
        try {
            const response = await api.getLatest5JobsByCompany(companyName);
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

            // Check if the user is a candidate
            if (user?.userRole === 'Candidate') {
                const response = await api.applyJob(jobId, userId, formattedDate, resumeId);
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
            } else {
                // Handle HR case (if needed)
                // You can either skip the API call or handle it differently
                Swal.close();
                await Swal.fire({
                    icon: "info",
                    title: "Info",
                    text: "HR users cannot apply for jobs."
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
        // Check if the user is a candidate before making the API call
        if (userId && user?.userRole === 'Candidate') {
            api.getResume(userId)
                .then(response => {
                    setResumes(response.data);
                })
                .catch(error => {
                    console.error('Error fetching resumes:', error);
                });
        }
    }, [userId, user]);


    useEffect(() => {
        if (user?.userRole === 'Candidate') {
            checkHasUserApplied();
        }
    }, [jobs, userId]);

    const checkHasUserApplied = async () => {
        const applications = {};
        try {
            for (const job of jobs) {
                const response = await api.checkJobAppliedOrNot(job.jobId, userId)
                applications[job.jobId] = response.data;
            }
            setHasUserApplied(applications);
        } catch (error) {
            console.error('Error checking application:', error);
        }
    };

    return (
        <div style={{ overflow: 'hidden' }}>
            <div className="custom-navbar-container">
                <CustomNavbar />
            </div>
            <div className='welcome-msg' style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
                <Row >
                    <div>
                        <Card style={{ width: '100%', height: '60%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            <Card.Body style={{ padding: 0, position: 'relative' }}>
                                <div style={{ position: 'relative', height: '55%' }}>
                                    <img
                                        src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                                        alt="Company Banner"
                                        className="banner-image"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            borderTopLeftRadius: '10px',
                                            borderTopRightRadius: '10px',
                                        }}
                                    />
                                </div>
                                <div style={{ position: 'absolute', top: '90%', left: '50px', transform: 'translateY(-50%)' }}>
                                    <img
                                        src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                                        alt="Company Logo"
                                        className="logo-image"
                                        style={{
                                            width: '20vw',
                                            height: '20vw',
                                            maxWidth: '150px',
                                            maxHeight: '150px',
                                            cursor: 'pointer',
                                            objectFit: 'cover',
                                            clipPath: 'none',
                                            border: '5px solid #f0f0f0', // Adds a black border around the image
                                            borderRadius: '10px', // Optional: adds rounded corners to the border
                                        }}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
                <h2 className="responsive-title">
                    <b>{companyName}</b>
                </h2>
                <hr style={{ width: '100%', backgroundColor: 'grey' }}></hr>
                <div style={{ width: '100%', marginTop: "30px" }}>
                    <Row>
                        <Col lg={9} style={{ height: 'fit-content', }}>
                            <Card style={{ top: '10%', width: '100%', height: "fit-content" }}>
                                <Card.Header>
                                    <Card.Title style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'auto', padding: '0px' }}>
                                        <h2 className='text-start'>Job Description</h2>
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
                                                        padding: '5px 10px',
                                                        borderRadius: '5px', // Rounded corners
                                                        textAlign: 'left', // Center-align the text
                                                        margin: '0', // Margin above and below the paragraph
                                                    }}>
                                                        Applied</p> // Display 'Applied' if the user has already applied
                                                ) : (
                                                    <Button style={{margin: 0}} onClick={() => handleApplyButtonClick(jobId)} >Apply</Button> // Display 'Apply' button if the user hasn't applied yet
                                                )
                                            ) : null // No buttons for non-candidates
                                        ) : (
                                            // If the user is not logged in, show the login button
                                            <Button style={{margin: 0,backgroundColor: '#28a745',color: 'white'}}  variant="success" onClick={handleCandidateClick}>
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
                            <div className='other-jobs' style={{ margin: '8px', width: '250px', height: 'fit-content' }}>
                                <h3 style={{ marginTop: '20px', marginLeft: '12px', fontSize: '18px', color: 'purple' }}>
                                    Other Jobs
                                </h3>
                                {jobs.map((job) => (
                                    <Card className='other-jobs' key={jobId}>
                                        <Card.Body
                                            onClick={() => {
                                                const baseUrl = '/#/browse-jobs/job-details';
                                                // Construct the query parameters manually
                                                const params = new URLSearchParams({
                                                    companyName: encodeURIComponent(job.companyName || ''),
                                                    jobId: encodeURIComponent(job.jobId || ''),
                                                }).toString();
                                                // Construct the final URL with parameters after the hash
                                                const fullUrl = `${window.location.origin}${baseUrl}?${params}`;
                                                console.log("full url --> " + fullUrl);
                                                // Open the new page in a new tab
                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
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
                </div>

            {showResumePopup && (
                <ResumeSelectionPopup
                    resumes={resumes}
                    onSelectResume={handleResumeSelect}
                    show={true}
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
        </div>
    );
}

export default Jobdetails;
