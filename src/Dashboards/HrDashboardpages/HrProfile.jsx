import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import HrLeftSide from './HrLeftSide';

const HrProfile = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const userName = location.state?.userName || '';
  const userEmail = location.state?.userEmail || '';

  useEffect(() => {
    if (userEmail) {
      getUser(userEmail);
    }
  }, [userEmail]);

  const getUser = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

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
        localStorage.removeItem(`userName_${userEmail}`);
        // Navigate to the login page or home page
        navigate('/'); // Update with the appropriate path for your login page
      }
    });
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

      <div className="right-side">
        <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
          <Dropdown className="ml-2">
            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
              <div
                className="initials-placeholder"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'grey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
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
        <div>
          <div className="profile-container">
            {userData && (
              <>
                <div className="profile-item">
                  <span className="profile-label">Name:</span>
                  <span className="profile-value">{userData.userName}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Company Email:</span>
                  <span className="profile-value">{userData.userEmail}</span>
                </div>

              </>
            )}
          </div>

        </div>
        {/* 
        <Container>
          <Row>
            <div className='text-center'>
              <h4 style={{color:'purple'}}>Choose Your Plan</h4>
              <h1>Flexible Pricing Plans</h1>
              <p>Select the plan that best fits your needs and budget</p>
            </div>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Starter Plan</Card.Title>
                  <Card.Text>
                    <h3>$9.99</h3>
                    <p>/month</p>
                  </Card.Text>
                  <Button variant="primary">Get started</Button>
                  <Card.Text className="mt-3">
                    <p>Perfect for small businesses</p>
                    <ul>
                      <li>Post up to 5 jobs</li>
                      <li>Basic customer support</li>
                      <li>Limited visibility</li>
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Business Plan</Card.Title>
                  <Card.Text>
                    <h3>$19.99</h3>
                    <p>/month</p>
                  </Card.Text>
                  <Button variant="primary">Get started</Button>
                  <Card.Text className="mt-3">
                    <p>Great for growing companies</p>
                    <ul>
                      <li>Post up to 15 jobs</li>
                      <li>Priority customer support</li>
                      <li>Enhanced visibility</li>
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Enterprise Plan</Card.Title>
                  <Card.Text>
                    <h3>$29.99</h3>
                    <p>/month</p>
                  </Card.Text>
                  <Button variant="primary">Get started</Button>
                  <Card.Text className="mt-3">
                    <p>Ideal for large corporations</p>
                    <ul>
                      <li>Unlimited job postings</li>
                      <li>Dedicated account manager</li>
                      <li>Maximum visibility</li>
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container> */}
      </div>
    </div>
  );
};

export default HrProfile;
