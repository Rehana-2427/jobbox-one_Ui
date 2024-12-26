import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { FaAtom, FaBriefcase, FaFacebook, FaFileSignature, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import api from '../../apiClient'
import Footer from '../../pages/Footer'
import CompanyJobs from './CompanyJobs'
import CompanyPolicies from './CompanyPolicies'
import CompanyViewPage from './CompanyViewPage'
import DashboardLayout from './DashboardLayout '
import './HrDashboard.css'
import SocialMediaLinks from './SocialMediaLinks'


const CompanyShowCase = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName || '';
  const userEmail = location.state?.userEmail || '';
  const [userData, setUserData] = useState({});
  const [countOfHr, setCountOfHR] = useState();
  const [countOfApplications, setCountOfApplications] = useState(0);
  const [countOfActiveJobs, setCountOfActiveJobs] = useState();
  const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(0);
  const [countOfDreamApplicationsInCompany, setCountOfDreamApplicationsInCompany] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");

  const savedTab = localStorage.getItem('activeTab') || 'overview';
  const [activeTab, setActiveTab] = useState(savedTab);
  // Update localStorage whenever activeTab changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  console.log(savedTab)
  useEffect(() => {
    if (userEmail) {
      getUser(userEmail);
      countofApplicantsInCompany(userEmail);
      countOfActiveJobsInCompany(userEmail);
      countOfShortlistedCandidatesInCompany(userEmail);
      countOfDreamApplications(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userData.companyName) {
      fetchCompanyLogo(userData.companyName);
      fetchCompanyBanner(userData.companyName);
      countOfHRSInCompany(userData.companyName);
      fetchSocialMediaLinks(userData.companyName)
    }
  }, [userData.companyName]);

  const getUser = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
      setUserData(response.data);
      setCompanyName(response.data.companyName);
    } catch (error) {
      console.log(error);
    }
  };

  const countOfHRSInCompany = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countOfHRSInCompany?companyName=${companyName}`);
      console.log("Response from countOfHRSInCompany API:", response.data); // Log response for debugging
      setCountOfHR(response.data);
    } catch (error) {
      console.error("Error fetching count of HRs:", error); // Log any errors
    }
  };

  const countofApplicantsInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfApplicationByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfApplications(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const countOfActiveJobsInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfJobsPostedByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfActiveJobs(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const countOfShortlistedCandidatesInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfShortlistedCandiCompany(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const countOfDreamApplications = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countOfDreamApplications`, {
        params: { userEmail: userEmail }
      });
      setCountOfDreamApplicationsInCompany(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };


  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCompanyLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCompanyBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = async (type, file) => {
    const formData = new FormData();
    formData.append('companyName', userData.companyName);
    formData.append('file', file);
    try {
      const response = await axios.post(
        type === 'logo' ? `${BASE_API_URL}/uploadLogo` : `${BASE_API_URL}/uploadBanner`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') {
          setCompanyLogo(reader.result);
        } else {
          setCompanyBanner(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleCameraIconClick = (type) => {
    document.getElementById(`${type}Input`).click();
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


  const [reapplyMonths, setReapplyMonths] = useState(12); // Initialize state at the top level

  useEffect(() => {
    if (companyName) { // Use the condition inside the effect
      api.getHiringPolicy(companyName)
        .then((response) => {
          if (response.data) {
            const months = response.data.allowReapply ? response.data.reapplyMonths : 12;
            setReapplyMonths(months || 12); // Fallback to default if no value is provided
          }
        })
        .catch((error) => {
          console.error('Error fetching policy data:', error);
        });
    }
  }, [companyName]); // Dependency array ensures this runs only when companyName changes


  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect should always be called unconditionally
  useEffect(() => {
    if (companyName) {
      const fetchDocuments = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_API_URL}/getDocumentsByCompany`,
            { params: { companyName } }
          );
          if (response.data) {
            setDocuments(response.data); // Set documents data to state
          }
        } catch (err) {
          setError('Failed to fetch documents.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchDocuments();
    }
  }, [companyName]); // Effect will run whenever companyName changes

  // if (loading) {
  //   return <div>Loading documents...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }
  const customTabHeader = (title, icon) => (
    <div className="d-flex align-items-center">
      <span className="me-2">
        {/* <i className={icon} /> */}
        {icon}
      </span>
      <span class="fs-6 fw-bold">{title}</span>
    </div>
  );



  return (
    <DashboardLayout>
      <div className='main-container'>
        <Card style={{ width: '100%', height: '60%' }}>
          <Card.Body style={{ padding: 0, position: 'relative' }}>
            <div style={{ position: 'relative', height: '55%' }}>
              <img
                src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                alt="Company Banner"
                className="banner-image"
                onClick={() => handleCameraIconClick('banner')}
                style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
              <img
                src="https://th.bing.com/th/id/OIP.FpOpgDyazC3r8o3wowXpmwAAAA?rs=1&pid=ImgDetMain"
                alt="Edit Banner"
                className="banner-edit-icon"
                style={{
                  position: 'absolute',
                  top: '185px', right: '10px', width: '30px', height: '30px', cursor: 'pointer',
                  opacity: 0.7,
                }}
                onClick={() => handleCameraIconClick('banner')}
              />
              <input
                id="bannerInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange('banner', e.target.files[0])}
                accept="image/*"
              />
            </div>

            <div style={{ position: 'absolute', top: '95%', left: '50px', transform: 'translateY(-50%)' }}>
              <img
                src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                alt="Company Logo"
                className="logo-image"
                style={{
                  width: '200px',
                  height: '120px',
                  cursor: 'pointer',
                  clipPath: 'ellipse(50% 50% at 50% 50%)',
                  objectFit: 'cover',
                }}
                onClick={() => handleCameraIconClick('logo')}
              />
              <img
                src="https://th.bing.com/th/id/OIP.FpOpgDyazC3r8o3wowXpmwAAAA?rs=1&pid=ImgDetMain"
                alt="Edit Logo"
                className="logo-edit-icon"
                style={{
                  position: 'absolute',
                  bottom: '10px', right: '10px', width: '30px', height: '30px', cursor: 'pointer',
                  opacity: 0.7,
                }}
                onClick={() => handleCameraIconClick('logo')}
              />
              <input
                id="logoInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange('logo', e.target.files[0])}
                accept="image/*"
              />
            </div>
          </Card.Body>
        </Card>


        <Row style={{ marginTop: '50px', alignItems: 'center' }}>
          <Col md={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ margin: 0 }}><b>{userData.companyName}</b></h2>
          </Col>
          <Col md={10} style={{ display: 'flex', alignItems: 'center' }}>
            {socialMediaLinks.facebookLink && (
              <a href={socialMediaLinks.facebookLink} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} style={{ margin: '0 5px', color: '#3b5998' }} />
              </a>
            )}
            {socialMediaLinks.twitterLink && (
              <a href={socialMediaLinks.twitterLink} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={30} style={{ margin: '0 5px', color: '#1da1f2' }} />
              </a>
            )}
            {socialMediaLinks.instagramLink && (
              <a href={socialMediaLinks.instagramLink} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={30} style={{ margin: '0 5px', color: '#e4405f' }} />
              </a>
            )}
            {socialMediaLinks.linkedinLink && (
              <a href={socialMediaLinks.linkedinLink} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} style={{ margin: '0 5px', color: '#0077b5' }} />
              </a>
            )}
          </Col>
        </Row>

        <hr style={{ border: '1px solid black', margin: '30px 0' }} />

        <Row className="hr-company_page-row2" style={{ marginTop: '5px' }}>
          <Col>
            <Tabs
              activeKey={activeTab}  // Use activeKey for controlled component
              id="uncontrolled-tab-example"
              onSelect={(key) => setActiveTab(key)} // Correct way to handle tab change
            >
              <Tab
                eventKey="overview"
                title={activeTab === 'overview' ? customTabHeader("About ", <FaAtom />) : customTabHeader("About ", <FaAtom />)}
              />
              <Tab
                eventKey="jobs"
                title={activeTab === 'jobs' ? customTabHeader("Jobs  ", <FaBriefcase />) : customTabHeader("Jobs  ", <FaBriefcase />)}
              />
              <Tab
                eventKey="Company-Policy-Form"
                title={activeTab === 'Company-Policy-Form' ? customTabHeader("Add Company Policies ", <FaFileSignature />) : customTabHeader("Company Policies ", <FaFileSignature />)}
              />
              <Tab
                eventKey="social-media-links"
                title={activeTab === 'social-media-links' ? customTabHeader("Add Social Media Links ", <FaTwitter />) : customTabHeader("Social Media Links ", <FaTwitter />)}
              />
            </Tabs>
          </Col>
        </Row>

        <Row className="hr-company_page-row3">
          <Col xs={12} md={8}>
            {activeTab === 'overview' && <CompanyViewPage style={{ overflowY: 'scroll' }} />}
            {activeTab === 'jobs' && <CompanyJobs />}
            {activeTab === 'Company-Policy-Form' && <CompanyPolicies />}
            {activeTab === 'social-media-links' && <SocialMediaLinks />}
          </Col>
          <Col xs={12} md={4} style={{ paddingRight: '30px' }}>
            <Card className="key-stats" style={{ width: '100%', height: 'fit-content' }}>
              <Card.Body>
                <Row className="mb-3">
                  <h3><b>Other Information</b></h3>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Applicants: {countOfApplications}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Total HR's: {countOfHr}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Key Stats:</h5>
                    <ul>
                      <li>Active Job Postings: {countOfActiveJobs}</li>
                      <li>Shortlisted Candidates: {countOfShortlistedCandiCompany}</li>
                      <li>Avg. Time to Fill a Job: 7 days</li>
                      <li>Dream Applications: {countOfDreamApplicationsInCompany}</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="key-stats" style={{ width: '100%', height: 'fit-content' }}>
              <Card.Body>
                <h3><b>Company Policies</b></h3>
                <h4>Job Reapply Policy</h4>
                <p>
                  Candidates can reapply after <strong>{reapplyMonths}</strong> months.
                </p>
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
                            style={{ marginLeft: '10px' }}>
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
      </div>
      <Footer />

    </DashboardLayout>

  )
}
export default CompanyShowCase


