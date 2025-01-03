import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { FaAtom, FaBriefcase, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../../apiClient';
import ResumeSelectionPopup from '../../Dashboards/CandidateDashboardpages/ResumeSelectionPopup';
import CustomNavbar from '../CustomNavbar';
import Footer from '../Footer';
import './Company.css';
import CompanyJobs from './CompanyJobs';
import CompanyOverView from './CompanyOverView';

const EachCompanyPage = () => {
  const location = useLocation();
  const { state } = location;
  const { companyId, scrollToJobs } = state || {}; // Destructure the state
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState(null);
  const [countOfApplications, setCountOfApplications] = useState(0);
  const [countOfHR, setCountOfHR] = useState(0);
  const [countOfJobs, setCountOfJobs] = useState(0);
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");
  const { companyName } = useParams();  // Get companyName from URL


  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalContent, setModalContent] = useState(''); // State to manage modal content
  const [countOfTotalJobs, setCountOfTotalJobs] = useState();
  const [companyWebsite, setCompanyWebsite] = useState("");  // Added for company website

  const navigate = useNavigate();
  const jobsSectionRef = useRef(null);

  console.log("Company Name:", companyName);  // Check if companyName is printing correctly
  console.log("Company ID:", companyId);      // Check if companyId is passed correctly

  const [error, setError] = useState(null);  // For error handling


  console.log(companyName)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const activeTabParam = params.get('activetab');

    if (scrollToJobs) {
      setActiveTab('jobs'); // Automatically set to 'jobs' if scrollToJobs is true
      if (jobsSectionRef.current) {
        jobsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (activeTabParam) {
      setActiveTab(activeTabParam); // Set the active tab based on the URL parameter
    } else {
      setActiveTab('overview'); // Default to overview if no parameter is found
    }
    // Fetch company details using the companyName from URL
    fetchCompany(companyName);
    fetchData();
    checkCompanyExists(companyName);
  }, [companyName, scrollToJobs]); // Re-fetch if companyName or scrollToJobs changesnpm start

  // Check if company exists in the database
  const checkCompanyExists = async (companyName) => {
    try {
      const response = await api.checkCompanyByName(companyName); // Check if company exists
      if (response.status === 200) {
        fetchCompany(companyName);  // If company exists, fetch details
      } else {
        setError('Company not found in Jobbox');
      }
    } catch (error) {
      setError('Company not found in Jobbox');
    }
  };

  const fetchCompany = async (companyName) => {
    try {
      const response = await api.getCompanyByCompanyName(companyName);  // Fetch company data using API
      const companyData = response.data;

      setCompany(companyData);
      setCompanyLogo(companyData.companyLogo);
      setCompanyBanner(companyData.companyBanner);
      // If companyName exists, fetch additional information like logo, banner, social media links
      fetchCompanyLogo(companyData.companyName);
      fetchCompanyBanner(companyData.companyName);
      fetchSocialMediaLinks(companyData.companyName);
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };



  const fetchData = async () => {
    try {
      const fetchCountOfApplicationByCompany = await api.getCountOfApplicationsByCompany(companyName);
      setCountOfApplications(fetchCountOfApplicationByCompany.data);

      const fetchCountOfHRByCompany = await api.getCountOfHRByCompany(companyName);
      setCountOfHR(fetchCountOfHRByCompany.data);

      const countOfJobsByCompany = await api.getCountOfActiveJobsByCompany(companyName);
      setCountOfJobs(countOfJobsByCompany.data);

      const fetchCountOfTotalJobsByCompany = await api.getCountOfTotalJobsByCompany(companyName);
      setCountOfTotalJobs(fetchCountOfTotalJobsByCompany.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


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
    localStorage.setItem('redirectAfterLogin', 'dream-company');
  };
  const [resumeId, setResumeId] = useState(0);
  const [selectedResume, setSelectedResume] = useState(null); // Store selected resume details

  const handleResumeSelect = async (resume) => {
    const resumeId = resume.target.value
    setSelectedResume(resumeId);
    if (resumeId) {
      setResumeId(resumeId);
      setShowResumePopup(false);  // Close the resume selection popup
    }
  };
  const handleModalOptionClick = (option) => {
    closeModal();

    if (option === 'login') {
      if (modalContent === 'hr') {
        navigate('/hr-sign-in', { state: { userType: 'HR' } }); // Pass user type as state
      }
      else if (modalContent === 'candidate') {
        navigate('/signin', { state: { userType: 'Candidate', companyId: companyId } });
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

  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    linkedinLink: ''
  });

  const fetchSocialMediaLinks = async (companyName) => {
    try {
      const response = await api.getSocialMediaLinks(companyName);
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

  const [showResumePopup, setShowResumePopup] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [hasDreamApplied, setHasDreamApplied] = useState(false);


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

      const response = await api.applyDreamCompany(userId, companyName, formattedDate, resumeId);

      if (response.data) {
        Swal.close();
        await Swal.fire({
          icon: "success",
          title: "Apply Successful!",
          text: "You have successfully applied for this job."
        });
        setHasDreamApplied(true);
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

  useEffect(() => {
    if (userId && companyName) {
      checkHasUserDreamApplied();
    }
  }, [companyName, userId]);
  const checkHasUserDreamApplied = async () => {
    try {
      if (!userId || !companyName) return;
      const response = await api.checkDreamCompanyAppliedOrNot(userId, companyName)
      setHasDreamApplied(response.data)
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };

  const handleApplyCompany = () => {
    if (companyName.trim() === '') {
      toast.error('Please enter the company name before selecting a resume.');
      return;
    }
    else if (!resumeId || !userId || !companyName) {
      toast.error('Please select a resume.');
      return;
    }
    applyJob(resumeId);
  };

  const customTabHeader = (title, icon) => (
    <div className="d-flex align-items-center">
      <span className="me-2">
        {/* <i className={icon} /> */}
        {icon}
      </span>
      <span class="fs-6 fw-bold">{title}</span>
    </div>
  );


  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  // useEffect should always be called unconditionally
  useEffect(() => {
    if (companyName) {
      const fetchDocuments = async () => {
        setLoading(true);
        try {
          const response = await api.getPolicyDocuments(companyName)
          if (response.data) {
            setDocuments(response.data); // Set documents data to state
          }
        } catch (err) {
          console.error('Error fetching policy data:', err);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchDocuments();
    }
  }, [companyName]); // Effect will run whenever companyName changes

  const [reapplyMonths, setReapplyMonths] = useState(12); // Default to 12 months

  useEffect(() => {
    if (companyName) {
      // Fetch policy data when the component is mounted  
      api.getHiringPolicy(companyName).then((response) => {
        if (response.data) {
          const months = response.data.allowReapply ? response.data.reapplyMonths : 12;
          setReapplyMonths(months || 12); // Fallback to default if no value is provided
        }
      })
        .catch((error) => {
          console.error('Error fetching policy data:', error);
        });
    }
  }, [companyName]);

  return (
    <div>
      <div className="custom-navbar-container">
        <CustomNavbar />
      </div>
      <div>
        <div className='dashboard-container-1'>
          {error ? (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <img
                src="https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif"
                alt="Not Found"
                style={{ width: '150px', height: 'auto', marginBottom: '20px' }}
              />
              <h2>{error}</h2>
            </div>
          ) : (
            <div style={{ overflowX: 'hidden' }}>
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
                            border: '5px solid #f0f0f0', // Adds a black border around the image
                            borderRadius: '10px', // Optional: adds rounded corners to the border
                          }}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                {/* </Row>

              <Row style={{ marginTop: '5%', alignItems: 'center', marginLeft: '1%' }}> */}
                {/* <Col md={3} style={{ display: 'flex', alignItems: 'end', justifyContent: 'center'}}> */}
                <h2 className="responsive-title">
                  <b>{companyName.toUpperCase()}</b>
                </h2>
                {/* </Col> */}
                {/* <Col md={9} style={{ display: 'flex', alignItems: 'end' }}> */}
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
                    </ a>
                  )}
                </span>
                {/* </Col> */}
              </Row>
              <hr style={{ border: '1px solid black', marginTop: '0rem' }} />
              <Row style={{ marginBottom: '0', paddingBottom: '0' }}>
                <Col md={2} style={{ marginLeft: '10px' }}>
                  <Tabs activeKey={activeTab} onSelect={(key) => handleTabClick(key)} style={{ marginBottom: '20px' }}>
                    <Tab eventKey="overview" title={customTabHeader("About  ", <FaAtom />)}></Tab>
                    <Tab eventKey="jobs" title={customTabHeader("Jobs  ", <FaBriefcase />)}></Tab>
                  </Tabs>
                </Col>
              </Row>
              <Row style={{ marginBottom: '0', paddingBottom: '0' }}>
                {/* Main Content */}
                <Col xs={12} md={9} style={{ marginBottom: '20px' }}>
                  {activeTab === 'home' && (
                    <div>
                      <Card
                        onClick={() => handleTabClick('overview')}
                        style={{ cursor: 'pointer', width: '100%', marginBottom: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                      >
                        <Card.Body>
                          <h3>About {companyName}</h3>
                          <p>Click to view Overview content...</p>
                        </Card.Body>
                      </Card>
                      <Card
                        onClick={() => handleTabClick('jobs')}
                        style={{ cursor: 'pointer', width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                      >
                        <Card.Body>
                          <h3>Jobs</h3>
                          <p>Click to view Jobs content...</p>
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                  {activeTab === 'overview' && <CompanyOverView />}
                  {activeTab === 'jobs' && <CompanyJobs />}
                </Col>

                {/* Sidebar */}
                <Col xs={12} md={3}>
                  {/* Key Stats Card */}
                  <Card className="key-stats" style={{ width: '100%', marginBottom: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <Card.Body>
                      {isLoggedIn ? (
                        user?.userRole === 'HR' ? null : user?.userRole === 'Candidate' ? (
                          hasDreamApplied ? (
                            <p style={{ color: '#28a745', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#e9f5e9', padding: '10px', borderRadius: '5px', textAlign: 'left', margin: '10px 0', boxShadow: 'rgba(0, 0, 0, 0.1)', width: '100px' }}>
                              Applied
                            </p>
                          ) : (
                            <>
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
                              <Button
                                variant="success"
                                onClick={handleApplyCompany}
                                disabled={!selectedResume}
                                style={{ marginTop: '10px' }}
                              >
                                Apply
                              </Button>
                            </>
                          )
                        ) : (
                          <Button variant="primary" style={{ marginRight: '12px' }} onClick={handleHRClick}>
                            Claim/Login
                          </Button>
                        )
                      ) : (
                        <>
                          <Button variant="primary" onClick={handleHRClick}>
                            Claim/Login
                          </Button>
                          <Button variant="success" onClick={handleCandidateClick} style={{ marginLeft: '12px' }}>
                            Login to Apply
                          </Button>
                        </>
                      )}

                      <div style={{ marginBottom: '16px' }}>
                        <h5>Applicants: {countOfApplications}</h5>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <h5>HR mapped: {countOfHR > 0 ? 'Yes' : 'No'}</h5>
                        <h5>Total HR 's: {countOfHR}</h5>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <h5>Total Jobs: {countOfTotalJobs}</h5>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <h5>Key Stats:</h5>
                        <ul>
                          <li>Total Active Jobs: {countOfJobs}</li>
                          <li>Avg. Time to Fill a Job: 7 days</li>
                          <li>Top Searched Job: Software Engineer</li>
                        </ul>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Company Policies Card */}
                  <Card className="key-stats" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <Card.Body>
                      <h3><b>Company Policies</b></h3>
                      <h4>Job Reapply Policy</h4>
                      <p>Candidates can reapply after <strong>{reapplyMonths}</strong> months.</p>
                      {documents.length === 0 ? (
                        <p>No documents available for this company.</p>
                      ) : (
                        <div>
                          {documents.map((document) => (
                            <div key={document.documentId} style={{ marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <strong>{document.documentTitle}:</strong>
                                <a
                                  href={`data:application/octet-stream;base64,${document.documentFile}`}
                                  download={document.documentTitle}
                                  className="btn btn-primary"
                                  style={{ marginLeft: '10px' }}
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row style={{ marginTop: '10px' }}>
                <Footer />
              </Row>
            </div>
          )}

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
        <div>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
      </div>
    </div>
  );
};

export default EachCompanyPage;
