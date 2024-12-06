import React from 'react';
import { Card, Row } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="app-container">
    <div className="content">
      <footer>
        <Row style={{ backgroundColor: 'black', width: '100%', marginLeft: '0px' }}>
          <Card.Footer className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <div>
                <h2 style={{ color: 'white' }}>
                  Powered by <strong style={{ color: 'purple' }}>JOB</strong><strong style={{ color: 'gainsboro' }}>BOX</strong> © 2024 Paaratech Inc. All rights reserved.
                </h2>
                <p style={{ color: 'white', fontSize: '16px', marginTop: '10px' }}>
                  We are committed to providing the best job opportunities and career resources. Connect with us on social media and stay updated with the latest job trends and offers.
                </p>
              </div>
              <div className="mt-2">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                  <FaInstagram size={30} className="social-icon instagram-icon" />
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                  <FaFacebook size={30} className="social-icon facebook-icon" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                  <FaTwitter size={30} className="social-icon twitter-icon" />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                  <FaLinkedin size={30} className="social-icon linkedin-icon" />
                </a>
              </div>
              <div className="rules mt-3">
                <Link to="/terms-and-conditions" style={{ color: 'white', marginRight: '10px' }}>Terms and Conditions</Link>
                <Link to="/privacy-and-policy" style={{ color: 'white', marginRight: '10px' }}>Privacy Policy</Link>
                <Link to="/contact" style={{ color: 'white' }}>Contact</Link>
              </div>
              <div className="mt-4">
                <p style={{ color: 'gray', fontSize: '14px' }}>
                  JOB BOX is dedicated to helping individuals find rewarding careers. Whether you are seeking a new job or looking to advance your career, we offer the tools and resources you need.
                </p>
                <p style={{ color: 'gray', fontSize: '14px' }}>
                  Join our community and get exclusive access to job listings, career advice, and much more.
                </p>
              </div>
            </div>
          </Card.Footer>
        </Row>
      </footer>
    </div>
  </div>
  
  );
}

export default Footer;
