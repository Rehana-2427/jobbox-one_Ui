import { faBan, faBuilding, faUnlock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const AdminDashboard = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [validatedCompaniesCount, setValidatedCompaniesCount] = useState(0);
  const [validatedHrCount, setValidatedHrCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [combinedData, setCombinedData] = useState({
    labels: [],
    datasets: [
      {
        label: 'User %',
        backgroundColor: 'skyblue',
        borderColor: 'black',
        borderWidth: 1,
        hoverBackgroundColor: 'skyblue',
        hoverBorderColor: 'black',
        data: []
      },
      {
        label: 'Company %',
        backgroundColor: 'lightgreen',
        borderColor: 'black',
        borderWidth: 1,
        hoverBackgroundColor: 'lightgreen',
        hoverBorderColor: 'black',
        data: []
      }
    ]
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const hrResponse = await axios.get(`${BASE_API_URL}/countofHrs`);
      setHrCount(hrResponse.data);

      const companiesResponse = await axios.get(`${BASE_API_URL}/countOfCompanies`);
      setCompanyCount(companiesResponse.data);

      const validatedCompaniesResponse = await axios.get(`${BASE_API_URL}/countValidatedCompanies`);
      setValidatedCompaniesCount(validatedCompaniesResponse.data);

      const validatedHrResponse = await axios.get(`${BASE_API_URL}/countValidatedUsers`);
      setValidatedHrCount(validatedHrResponse.data);

      const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const userResponse = await axios.get(`${BASE_API_URL}/countValidateUsersByMonth`);
      const userDataFromApi = allMonths.map((month, index) => userResponse.data[index + 1] || 0);

      const companyResponse = await axios.get(`${BASE_API_URL}/countValidateCompaniesByMonth`);
      const companyDataFromApi = allMonths.map((month, index) => companyResponse.data[index + 1] || 0);

      setCombinedData({
        labels: allMonths,
        datasets: [
          {
            label: 'User %',
            backgroundColor: 'skyblue',
            borderColor: 'black',
            borderWidth: 1,
            hoverBackgroundColor: 'skyblue',
            hoverBorderColor: 'black',
            data: userDataFromApi
          },
          {
            label: 'Company %',
            backgroundColor: 'lightgreen',
            borderColor: 'black',
            borderWidth: 1,
            hoverBackgroundColor: 'lightgreen',
            hoverBorderColor: 'black',
            data: companyDataFromApi
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleFullScreen = () => {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  };

  const toggleSettings = () => {
    navigate('/');
  };
  const DATA = [
    { icon: faBuilding, title: validatedCompaniesCount, subtitle: "Validate Companies", link: "/admin-dashboard/add-company-details" },
    { icon: faUser, title: validatedHrCount, subtitle: "Validate Hrs", link: "/admin-dashboard/user-validation" },
    { icon: faUnlock, title: 'Access', subtitle: "HR & Candidate" },
    { icon: faBan, title: '15', subtitle: 'HR Blocked' }
  ];

  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

  useEffect(() => {
    // Update the `isSmallScreen` state based on screen resizing
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 767);

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='dashboard-container'>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
        <AdminleftSide onClose={toggleLeftSide} />
      </div>

      <div className="right-side">
        <div
          style={{
            overflowY: 'auto',
            maxHeight: isSmallScreen ? '600px' : '1000px',
            paddingBottom: '20px'
          }}
        >
          {/* admin header icons - full screen icon , user icon , notification */}
          <div className="d-flex justify-content-end align-items-center mb-3 mt-12 ml-2">
            <Dropdown className="ml-2">
              <Dropdown.Toggle
                as="div"
                id="dropdownNotification"
                className="badge-top-container toggle-hidden ml-2">
                <span className="badge bg-primary cursor-pointer">{hrCount + companyCount}</span>
                <i className="i-Bell text-muted header-icon" style={{ fontSize: '22px' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/admin-dashboard/admin-action">
                  {hrCount} new HRs
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin-dashboard/company-validation">
                  {companyCount} new companies
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <i datafullscreen="true" onClick={toggleFullScreen} className="i-Full-Screen header-icon d-none d-lg-inline-block" />
            <Dropdown className="ml-2">
              <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                <FaUser className='admin-icon' />
              </Dropdown.Toggle>
              <Dropdown.Menu className="mt-3">
                <Dropdown.Item as={Link} to="/">
                  <i className="i-Data-Settings me-1" /> Account settings
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/" onClick={toggleSettings}>
                  <i className="i-Lock-2 me-1" /> Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Container className="my-dashboard-container">
            <h3 className='status-info text-center bg-light'>Admin status</h3>
            <Row className="dashboard d-flex mt-4">
              {DATA.map((card, index) => (
                <Col lg={3} sm={6} key={index} >
                  <Card className="card-icon-bg gap-3 card-icon-bg-primary o-hidden mb-4" style={{ maxWidth: '250px' }}>
                    <Card.Body className="align-items-center gap-4" >
                      <FontAwesomeIcon icon={card.icon} className="me-2 text-primary mb-0 text-24 fw-semibold" />
                      <div className="content gap-1">
                        {card.link ? (
                          <Link to={card.link} className="nav-link">
                            <p className="text-muted mb-0 text-capitalize">{card.subtitle}</p>
                            <p className="lead text-primary text-24 mb-0 text-capitalize">{card.title}</p>
                          </Link>
                        ) : (
                          <>
                            <p className="text-muted mb-0 text-capitalize">{card.subtitle}</p>
                            <p className="lead text-primary text-24 mb-0 text-capitalize">{card.title}</p>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>

          <div className="applyforValidation">
            <h4>Check for processing User validation!!</h4>
            <p>
              <Button>
                <Link to="/admin-dashboard/admin-action" onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin-dashboard/admin-action');
                }} style={{ color: 'white' }}>
                  Check
                </Link>
              </Button>
            </p>
          </div>

          <div className="d-flex flex-column" style={{ height: '100%', width: '100%' }}>
            <Row className="mx-0">
              <Col md={6} className="offset-md-3 mt-4">
                <Card className="shadow-sm rounded-4" >
                  <Card.Header className="bg-light text-center" style={{ height: '30px', width: '70%' }}>
                    <Card.Title as="h5">Monthly Validation</Card.Title>
                  </Card.Header>
                  <Card.Body style={{ height: '300px' }}>
                    <Bar
                      data={combinedData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            beginAtZero: true,
                            ticks: {
                              color: '#888',
                              font: {
                                size: 12
                              }
                            }
                          },
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: '#888',
                              font: {
                                size: 12
                              },
                              stepSize: 10
                            }
                          }
                        }
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
