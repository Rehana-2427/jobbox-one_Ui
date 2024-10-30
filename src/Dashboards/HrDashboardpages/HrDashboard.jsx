import { faBars, faBriefcase, faEnvelope, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2
import HrLeftSide from './HrLeftSide';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { useAuth } from '../../AuthProvider';

// Register the necessary scales and elements with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HrDashboard = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userEmail = location.state?.userEmail || '';
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState(location.state?.userName || '');
  const [countOfJobs, setCountOfJobs] = useState(0);
  const [countOfApplications, setCountOfApplications] = useState(0);
  const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(0);
  const DATA = [
    { icon: faBriefcase, title: countOfJobs, subtitle: "Total Jobs", link: "/hr-dashboard/posted-jobs" },
    { icon: faUser, title: countOfApplications, subtitle: "Applicants" },
    { icon: faStar, title: countOfShortlistedCandiCompany, subtitle: "Shortlisted" },
    { icon: faEnvelope, subtitle: "Dream Applications", link: '/hr-dashboard/dream-applications' },
    { icon: faEnvelope, subtitle: "Evergreen Jobs Applications", link: '/hr-dashboard/evergreenjobs-applications' }
  ];
  const [monthlyJobData, setMonthlyJobData] = useState({
    labels: [],
    datasets: [{
      data: []
    }]
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!userName && userEmail) {
      fetchUserData(userEmail);
    }
  }, [userEmail, userName]);

  useEffect(() => {
    const storedUserName = localStorage.getItem(`userName_${userEmail}`);
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [userEmail]);

  const fetchUserData = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName`, {
        params: { userEmail: userEmail }
      });
      setUserData(response.data);
      setUserName(response.data.userName);
      localStorage.setItem(`userName_${userEmail}`, response.data.userName);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const fetchMonthlyJobData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/monthlyJobPercentagesByCompany`, {
        params: { userEmail: userEmail }
      });

      const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const jobData = allMonths.map((month, index) => response.data[index + 1] || 0);

      setMonthlyJobData({
        labels: allMonths,
        datasets: [{
          label: 'Job %',
          backgroundColor: 'skyblue',
          borderColor: 'black',
          borderWidth: 1,
          hoverBackgroundColor: 'skyblue',
          hoverBorderColor: 'black',
          data: jobData
        }]
      });
    } catch (error) {
      console.error('Error fetching monthly job data:', error);
    }
  }, [userEmail]);

  const fetchCounts = useCallback(async (userEmail) => {
    try {
      const jobsResponse = await axios.get(`${BASE_API_URL}/CountOfJobsPostedByEachCompany`, {
        params: { userEmail: userEmail }
      });
      const applicationsResponse = await axios.get(`${BASE_API_URL}/CountOfApplicationByEachCompany`, {
        params: { userEmail: userEmail }
      });
      const shortlistedResponse = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany`, {
        params: { userEmail: userEmail }
      });

      setCountOfJobs(jobsResponse.data);
      setCountOfApplications(applicationsResponse.data);
      setCountOfShortlistedCandiCompany(shortlistedResponse.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      fetchCounts(userEmail);
      fetchMonthlyJobData();
    }
  }, [userEmail, fetchCounts, fetchMonthlyJobData]);


  const { logout } = useAuth(); // Get logout function from context

  const  handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Call the logout function
        // Clear user data from localStorage
        localStorage.removeItem(`userName_${userEmail}`);
        // Navigate to the login page or home page
        navigate('/'); // Update with the appropriate path for your login page
      }
    });
  };

  const toggleFullScreen = () => {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  };

  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };
  const initials = getInitials(userName);

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
        <HrLeftSide user={{ userName, userEmail }} onClose={toggleLeftSide} />
      </div>


      <div className="right-side" >

        {/* HR header icons - full screen icon , user icon , notification */}
        <div className="d-flex justify-content-end align-items-center mb-3 mt-12 ml-2">
          <i datafullscreen="true" onClick={toggleFullScreen} className="i-Full-Screen header-icon d-none d-lg-inline-block" />
          <Dropdown className="ml-2">
            <Dropdown.Toggle as="span" className="toggle-hidden">
              <div className="initials-placeholder">
                {initials}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-3">
              <Dropdown.Item as={Link} to="/settings">
                <i className="i-Data-Settings me-1" /> Account settings
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={handleLogout}>
                <i className="i-Lock-2 me-1" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Container className="my-dashboard-container">
          <h3 className='status-info text-center bg-light'>Company status</h3>
          <Row className="dashboard d-flex mt-4">
            {DATA.map((card, index) => (
              <Col lg={3} sm={6} key={index} >
                <Card className="card-icon-bg gap-3 card-icon-bg-primary o-hidden mb-4" style={{ maxWidth: '250px' }}>
                  <Card.Body className="align-items-center gap-4" >
                    <FontAwesomeIcon icon={card.icon} className="me-2 text-primary mb-0 text-24 fw-semibold" />
                    <div className="content gap-1">
                      {card.link ? (
                        <Link to={card.link} state={{ userName, userEmail }} className="nav-link">
                          <p className="text-muted mb-0 text-capitalize title-responsive">{card.subtitle}</p>
                          <p className="lead text-primary text-24 mb-0 text-capitalize">{card.title}</p>
                        </Link>
                      ) : (
                        <>
                          <p className="text-muted mb-0 text-capitalize subtitle-responsive">{card.subtitle}</p>
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
        <Container className="my-dashboard-container ">
          <Row className="dashboard d-flex mt-4 table-wrapper">
            <Col md={8} className="offset-md-2 mt-4"> {/* Increased width */}
              <Card className="shadow-sm rounded-4 card-icon-bg" style={{ width: '100%', backgroundColor: '#E6E6FA' }}> {/* Light purple */}
                <Card.Header className="bg-light text-center" style={{ height: '30px', width: '100%' }}>
                  <Card.Title as="h4" className='text-center'>Monthly Job Percentages</Card.Title>
                </Card.Header>
                <Card.Body style={{ height: '300px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Bar
                    data={monthlyJobData}
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
                            maxTicksLimit: 100,
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
        </Container>
      </div>
    </div>

  );
};

export default HrDashboard;
