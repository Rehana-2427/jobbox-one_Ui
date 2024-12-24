import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import Footer from '../../pages/Footer';
import './CandidateDashboard.css';
import DashboardLayout from './DashboardLayout';


const Payment = () => {
  const navigate = useNavigate();
  const toggleSettings = () => {
    navigate('/');
  };
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;

  return (
    <DashboardLayout>
      <Row>
        <div className="text-center">
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
      <Footer />
    </DashboardLayout>
  );
};

export default Payment;
