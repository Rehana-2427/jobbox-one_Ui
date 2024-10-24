import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ResumeSelectionPopup from '../../Dashboards/CandidateDashboardpages/ResumeSelectionPopup';
import HomeFooter from '../HomeFooter';
import CompanyJobs from './CompanyJobs';
import CompanyOverView from './CompanyOverView';

const EachCompanyPage = () => {
  // const BASE_API_URL = 'http://51.79.18.21:8082/api/jobbox';
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const { state } = location;
  const { companyId, scrollToJobs } = state || {}; // Destructure the state

  // const [queryParams, setQueryParams] = React.useState({});

  // React.useEffect(() => {
  //     const queryString = window.location.href.split('#')[0].split('?')[1];
  //     const params = new URLSearchParams(queryString);

  //     const companyName1 = params.get('companyName');
  //     const companyId = params.get('companyId');


  //     setQueryParams({ companyName, companyId });
  // }, [location]);

  // const { companyName1, companyId} = queryParams;
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState(null);
  const [countOfApplications, setCountOfApplications] = useState(0);
  const [countOfHR, setCountOfHR] = useState(0);
  const [countOfJobs, setCountOfJobs] = useState(0);
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalContent, setModalContent] = useState(''); // State to manage modal content
  const [countOfTotalJobs, setCountOfTotalJobs] = useState();
  const [companyWebsite, setCompanyWebsite] = useState("");  // Added for company website

  const navigate = useNavigate();
  const jobsSectionRef = useRef(null);


  useEffect(() => {
    if (companyId) {
      fetchCompany();
      fetchData();

    }
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/displayCompanyById?companyId=${companyId}`);
      const companyData = response.data;

      // Now use companyData instead of company directly
      console.log(companyData.companyName);  // This should log the correct companyName

      setCompany(companyData);  // Update state

      console.log(companyData.companyName);  // This should log the correct companyName
      setCompanyName(companyData.companyName);
      setCompanyWebsite(companyData.websiteLink);  // Set company website
      if (companyData.companyName) {
        fetchCompanyLogo(companyData.companyName);
        fetchCompanyBanner(companyData.companyName);
        fetchSocialMediaLinks(companyData.companyName)
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const fetchData = async () => {
    try {
      const fetchCountOfApplicationByCompany = await axios.get(`${BASE_API_URL}/countOfApplicationsByCompany?companyId=${companyId}`);
      setCountOfApplications(fetchCountOfApplicationByCompany.data);

      const fetchCountOfHRByCompany = await axios.get(`${BASE_API_URL}/countOfHRByCompany?companyId=${companyId}`);
      setCountOfHR(fetchCountOfHRByCompany.data);

      const countOfJobsByCompany = await axios.get(`${BASE_API_URL}/countOfJobsByCompany?companyId=${companyId}`);
      setCountOfJobs(countOfJobsByCompany.data);

      const fetchCountOfTotalJobsByCompany = await axios.get(
        `${BASE_API_URL}/countOfTotalJobsByCompany?companyId=${companyId}`
      );
      setCountOfTotalJobs(fetchCountOfTotalJobsByCompany.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'jobs' && jobsSectionRef.current) {
      jobsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // useEffect to check if scrollToJobs is true
  useEffect(() => {
    if (scrollToJobs) {
      setActiveTab('jobs'); // Automatically set to 'jobs' if scrollToJobs is true
      if (jobsSectionRef.current) {
        jobsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [scrollToJobs]);
  const openModal = (content) => {
    setModalContent(content); // Set modal content based on button clicked
    setShowModal(true); // Open modal
  };

  const closeModal = () => {
    setShowModal(false); // Close modal
  };

  const handleHRClick = () => {
    openModal('hr'); // Set modal content for HR
  };

  const handleCandidateClick = () => {
    openModal('candidate'); // Set modal content for candidate
  };


  const handleResumeSelect = async (resumeId) => {
    if (resumeId) {
      // If saving is successful, then apply for the job
      await applyJob(resumeId);

      // Close the resume selection popup
      setShowResumePopup(false);
    }
  };
  const handleModalOptionClick = (option) => {
    closeModal();

    if (option === 'login') {
      if (modalContent === 'hr') {
        navigate('/hr-sign-in', { state: { userType: 'HR' } }); // Pass user type as state
      }
      else if (modalContent === 'candidate') {
        navigate('/signin', { state: { userType: 'Candidate' } });
      }
    }
    else if (option === 'register') {
      if (modalContent === 'hr') {
        navigate('/hr-signup', { state: { companyName: companyName, companyWebsite: companyWebsite } }); // Pass user type as state
      } else {
        navigate('/candidate-signup', { state: { userType: 'Candidate' } });
      }
    }
  };

  console.log(companyName)

  console.log(companyWebsite)


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
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [hasDreamApplied, setHasDreamApplied] = useState(false);


  useEffect(() => {
    if (userId) { // Only fetch resumes if the user is logged in
      axios.get(`${BASE_API_URL}/getResume?userId=${userId}`)
        .then(response => {
          setResumes(response.data);
        })
        .catch(error => {
          console.error('Error fetching resumes:', error);
        });
    }
  }, [userId]);

  const applyJob = async (resumeId) => {
    if (!userId) { // If user is not logged in, do not proceed
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please login to apply for a job.',
      });
      return;
    }

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

      const appliedOn = new Date();
      const year = appliedOn.getFullYear();
      const month = String(appliedOn.getMonth() + 1).padStart(2, '0');
      const day = String(appliedOn.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      // Call the backend to apply for the job
      const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${companyName}&formattedDate=${formattedDate}&resumeId=${resumeId}`);

      if (response.data) {
        Swal.close();

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Apply Successful!",
          text: "You have successfully applied for this job."
        });

        // Set hasDreamApplied to true after successful application
        setHasDreamApplied(true);

        setCompanyName(''); // Reset company name
      }
    } catch (error) {
      console.error('Error applying for job:', error);

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
      if (loadingPopup) {
        Swal.close();
      }
    }
  };

  useEffect(() => {
    if (userId && companyName) { // Check application only if user is logged in and company name is available
      checkHasUserDreamApplied();
    }
  }, [companyName, userId]);

  const checkHasUserDreamApplied = async () => {
    try {
      if (!userId || !companyName) return; // Ensure both userId and companyName are present

      const response = await axios.get(`${BASE_API_URL}/applicationDreamAplied`, {
        params: { userId: userId, companyName: companyName }
      });

      setHasDreamApplied(response.data); // Set the result (true or false)
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };


  console.log(userId)

  const handleApplyCompany = () => {
    setShowResumePopup(true);
  };

  return (
    <div>
      <div className='dashboard-container'>
        <Col>
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
              <div style={{ position: 'absolute', top: '55%', left: '50px', transform: 'translateY(-50%)' }}>
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
                <h1 style={{ position: 'absolute', top: '60%', right: '100px' }}>{companyName}</h1>
                <div className='social-icons-company' style={{ position: 'absolute', top: '70%', right: '60px' }}>
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
              <div
                style={{
                  position: 'absolute',
                  top: '80%',
                  left: '5%',
                  transform: 'translateX(-5%)',
                  width: '90%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  overflowX: 'auto',
                  boxSizing: 'border-box',
                }}
              >
                <ul
                  className="nav-links"
                  style={{
                    listStyleType: 'none',
                    display: 'flex',
                    margin: 0,
                    padding: 0,
                    flexWrap: 'wrap',
                  }}
                >
                  <li>
                    <span>
                      <a
                        onClick={() => handleTabClick('overview')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleTabClick('overview');
                          }
                        }}
                        tabIndex="0"
                        className={`tab-link ${activeTab === 'overview' ? 'active' : 'inactive'}`}
                        role="button"
                        style={{
                          textDecoration: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        About
                      </a>
                    </span>
                  </li>

                  <li>
                    <span ref={jobsSectionRef}>
                      <a onClick={() => handleTabClick('jobs')} className={`tab-link ${activeTab === 'jobs' ? 'active' : 'inactive'}`}>
                        Jobs
                      </a>
                    </span>
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>

          <Row>
            <Col xs={12} md={8}>
              {activeTab === 'home' && (
                <div>
                  <Card onClick={() => handleTabClick('overview')} style={{ cursor: 'pointer', marginTop: '20px', width: '100%' }}>
                    <Card.Body>
                      <h3>About {companyName}</h3>
                      <p>Click to view Overview content...</p>
                    </Card.Body>
                  </Card>

                  <Card onClick={() => handleTabClick('jobs')} style={{ cursor: 'pointer', marginTop: '20px', width: '100%' }}>
                    <Card.Body>
                      <h3 >Jobs</h3>
                      <p>Click to view Jobs content...</p>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {activeTab === 'overview' && (
                <div style={{ marginTop: '20px' }}>
                  <CompanyOverView companyId={companyId} />
                </div>
              )}
              {activeTab === 'jobs' && (
                <div ref={jobsSectionRef} style={{ marginTop: '20px' }}>
                  <CompanyJobs companyId={companyId} />
                </div>
              )}
            </Col>

            <Col xs={12} md={4}>
              <Card className='key-stats' style={{ width: '80%', height: 'fit-content' }}>
                <Card.Body>
                  <Row className="mb-3">
                    <Col>
                      {isLoggedIn ? (
                        user?.userRole === 'HR' ? (
                          null // No buttons for HR
                        ) : user?.userRole === 'Candidate' ? (
                          hasDreamApplied ? ( // Check if the user has already applied
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
                              width: '100px'
                            }}>
                              Applied
                            </p>
                          ) : (
                            <Button variant="success" onClick={handleApplyCompany}>Apply</Button>
                          )
                        ) : (
                          <Button
                            variant="primary"
                            style={{ marginRight: '12px' }}
                            onClick={handleHRClick}
                          >
                            Claim/Login
                          </Button>
                        )
                      ) : (
                        <>
                          <Button variant="primary" onClick={handleHRClick}  >
                            Claim/Login
                          </Button>
                          <Button variant="success" onClick={handleCandidateClick} style={{ marginLeft: '12px' }}>
                            Login to Apply
                          </Button>
                        </>
                      )}
                    </Col>


                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <h5>Applicants: {countOfApplications}</h5>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <h5>HR mapped: {countOfHR > 0 ? 'Yes' : 'No'}</h5>
                      <h5>Total HR's: {countOfHR}</h5>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <h5>Total Jobs: {countOfTotalJobs}</h5>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <h5>Key Stats:</h5>
                      <ul>
                        <li>Total Active Jobs: {countOfJobs}</li>
                        <li>Avg. Time to Fill a Job: 7 days</li>
                        <li>Top Searched Job: Software Engineer</li>
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Row >
              <HomeFooter />
            </Row>

          </Row>

        </Col>

        {showResumePopup && (
          <ResumeSelectionPopup
            resumes={resumes}
            onSelectResume={handleResumeSelect}
            onClose={() => setShowResumePopup(false)}
          />
        )}
        {/* Modal for Apply button */}
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton style={{ backgroundColor: '#faccc', color: 'white', borderBottom: 'none' }}>
            <Modal.Title>Choose an Option</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '20px', textAlign: 'center' }}>
            {modalContent === 'hr' && (
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
  );
};

export default EachCompanyPage;
