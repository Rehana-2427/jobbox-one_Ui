import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from '../../pages/Footer';
import DashboardLayout from './DashboardLayout';
import ResumeSelectionPopup from './ResumeSelectionPopup';

const JobDescription = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const [queryParams, setQueryParams] = React.useState({});
    useEffect(() => {
        const queryString = location.search; // Use location.search to get the query string
        const params = new URLSearchParams(queryString);
        const companyName = decodeURIComponent(params.get('companyName')); // Decoding the company name        
        const jobId = params.get('jobId');
        const userId = params.get('userId');
        const userName = decodeURIComponent(params.get('userName')); // Decoding the user name
        setQueryParams({ companyName, jobId, userId, userName });
    }, [location]);

    const { companyName, jobId, userId, userName } = queryParams;
    console.log(companyName + jobId + userId + userName);
    console.log(companyName)
    const [applyjobs, setApplyJobs] = useState();
    const [hasUserApplied, setHasUserApplied] = useState({});
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showResumePopup, setShowResumePopup] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [unappliedJobs, setUnappliedJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [companyLogo, setCompanyLogo] = useState("");
    const [companyBanner, setCompanyBanner] = useState("");
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
    console.log(userName)

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

    const handleApplyButtonClick = (jobId) => {
        setSelectedJobId(jobId);
        setShowResumePopup(true);
        console.log("Apply button click");
    };

    const applyJob = async (jobId, resumeId) => {
        let loadingPopup;
        try {
            // Show loading message using SweetAler
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
                Swal.close();
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
        }
        finally {     // Ensure loading popup is closed if still open
            if (loadingPopup) {
                Swal.close();
            }
        }
    };
    const handleResumeSelect = async (resumeId) => {
        if (selectedJobId && resumeId) {
            await applyJob(selectedJobId, resumeId);
            setSelectedJobId(null);
            setShowResumePopup(false);
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
        if (jobId && userId) {
            checkIfApplied(jobId, userId);
        }
    }, [jobId, userId]);

    const checkIfApplied = async (jobId, userId) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/applicationApplied`, { params: { jobId, userId } });
            setHasUserApplied(response.data);
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    useEffect(() => {
        const filterUnappliedJobs = jobs.filter(job => !hasUserApplied[job.jobId] && job.jobId !== selectedJobId);
        setUnappliedJobs(filterUnappliedJobs);
    }, [jobs, hasUserApplied, selectedJobId]);

    const handleOtherJobClick = (jobId) => {
        fetchJobDetails(jobId);
        setSelectedJobId(jobId);
        checkIfApplied(jobId, userId);
    };


    const navigate = useNavigate();
    console.log(companyName)
    console.log(userId)
    return (
        <DashboardLayout>


            <div className="main-content">
                <Row style={{ marginBottom: '20px' }}>
                    <Card style={{ width: '100%', height: '60%' }}>
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
                                        border: '5px solid #f0f0f0', // Adds a black border around the image
                                        borderRadius: '10px', // Optional: adds rounded corners to the border
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>

                    {/* </Row>

              <Row style={{ marginTop: '5%', alignItems: 'center', marginLeft: '1%' }}> */}
                    {/* <Col md={3} style={{ display: 'flex', alignItems: 'end', justifyContent: 'center'}}> */}
                    <h2 className="responsive-title">
                        <b>{companyName}</b>
                    </h2>

                    {/* </Col> */}
                    {/* <Col md={9} style={{ display: 'flex', alignItems: 'end' }}> */}
                    {/* <span className="responsive-socials">
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
                    </span> */}
                    {/* </Col> */}
                </Row>
                <hr style={{ border: '1px solid black', marginTop: '0rem' }} />

                <Container style={{ width: '100%', marginTop: "30px" }}>
                    <Row>
                        <Col lg={9} style={{ height: 'fit-content' }}>
                            <Card style={{ top: '10%', width: '100%', height: "fit-content" }}>
                                <Card.Header>
                                    <Card.Title style={{ height: '30px' }}>
                                        <h2 style={{ position: 'relative', top: '8%' }}>Job Description</h2>
                                        {hasUserApplied ? (
                                            <p style={{ position: 'relative', bottom: '100%', left: '90%', color: 'green' }}><strong>Applied</strong></p>
                                        ) : (
                                            <Button style={{ position: 'relative', bottom: '100%', left: '90%' }} onClick={() => handleApplyButtonClick(jobId)}>Apply</Button>
                                        )}
                                    </Card.Title>
                                </Card.Header>
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
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <div style={{ margin: '8px', width: '250px', height: 'fit-content' }}>
                                <h3 style={{ marginTop: '20px', marginLeft: '12px', fontSize: '18px' }}>
                                    Other Jobs
                                </h3>
                                {unappliedJobs.map((job) => (
                                    <Card key={job.jobId} style={{ width: '250px', height: '150px' }}>
                                        <Card.Body
                                            onClick={() => {
                                                const baseUrl = '/#/candidate-dashboard/jobs/job-description/';

                                                const params = new URLSearchParams({
                                                    companyName: encodeURIComponent(job.companyName || ''),
                                                    jobId: encodeURIComponent(job.jobId || ''),
                                                    userId: encodeURIComponent(userId || ''),
                                                    userName: encodeURIComponent(userName || '')
                                                }).toString();

                                                // Construct the final URL with parameters after the hash
                                                const fullUrl = `${window.location.origin}${baseUrl}?${params}`;

                                                // Open the final URL in a new tab
                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                            }}
                                            style={{ padding: '8px' }}
                                            title={job.jobCategory === "evergreen" ? "This position is always open for hiring, feel free to apply anytime!" : ""}
                                        >
                                            <Card.Title style={{ fontSize: '14px' }}>
                                                {job.jobTitle} ({job.jobType})
                                            </Card.Title>

                                            <Card.Text style={{ fontSize: '10px' }}>
                                                <strong>Application Deadline:</strong>
                                                {job.applicationDeadline ? (
                                                    job.applicationDeadline
                                                ) : (
                                                    <span style={{ color: 'green', fontWeight: 'bold' }}>Evergreen Job</span>
                                                )}
                                                <br />
                                            </Card.Text>

                                            <hr style={{ backgroundColor: 'black' }} />
                                        </Card.Body>
                                    </Card>
                                ))}

                            </div>
                            <Button
                                onClick={() =>
                                    navigate('/candidate-dashboard/jobs/job-description/view-more', {
                                        state: { companyName: companyName, userId: userId, userName: userName }
                                    })
                                }
                                style={{ marginTop: '10px' }}
                            >
                                View More

                            </Button>
                        </Col>
                    </Row>
                </Container>
                {showResumePopup && (
                    <ResumeSelectionPopup
                        resumes={resumes}
                        onSelectResume={handleResumeSelect}
                        show={true}
                        onClose={() => setShowResumePopup(false)}
                    />
                )}
            </div>
            <Footer />
        </DashboardLayout>
    );
};
export default JobDescription;