import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, FormGroup, Modal } from 'react-bootstrap';
import { FaEdit, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

// const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
const BASE_API_URL = process.env.REACT_APP_API_URL;
const CompanyDetailsByAdmin = () => {

  const navigate = useNavigate();
  const [editableCompanyDetails, setEditableCompanyDetails] = useState(false);
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");
  const [companyDetails, setCompanyDetails] = useState({
    location: '',
    headquaters: '',
    overView: '',
    websiteLink: '',
    companySize: '',
    industryService: '',
    year: '',
    specialties: ''
  });


  const location = useLocation();

  const { currentAdminCompanyPage, companyName, currentAdminCompanyPageSize } = location.state || {}

  // Fetch company details when component mounts
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/getCompanyByName?companyName=${companyName}`);
        setCompanyDetails(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, [companyName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };
  const handleSave = async () => {
    try {
      const response = await axios.put(`${BASE_API_URL}/updateCompanyDetailsByAdmin?companyName=${companyName}`, companyDetails);
      console.log(response.data); 
      setCompanyDetails({ ...companyDetails }); 
      setEditableCompanyDetails(false); 
    } catch (error) {
      console.error('Error updating company details:', error);
      // Handle error state or display error message to user
    }
  };

  const handleCameraIconClick = (type) => {
    document.getElementById(`${type}Input`).click();
  };
  const handleFileChange = async (type, file) => {
    const formData = new FormData();
    formData.append('companyName', companyName);
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
    if (companyName) {
      fetchCompanyLogo(companyName);
      fetchCompanyBanner(companyName);
      fetchSocialMediaLinks(companyName)
    }
  }, [companyName])

  const [showModal, setShowModal] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    linkedinLink: ''
  });


  const handleCloseModal = () => setShowModal(false);

  const handleSocialInputChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
    }));
  };

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
  const handleSaveLinks = async () => {
    try {
      // Save the updated social media links
      await axios.put(`${BASE_API_URL}/updateSocialMediaLinks?companyName=${companyName}`, {
        facebookLink: socialMediaLinks.facebookLink,
        twitterLink: socialMediaLinks.twitterLink,
        instagramLink: socialMediaLinks.instagramLink,
        linkedinLink: socialMediaLinks.linkedinLink
      });

      // Update the state with the new links
      setSocialMediaLinks({
        facebookLink: socialMediaLinks.facebookLink,
        twitterLink: socialMediaLinks.twitterLink,
        instagramLink: socialMediaLinks.instagramLink,
        linkedinLink: socialMediaLinks.linkedinLink
      });

      handleCloseModal(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating social media links:', error.response ? error.response.data : error.message);
    }
  };

  const handleBack = () => {
    const state1 = location.state || {};
    console.log(state1)
    navigate("/admin-dashboard/add-company-details", { state: { companyName: companyName, currentAdminCompanyPage, currentAdminCompanyPageSize } })
    console.log("sending current page", currentAdminCompanyPage)

  };

  const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };
  return (
    <div className='dashboard-container'>
      <div>
        <button className="hamburger-icon" onClick={toggleLeftSide} >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
      <AdminleftSide onClose={toggleLeftSide} />
      </div>
      <div className="right-side">
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
              <input
                id="bannerInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange('banner', e.target.files[0])}
                accept="image/*"
              />
            </div>
            <div style={{ position: 'absolute', top: '55%', left: '50px', transform: 'translateY(-50%)' }}>
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
            <div>
              <h1 style={{ position: 'absolute', top: '70%', right: '100px' }}>{companyName}</h1>
              <div className='social-icons-company' style={{ position: 'absolute', top: '80%', right: '60px' }}>
                <Button variant="primary" onClick={setShowModal}>Add Social Media Links</Button><br></br>
                {socialMediaLinks.facebookLink && (
                  <a href={socialMediaLinks.facebookLink} target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={24} style={{ margin: '0 5px', color: '#3b5998' }} />
                  </a>
                )}
                {socialMediaLinks.twitterLink && (
                  <a href={socialMediaLinks.twitterLink} target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={24} style={{ margin: '0 5px', color: '#1da1f2' }} />
                  </a>
                )}
                {socialMediaLinks.instagramLink && (
                  <a href={socialMediaLinks.instagramLink} target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={24} style={{ margin: '0 5px', color: '#e4405f' }} />
                  </a>
                )}
                {socialMediaLinks.linkedinLink && (
                  <a href={socialMediaLinks.linkedinLink} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={24} style={{ margin: '0 5px', color: '#0077b5' }} />
                  </a>
                )}
              </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Add Social Media Links</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId='facebookLink'>
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      type='text'
                      name='facebookLink'
                      value={socialMediaLinks.facebookLink}
                      onChange={handleSocialInputChange}
                      placeholder='Enter Facebook link'
                    />
                  </Form.Group>
                  <Form.Group controlId='twitterLink'>
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control
                      type='text'
                      name='twitterLink'
                      value={socialMediaLinks.twitterLink}
                      onChange={handleSocialInputChange}
                      placeholder='Enter Twitter link'
                    />
                  </Form.Group>
                  <Form.Group controlId='instagramLink'>
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control
                      type='text'
                      name='instagramLink'
                      value={socialMediaLinks.instagramLink}
                      onChange={handleSocialInputChange}
                      placeholder='Enter Instagram link'
                    />
                  </Form.Group>
                  <Form.Group controlId='linkedinLink'>
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      type='text'
                      name='linkedinLink'
                      value={socialMediaLinks.linkedinLink}
                      onChange={handleSocialInputChange}
                      placeholder='Enter LinkedIn link'
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={handleCloseModal}>
                  Close
                </Button>
                <Button variant='primary' onClick={handleSaveLinks}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            <h3 style={{ position: 'absolute', top: '80%' }}>About {companyName}</h3>
          </Card.Body>
        </Card>
        {editableCompanyDetails ? (
          <Form className='company-overview-by-admin'>
            <FormGroup controlId="overView">
              <Form.Label>
                <h3>Overview</h3>
              </Form.Label>
              <Form.Control
                as="textarea"
                name="overView"
                value={companyDetails.overView}
                onChange={handleInputChange}
                className="fullWidthTextarea"
                style={{ minHeight: '150px' }}
              />
            </FormGroup>
            <FormGroup controlId="websiteLink">
              <Form.Label>
                <h4>Website</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="websiteLink"
                value={companyDetails.websiteLink}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="industryService">
              <Form.Label>
                <h4>Industry Service</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="industryService"
                value={companyDetails.industryService}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="companySize">
              <Form.Label>
                <h4>Company Size</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="companySize"
                value={companyDetails.companySize}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="headquarters">
              <Form.Label>
                <h4>Headquarters</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="headquaters"
                value={companyDetails.headquaters}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="year">
              <Form.Label>
                <h4>Founded</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="year"
                value={companyDetails.year}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="location">
              <Form.Label>
                <h4>Location</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={companyDetails.location}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="specialties">
              <Form.Label>
                <h4>Specialties</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="specialties"
                value={companyDetails.specialties}
                onChange={handleInputChange}
              />
            </FormGroup>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Form>
        ) : (
          <>
            <div className='company-overview-by-admin'>
              <h3>
                About
                <FaEdit onClick={() => setEditableCompanyDetails(true)} style={{ cursor: 'pointer' }} />
              </h3>
              <p>{companyDetails.overView}</p>
              <h4>Website</h4>
              <p>
                <a href={companyDetails.websiteLink} target="_blank" rel="noopener noreferrer">
                  {companyDetails.websiteLink}
                </a>
              </p>
              <h4>Industry Service</h4>
              <p>{companyDetails.industryService}</p>
              <h4>Company Size</h4>
              <p>{companyDetails.companySize === '0' ? '' : companyDetails.companySize}</p>
              <h4>Headquarters</h4>
              <p>{companyDetails.headquaters}</p>
              <h4>Founded</h4>
              <p>{companyDetails.year !== '0' && companyDetails.year}</p>
              <h4>Location</h4>
              <p>{companyDetails.location}</p>
              <h4>Specialties</h4>
              <p>{companyDetails.specialties}</p>
            </div>
          </>
        )}
        <Button variant='primary' onClick={handleBack} style={{
          position: 'fixed', right: '50px'
        }}>Back</Button>
      </div>
    </div>
  );
};

export default CompanyDetailsByAdmin;
