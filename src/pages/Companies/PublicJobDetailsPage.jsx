import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../apiClient";
import CustomNavbar from "../CustomNavbar";
import Footer from "../Footer";

const PublicJobDetailsPage = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const [companyLogo, setCompanyLogo] = useState("");
    const [companyBanner, setCompanyBanner] = useState("");
    const location = useLocation();
    const companyId = location.state?.companyId;
    const companyName = location.state?.companyName;
    const jobId = location.state?.jobId;
    const [unappliedJobs, setUnappliedJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [hasUserApplied, setHasUserApplied] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const navigate = useNavigate();
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
    useEffect(() => {
        if (companyName) {
            fetchCompanyLogo(companyName);
            fetchCompanyBanner(companyName);
            fetchJobsByCompany(companyName);
            fetchSocialMediaLinks(companyName);
        }
    }, [companyName]);
    useEffect(() => {
        if (jobId) {
            fetchJobDetails(jobId);
        }
    }, [jobId]);
    // useEffect(() => {
    //     if (companyId) {
    //         fetchCompany();
    //     }
    // }, [companyId]);
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
            const response = await axios.get(`${BASE_API_URL}/getLatest5JobsByCompany`, { params: { companyName } });

            // Log the response data to the console
            console.log('Fetched jobs by company:', response.data);

            // Assuming 'response.data' contains the array of jobs
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs by company:', error);
        }
    };
    // const fetchCompany = async () => {
    //     try {
    //         const response = await axios.get(`${BASE_API_URL}/displayCompanyById?companyId=${companyId}`);
    //         // if (companyName) {
    //         //     fetchCompanyLogo();  // No need to pass companyName as a parameter
    //         //     fetchCompanyBanner(); // No need to pass companyName as a parameter
    //         //     fetchSocialMediaLinks(); // Same here
    //         // }
    //     } catch (error) {
    //         console.error('Error fetching company details:', error);
    //     }
    // };
    // useEffect(() => {
    //     const filterUnappliedJobs = jobs.filter(job => !hasUserApplied[job.jobId] && job.jobId !== selectedJobId);
    //     setUnappliedJobs(filterUnappliedJobs);
    // }, [jobs, hasUserApplied, selectedJobId]);
    let job1;
    for (job1 of jobs) {
        console.log("GetLatest5JobsByCompany ---> " + JSON.stringify(job1));
    }

    const fetchCompanyLogo = async () => {
        try {
            if (companyName) { // Access companyName from state
                const response = await axios.get(`${BASE_API_URL}/logo`, { params: { companyName }, responseType: 'arraybuffer' });
                const image = `data:image/jpeg;base64,${btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                )}`;
                setCompanyLogo(image);
            }
        } catch (error) {
            console.error('Error fetching company logo:', error);
        }
    };

    const fetchCompanyBanner = async () => {
        try {
            if (companyName) { // Access companyName from state
                const response = await axios.get(`${BASE_API_URL}/banner`, { params: { companyName }, responseType: 'arraybuffer' });
                const image = `data:image/jpeg;base64,${btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                )}`;
                setCompanyBanner(image);
            }
        } catch (error) {
            console.error('Error fetching company banner:', error);
        }
    };
    const [socialMediaLinks, setSocialMediaLinks] = useState({
        facebookLink: '',
        twitterLink: '',
        instagramLink: '',
        linkedinLink: ''
    });
    const fetchSocialMediaLinks = async (companyName) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getSocialMediaLinks`, {
                params: { companyName },
            });
            const { facebookLink, twitterLink, instagramLink, linkedinLink } = response.data;
            setSocialMediaLinks({
                facebookLink,
                twitterLink,
                instagramLink,
                linkedinLink,
            });
        } catch (error) {
            console.error('Error fetching social media links:', error);
        }
    };
    useEffect(() => {
        // Extract parameters from URL
        const params = new URLSearchParams(window.location.search);
        const jobId = params.get('jobId');
        const companyId = params.get('companyId');
        const companyName = params.get('companyName');

        console.log(companyName)
        if (jobId) {
            fetchJobDetails(jobId);
        }
        if (companyName) {
            fetchCompanyLogo(companyName);
            fetchCompanyBanner(companyName);
            fetchJobsByCompany(companyName);
        }
    }, []);

    const handleCompanyIconClick = (socialMedia) => {
        let url;
        switch (socialMedia) {
            case 'Facebook':
                url = socialMediaLinks.facebookLink || `https://www.facebook.com/${companyName}`;
                break;
            case 'Twitter':
                url = socialMediaLinks.twitterLink || `https://twitter.com/${companyName}`;
                break;
            case 'Instagram':
                url = socialMediaLinks.instagramLink || `https://www.instagram.com/${companyName}`;
                break;
            case 'LinkedIn':
                url = socialMediaLinks.linkedinLink || `https://www.linkedin.com/company/${companyName}`;
                break;
            default:
                url = '';
        }
        if (url) {
            window.open(url, '_blank');
        }
    };
    const handleJobClick = async (job) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getJob`, { params: { jobId: job.jobId } });
            setJobDetails(response.data);
            // setSelectedJobId(job.jobId); // Update the selectedJobId
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

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


    const [resumes, setResumes] = useState([]);
    useEffect(() => {
        if (userId) { // Only fetch resumes if the user is logged in
            api.getResume(userId)
                .then(response => {
                    setResumes(response.data);
                })
                .catch(error => {
                    console.error('Error fetching resumes:', error);
                });
        }
    }, [userId]);
    const [resumeId, setResumeId] = useState(0);
    const [selectedResume, setSelectedResume] = useState(null); // Store selected resume details
    const handleResumeSelect = async (resume) => {
        const resumeId = resume.target.value
        setSelectedResume(resumeId);
        if (resumeId) {
            setResumeId(resumeId);
        }
    };
    const handleApplyButtonClick = (jobId) => {
        // setSelectedJobId(jobId);
        if (jobId && resumeId) {

            applyJob(jobId, resumeId);
        }
    };
    const handleCandidateClick = () => {
        openModal('candidate'); // Set modal content for candidate
        localStorage.setItem('redirectAfterLogin', 'dream-company');
    };
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [modalContent, setModalContent] = useState(''); // State to manage modal content
    const openModal = (content) => {
        setModalContent(content); // Set modal content based on button clicked
        setShowModal(true); // Open modal
    };
    useEffect(() => {
        checkHasUserApplied();
    }, [jobDetails, userId]);

    console.log(jobDetails.jobId)

    const checkHasUserApplied = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}/isJobApplied`, {
                params: { jobId: jobDetails.jobId, userId }
            });
            console.log("response   -->> " + response.data);
            // Cast the response to a boolean
            setHasUserApplied(response.data);
        } catch (error) {
            console.error('Error checking application:', error);
        }
    };
    console.log("response   -->> " + hasUserApplied);
    const [applyjobs, setApplyJobs] = useState(false);
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
                setApplyJobs(true);
                // setHasUserApplied((prev) => ({ ...prev, [jobId]: true }));

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
    const handleModalOptionClick = (option) => {
        closeModal();

        if (option === 'login') {
            if (modalContent === 'candidate') {
                navigate('/signin', { state: { userType: 'Candidate', companyId: companyId } });
            }
        }
        else if (option === 'register') {
            if (modalContent === 'candidate') {
                navigate('/candidate-signup', { state: { userType: 'Candidate' } });
            }
        }
    };
    const closeModal = () => {
        setShowModal(false); // Close modal
    };
    return (
        <div>
            <div className="custom-navbar-container">
                <CustomNavbar />
            </div>
            <div className="dashboard-container-1">
                <Row style={{ marginBottom: '20px' }}>
                    <div>
                        <Card style={{ width: '100%', height: '60%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            <Card.Body style={{ padding: 0, position: 'relative' }}>
                                <div style={{ position: 'relative', height: 'auto', maxHeight: '55%' }}>
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

                                <div style={{ position: 'absolute', top: '95%', left: '50px', transform: 'translateY(-50%)' }}>
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
                                            border: '5px solid #f0f0f0',
                                            borderRadius: '10px',
                                        }}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                    <h2 className="responsive-title">
                        <b>{companyName.toUpperCase()}</b>
                    </h2>

                    <span className="responsive-socials">
                        {socialMediaLinks.facebookLink && (
                            <a href={socialMediaLinks.facebookLink} target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={28} style={{ margin: '0 5px', color: '#3b5998' }} />
                            </a>
                        )}
                        {socialMediaLinks.twitterLink && (
                            <a href={socialMediaLinks.twitterLink} target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={28} style={{ margin: '0 5px', color: '#1da1f2' }} />
                            </a>
                        )}
                        {socialMediaLinks.instagramLink && (
                            <a href={socialMediaLinks.instagramLink} target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={28} style={{ margin: '0 5px', color: '#e4405f' }} />
                            </a>
                        )}
                        {socialMediaLinks.linkedinLink && (
                            <a href={socialMediaLinks.linkedinLink} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={28} style={{ margin: '0 5px', color: '#0077b5' }} />
                            </a>
                        )}
                    </span>
                </Row>
                <hr style={{ border: '1px solid black', marginTop: '0rem' }} />
                <Row>
                    <Col lg={9} style={{ height: 'fit-content' }}>
                        <Card style={{ top: '10%', width: '100%', height: "fit-content" }}>
                            <Card.Body style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
                                <Col md={6}>
                                    <h4>Job Description:</h4>
                                </Col>
                                <Col md={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                                    {isLoggedIn ? (
                                        user?.userRole === 'HR' ? (
                                            null
                                        ) : user?.userRole === 'Candidate' ? (
                                            hasUserApplied === true || applyjobs === true ? (
                                                <p style={{
                                                    color: '#28a745',
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#e9f5e9',
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                    textAlign: 'left',
                                                    margin: '10px 0',
                                                    boxShadow: 'rgba(0, 0, 0, 0.1)',
                                                    width: '100px',
                                                }}>
                                                    Applied
                                                </p>
                                            ) : (
                                                <>
                                                    <div className="resume-dropdown-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <h5 className="fw-bold">Select Resume</h5>
                                                        <select
                                                            id="resumeSelect"
                                                            value={selectedResume}
                                                            onChange={handleResumeSelect}
                                                            required
                                                            className="form-select"
                                                            style={{
                                                                width: '200px',
                                                                padding: '5px',
                                                                fontSize: '14px',
                                                            }}
                                                        >
                                                            <option value="">Select Resume</option>
                                                            {resumes.map((resume) => (
                                                                <option key={resume.id} value={resume.id}>
                                                                    {resume.message}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <Button
                                                        variant="success"
                                                        onClick={() => handleApplyButtonClick(jobDetails.jobId)}
                                                        disabled={!selectedResume}
                                                        style={{ marginLeft: '12px' }}
                                                    >
                                                        Apply
                                                    </Button>
                                                </>
                                            )
                                        ) : null
                                    ) : (
                                        <Button
                                            variant="success"
                                            onClick={handleCandidateClick}
                                            style={{ marginLeft: '12px' }}
                                        >
                                            Login to Apply
                                        </Button>
                                    )}
                                </Col>
                            </Card.Body>

                            <Card.Body>
                                <p><strong>Job Type:</strong> {jobDetails.jobTitle}</p>
                                <p><strong>Job Type:</strong> {jobDetails.jobType}</p>
                                <p><strong>Skills:</strong> {jobDetails.skills}</p>
                                <p><strong>Posting Date:</strong> {jobDetails.postingDate}</p>
                                <p><strong>Number of Positions:</strong> {jobDetails.numberOfPosition}</p>
                                <p><strong>Salary:</strong> {jobDetails.salary}</p>
                                <p><strong>Location:</strong> {jobDetails.location}</p>
                                <strong>Job Summary:</strong> <pre className="job-details-text">{jobDetails.jobsummary}</pre>
                                <p><strong>Application Deadline:</strong> {jobDetails.jobCategory === "evergreen" && !jobDetails.applicationDeadline ? (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>
                                        Evergreen Job-No Due Date
                                    </span>
                                ) : (
                                    jobDetails.applicationDeadline || 'Not Specified'
                                )}</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={3}>
                        <div style={{ margin: '8px', width: '250px', height: 'fit-content' }}>
                            <h3 style={{ marginTop: '20px', marginLeft: '12px', fontSize: '18px' }}>
                                Other Jobs
                            </h3>
                            {jobs.map((job) => (
                                <Card key={job.jobId} style={{ width: '250px', height: '150px' }}>
                                    <Card.Body
                                        onClick={() => handleJobClick(job)}
                                        style={{ padding: '8px' }}
                                    >
                                        <Card.Title style={{ fontSize: '14px' }}>
                                            {job.jobTitle} ({job.jobType})
                                        </Card.Title>
                                        <Card.Text style={{ fontSize: '10px' }}>
                                            <strong>Application Deadline:</strong> {job.jobCategory === "evergreen" && !job.applicationDeadline ? (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>
                                                    Evergreen Job-No Due Date
                                                </span>
                                            ) : (
                                                job.applicationDeadline || 'Not Specified'
                                            )}<br />
                                        </Card.Text>
                                        <hr style={{ backgroundColor: 'black' }} />
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                        <Button
                            onClick={() => {
                                const encodedCompanyName = encodeURIComponent(companyName);
                                navigate(`/companyPage/companyName/${encodedCompanyName}`, { state: { companyId, scrollToJobs: true } });
                            }}
                            style={{ marginTop: '10px' }}
                        >
                            View More
                        </Button>
                    </Col>
                </Row>

                <Row style={{ marginTop: '10px' }}>
                    <Footer />
                </Row>

                {/* Modal for Apply button */}
                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton style={{ backgroundColor: '#faccc', color: 'white', borderBottom: 'none' }}>
                        <Modal.Title>Choose an Option</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '20px', textAlign: 'center' }}>
                        {modalContent === 'candidate' && (
                            <>
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
                            </>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}

export default PublicJobDetailsPage
