import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const Payment = () => {
  const navigate = useNavigate();
  const toggleSettings = () => {
    navigate('/');
  };
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
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
        localStorage.removeItem(`userName_${userId}`);
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
        <CandidateLeftSide user={{ userName, userId }} onClose={toggleLeftSide} />
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
        {/* <div className="payment-container">
          <div>
            <h2>Payment Via</h2>
            <section className="payment-options">
              <h2 className='payment-option'><FontAwesomeIcon icon={faCreditCard} /> Credit/Debit card</h2>
              <h2 className='payment-option'><FontAwesomeIcon icon={faPaperclip} /> UPI payments</h2>
              <h2 className='payment-option'><FontAwesomeIcon icon={faGlobe} /> Net Banking</h2>
            </section>
          </div>
          <div>
            <h2>Payment History</h2>
            <p style={{ textAlign: 'center' }}>Payments Details</p>
          </div>
        </div> */}
        <Container>
          <Row>
            <div className='text-center'>
              <h4 style={{ color: 'purple' }}>Choose Your Plan</h4>
              <h1>Flexible Candidate Plans</h1>
              <p>Select the plan that best fits your job search needs</p>
            </div>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Basic Candidate Plan</Card.Title>
                  <Card.Text>
                    <h3>$0.00(Free)</h3>
                    <p>/month</p>
                  </Card.Text>
                  <Button variant="primary">Get Started</Button>
                  <Card.Text className="mt-3">
                    <p>Perfect for job seekers</p>
                    <ul>
                      <li>Apply to up to 5 jobs per day</li>
                      <li>Email notifications</li>
                      <li>Access to job postings</li>
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Premium Candidate Plan</Card.Title>
                  <Card.Text>
                    <h3>$9.99</h3>
                    <p>/month</p>
                  </Card.Text>
                  <Button variant="primary">Get Started</Button>
                  <Card.Text className="mt-3">
                    <p>Great for serious job hunters</p>
                    <ul>
                      <li>Apply to unlimited jobs</li>
                      <li>Resume optimization tips</li>
                      <li>Priority application review</li>
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Elite Candidate Plan</Card.Title>
                  <Card.Text>
                    <h3>$19.99</h3>
                    <p>/month</p>
                  </Card.Text>
                  <Button variant="primary">Get Started</Button>
                  <Card.Text className="mt-3">
                    <p>Ideal for professionals seeking top jobs</p>
                    <ul>
                      <li>One-on-one career coaching</li>
                      <li>Exclusive job postings</li>
                      <li>Profile visibility boost</li>
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

      </div>
    </div>
  );
}
export default Payment;
