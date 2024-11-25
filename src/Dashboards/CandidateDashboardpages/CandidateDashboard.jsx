
import { faBars, faBuilding, faEye, faFileAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import CandidateLeftSide from './CandidateLeftSide';

const CandidateDashboard = () => {
  const location = useLocation();
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const userId = location.state?.userId;
  console.log(userId);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [userName, setUserName] = useState(location.state?.userName || '');

  useEffect(() => {
    if (!userName && userId) {
      fetchUserData(userId);
    }
  }, [userId, userName]);
  useEffect(() => {
    const storedUserName = localStorage.getItem(`userName_${userId}`);
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [userId]);
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getUserName`, {
        params: {
          userId: userId
        }
      });
      console.log(response.data);
      setUserName(response.data.userName);
      localStorage.setItem(`userName_${userId}`, response.data.userName); // Store userName with user-specific key
      setUserData(response.data);
    } catch (error) {
      setUserData(null);
    }
  };

  const [countOfResume, setCountOfResumes] = useState(null);
  const [countOfCompanies, setCountOfCompanies] = useState(null);
  const [countOfAppliedCompanies, setCountOfAppliedCompanies] = useState(null);
  const [countOfshortlistedApplications, setCountOfshortlistedApplications] = useState(null);
  const [countOfUnreadNotification, setCountOfUnreadNotification] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [applicationsData, setApplicationsData] = useState([]);


  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        const countCompanies = await axios.get(`${BASE_API_URL}/countValidatedCompanies`, {
          params: {
            userId: userId
          }
        });
        console.log(countCompanies.data);
        setCountOfCompanies(countCompanies.data);

        const countOfAppliedCompanies = await axios.get(`${BASE_API_URL}/countAppliedCompanies`, {
          params: {
            userId: userId
          }
        });
        console.log(countOfAppliedCompanies.data);
        setCountOfAppliedCompanies(countOfAppliedCompanies.data);

        const countResumes = await axios.get(`${BASE_API_URL}/getCountOfResumes`, {
          params: {
            userId: userId
          }
        });
        console.log(countResumes.data);
        setCountOfResumes(countResumes.data);
        const shortlist = await axios.get(`${BASE_API_URL}/getCountOfTotalShortlistedApplication`, {
          params: {
            userId: userId
          }
        });
        console.log(shortlist.data);
        setCountOfshortlistedApplications(shortlist.data);

        const notification = await axios.get(`${BASE_API_URL}/getUnreadNotifications`, {
          params: {
            userId: userId
          }
        });
        console.log(notification.data);
        setCountOfUnreadNotification(notification.data.count);
        setUnreadNotifications(notification.data.notifications);
      } catch (error) {
        console.error('Error fetching Data:', error);
        setCountOfCompanies(null);
        setCountOfUnreadNotification(0);
        setUnreadNotifications([]);
      }
    };
    fetchData(userId);
  }, [userId]);



  const toggleSettings = () => {
    navigate('/');
  };
  const toggleFullScreen = () => {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.post(`${BASE_API_URL}/markNotificationsAsRead`, null, {
        params: { userId: userId, notificationId: notificationId }
      });
      // Update state to reflect the notification as read
      const updatedNotifications = unreadNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      setUnreadNotifications(updatedNotifications);
      setCountOfUnreadNotification(prevCount => prevCount - 1); // Decrease unread count
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const user = {
    userName: userName,
    userId: userId,
  };

  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return ''; // Handle case where name is undefined
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  // console.log(nameParts)
  
  const initials = getInitials(user.userName);

  console.log(initials)
  useEffect(() => {
    fetchApplicationsData(userId);
  }, [userId]);

  const fetchApplicationsData = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countByDate`, {
        params: { userId }
      });
      setApplicationsData(response.data);
    } catch (error) {
      console.error('Error fetching application data:', error);
    }
  };

  const options = {
    chart: {
      id: 'chart1',
      type: 'line',
      zoom: {
        enabled: true,
      },
    },
    xaxis: {
      type: 'datetime',
      categories: applicationsData.map(data => new Date(data.date).toISOString()),
    }, yaxis: {
      min: 0,
      max: 50,
      tickAmount: 10,
      labels: {
        formatter: function (val) {
          return parseInt(val, 10);
        }
      }
    },
    series: [{
      name: 'Applications',
      data: applicationsData.map(data => data.count),
    }],
  };

  const DATA = [
    { icon: faBuilding, title: countOfAppliedCompanies, subtitle: "Applied Companies", link: "/candidate-dashboard/candidate-companies", state: { userName, userId, appliedCompany: true } },
    { icon: faFileAlt, title: countOfResume, subtitle: "Resumes", link: "/candidate-dashboard/resume" },
    { icon: faEye, title: '250', subtitle: "Resume Views" },
    { icon: faStar, title: countOfshortlistedApplications, subtitle: "Shortlist", link: '/candidate-dashboard/my-application', state: { userName, userId, applicationStatus: "Shortlisted" } },

  ];
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };

  const { logout } = useAuth(); // Get logout function from context

  const handleLogout = () => {
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
        localStorage.removeItem(`userName_${userId}`);
        // Navigate to the login page or home page
        navigate('/'); // Update with the appropriate path for your login page
      }
    });
  };
  return (
    <div className='dashboard-container'>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
        <CandidateLeftSide user={{ userName, userId }} onClose={toggleLeftSide} />
      </div>
      <div className="right-side" style={{ overflowY: 'scroll' }}>
        {/* candidate header icons - full screen icon , user icon , notification */}
        <div className="d-flex justify-content-end align-items-center mb-3 mt-2">
          <Dropdown className="ml-2">
            <Dropdown.Toggle
              as="div"
              id="dropdownNotification"
              className="badge-top-container toggle-hidden ml-2"
            >
              <span className="badge bg-primary cursor-pointer">
                {countOfUnreadNotification}
              </span>
              <i className="i-Bell text-muted header-icon" />
            </Dropdown.Toggle>
            {countOfUnreadNotification > 0 ? (
              <Dropdown.Menu>
                {unreadNotifications.length === 0 ? (
                  <Dropdown.Item>No new notifications</Dropdown.Item>
                ) : (
                  unreadNotifications.map((notification, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={notification.read ? 'read-notification' : 'unread-notification'}
                    >
                      {notification.message}
                    </Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            ) : null}
          </Dropdown>
          <i datafullscreen="true" onClick={toggleFullScreen} className="i-Full-Screen header-icon d-none d-lg-inline-block" />
          <Dropdown className="ml-2">
            <Dropdown.Toggle as="span" className="toggle-hidden">
              <div className="initials-placeholder">
                {initials}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-3">
              <Dropdown.Item as={Link} to="/settings">
                <i className="i-Data-Settings me-1"/> Account settings
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={handleLogout}>
                <i className="i-Lock-2 me-1" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Container>
          <h3 className='status-info text-center bg-light'>My Application Status</h3>
          <Row className="dashboard d-flex mt-4">
            {DATA.map((item, index) => (
              <Col lg={3} sm={6} className="mb-4" key={index}>
                <Card className="card-icon-bg gap-3 card-icon-bg-primary o-hidden mb-4" style={{ maxWidth: '260px' }}>
                  <Card.Body className="align-items-center gap-4">
                    <FontAwesomeIcon icon={item.icon} className="text-primary mb-2 text-24" />
                    {item.link ? (
                      <Link
                        to={{
                          pathname: item.link,
                          state: item.state ? item.state : { userName, userId }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.link, { state: item.state ? item.state : { userName, userId } });
                        }}
                        className="nav-link"
                      >
                        <h4 className="text-primary mb-0">
                          {item.subtitle}
                          <span className="d-block mt-2">{item.title !== null ? item.title : 'Loading...'}</span>
                        </h4>
                      </Link>
                    ) : (
                      <div>
                        <h4 className="text-primary mb-0">
                          {item.subtitle}
                          <span className="d-block mt-2">{item.title !== null ? item.title : 'Loading...'}</span>
                        </h4>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="justify-content-center mb-4">
            <Col xs={24} md={8} className='mb-4'>  {/* Adjust the column size */}
              <div className="chart-card">
                <Card.Title className="text-center">Applications per Day</Card.Title>
                <Chart
                  style={{ height: '200px', width: '120%' }}  // Set width to 100%
                  options={options}
                  series={options.series}
                  type={options.chart.type}
                />
              </div>
            </Col>

          </Row>
        </Container>
      </div>
    </div>
  );
};

export default CandidateDashboard;


