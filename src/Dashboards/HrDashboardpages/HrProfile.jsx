import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../../pages/Footer';
import DashboardLayout from './DashboardLayout ';

const HrProfile = () => {
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

  return (
    <DashboardLayout>
      <div className="main-content">
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
      <Footer />


    </DashboardLayout>
  );
};

export default HrProfile;
