import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../apiClient";

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
    const [hasUserApplied, setHasUserApplied] = useState({});
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
        if (jobId) {
            fetchJobDetails(jobId);
        }
    }, [jobId]);
    useEffect(() => {
        if (companyId) {
            fetchCompany();
        }
    }, [companyId]);
    const fetchJobDetails = async (id) => {
        try {
            const response = await api.getJob(id)
            setJobDetails(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };
    useEffect(() => {
        if (companyName) {
            fetchCompanyLogo(companyName);
            fetchCompanyBanner(companyName);
            fetchJobsByCompany(companyName)
        }
    }, [companyName]);

    const fetchJobsByCompany = async (companyName) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getLatest5JobsByCompany`, { params: { companyName } });
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs by company:', error);
        }
    };
    const fetchCompany = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}/displayCompanyById?companyId=${companyId}`);
            if (companyName) {
                fetchCompanyLogo();  // No need to pass companyName as a parameter
                fetchCompanyBanner(); // No need to pass companyName as a parameter
                fetchSocialMediaLinks(); // Same here
            }
        } catch (error) {
            console.error('Error fetching company details:', error);
        }
    };
    useEffect(() => {
        const filterUnappliedJobs = jobs.filter(job => !hasUserApplied[job.jobId] && job.jobId !== selectedJobId);
        setUnappliedJobs(filterUnappliedJobs);
    }, [jobs, hasUserApplied, selectedJobId]);


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
            setSelectedJobId(job.jobId); // Update the selectedJobId
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };
    return (
        <div>
            <div className='dashboard-container' style={{ height: '60%' }}>
                <Col >
                    <Card style={{ width: '100%' }}>
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
                                <label htmlFor="logoInput">
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
                                </label>
                            </div>
                            <div>
                                <h1 style={{ position: 'absolute', top: '112%', right: '100px' }}>{companyName}</h1>
                                <div className='social-icons-company' style={{ position: 'absolute', top: '125%', right: '60px' }}>
                                    <FaFacebook size={30}
                                        onClick={() => handleCompanyIconClick('Facebook')}
                                        style={{ cursor: 'pointer', color: '#4267B2', margin: '5px' }}
                                    />
                                    <FaTwitter size={30}
                                        onClick={() => handleCompanyIconClick('Twitter')}
                                        style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#1DA1F2', margin: '5px' }}
                                    />
                                    <FaInstagram size={30}
                                        onClick={() => handleCompanyIconClick('Instagram')}
                                        style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#C13584', margin: '5px' }}
                                    />
                                    <FaLinkedin size={30}
                                        onClick={() => handleCompanyIconClick('LinkedIn')}
                                        style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#0077B5', margin: '5px' }}
                                    />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </div>
            <Row style={{ position: 'absolute', top: '50%', width: '100%' }}>
                <Col lg={9} style={{ height: 'fit-content' }}>
                    <Card style={{ top: '10%', width: '100%', height: "fit-content" }}>
                        <Card.Body>
                            <p><strong>Job Type:</strong> {jobDetails.jobTitle}</p>
                            <p><strong>Job Type:</strong> {jobDetails.jobType}</p>
                            <p><strong>Skills:</strong> {jobDetails.skills}</p>
                            <p><strong>Posting Date:</strong> {jobDetails.postingDate}</p>
                            <p><strong>Number of Positions:</strong> {jobDetails.numberOfPosition}</p>
                            <p><strong>Salary:</strong> {jobDetails.salary}</p>
                            <p><strong>Location:</strong> {jobDetails.location}</p>
                            <strong>Job Summary:</strong> <pre className="job-details-text">{jobDetails.jobsummary}</pre>
                            <p><strong>Application Deadline:</strong>  {jobDetails.jobCategory === "evergreen" && !jobDetails.applicationDeadline ? (
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
                            {/* <Button style={{ position: 'relative', left: '20%', marginTop: '12px', fontSize: '12px' }}>Apply</Button> */}
                        </h3>
                        {unappliedJobs.map((job) => (
                            <Card key={job.jobId} style={{ width: '250px', height: '150px' }}>
                                <Card.Body
                                    onClick={() => handleJobClick(job)}
                                    style={{ padding: '8px' }}
                                >
                                    <Card.Title style={{ fontSize: '14px' }}>{job.jobTitle} ({job.jobType})</Card.Title>
                                    <Card.Text style={{ fontSize: '10px' }}>
                                        <strong>Application Deadline:</strong>  {job.jobCategory === "evergreen" && !job.applicationDeadline ? (
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
                            const encodedCompanyName = encodeURIComponent(companyName); // Encode the company name
                            navigate(`/companyPage/companyName/${encodedCompanyName}?activetab=jobs`, { state: { companyId } });
                        }}
                        style={{ marginTop: '10px' }}
                    >
                        View More
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default PublicJobDetailsPage
