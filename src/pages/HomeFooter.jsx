import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './PagesStyle/Pages.css';

const HomeFooter = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const [formData, setFormData] = useState({
        name: 'unknown user',
        email: '',
        subject: 'unknown user email',
        message: '',
    });
    const [isMessageSent, setIsMessageSent] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if the user is logged in
        const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is saved here after login
        if (loggedInUser && loggedInUser.userName) {
            setIsLoggedIn(true);
            setUser(loggedInUser); // Set user object
            setFormData((prevFormData) => ({
                ...prevFormData,
                name: loggedInUser.userName,
                email: loggedInUser.userEmail,
                subject: `${loggedInUser.userName} email`
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send the form data to the backend API
            const response = await axios.post(`${BASE_API_URL}/savemessage`, formData);
            if (response.status === 200) {
                setIsMessageSent(true)
                toast.success("Message sent successfully!"); // Success toast
                setFormData({
                    name: isLoggedIn ? user.userName : 'unknown user',
                    email: '',
                    subject: isLoggedIn ? `${user.userName} email` : 'unknown user email',
                    message: '',
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again later.');
        }
    };


    return (
        <div className="home-contact app-container text-wrap">
            <div className='contact-contact20 contact-section-padding content'>
                <div className='contact-max-width .contact-section-max-width'>
                    <div className='contact-section-title' >
                        <div className='contact-content'>
                            <h2 className='contact-heading-2'>Contact Us</h2>
                            <span className='contact-body-small text-center'>Our team is here to assist you with any inquiries.</span>
                            <p className='contact-text2 contact-body-large'>Have a question or need support? Reach out to us!</p>
                        </div>
                    </div>
                    <div className="contact-row">
                        <div className="contact-column">
                            <div className="contact-content">
                                <svg viewBox="0 0 1024 1024" className="icon-medium">
                                    <path d="M854 342v-86l-342 214-342-214v86l342 212zM854 170q34 0 59 26t25 60v512q0 34-25 60t-59 26h-684q-34 0-59-26t-25-60v-512q0-34 25-60t59-26h684z"></path>
                                </svg>
                                <div className="contact-info">
                                    <div className="contact-details">
                                        <h3 className="heading-3">Email</h3>
                                        <p className="body-large">Feel free to drop by our office during business hours.</p>
                                    </div>
                                    <span className="email-info">
                                        <a href="mailto:info@paisafund.com">info@paisafund.com</a>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="contact-column">
                            <div className="contact-content">
                                <svg viewBox="0 0 1024 1024" className="icon-medium">
                                    <path d="M282 460q96 186 282 282l94-94q20-20 44-10 72 24 152 24 18 0 30 12t12 30v150q0 18-12 30t-30 12q-300 0-513-213t-213-513q0-18 12-30t30-12h150q18 0 30 12t12 30q0 80 24 152 8 26-10 44z"></path>
                                </svg>
                                <div className="contact-info">
                                    <div className="contact-details">
                                        <h3 className="heading-3">Phone</h3>
                                        <p className="body-large">Follow us on social media for updates and job postings.</p>
                                    </div>
                                    <span className="phone-info body-small">
                                        <a href="tel:+11234567890">+1-123-456-7890</a>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="contact-column">
                            <div className="contact-content">
                                <svg viewBox="0 0 1024 1024" className="icon-medium">
                                    <path d="M512 0c-176.732 0-320 143.268-320 320 0 320 320 704 320 704s320-384 320-704c0-176.732-143.27-320-320-320zM512 512c-106.040 0-192-85.96-192-192s85.96-192 192-192 192 85.96 192 192-85.96 192-192 192z"></path>
                                </svg>
                                <div className="contact-info">
                                    <div className="contact-details">
                                        <h3 className="heading-3">Office</h3>
                                        <p className="body-large">We look forward to hearing from you!</p>
                                    </div>
                                    <span className="address-info body-small">
                                        <a href="https://www.google.com/maps?q=123+Job+Street,+Cityville,+State,+12345" target="_blank" rel="noopener noreferrer">
                                            123 Job Street, Cityville, State, 12345
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-container">
                        <footer className="footer-section-padding">
                            <div className="footer-max-width">
                                <div className="footer-content">
                                    <div className="footer-newsletter">
                                        <img src="/jb_logo.png" alt="JobBox Logo" style={{ width: '200px' }} />
                                        <div className="footer-description">
                                            Stay updated with the latest job opportunities, career tips, and industry insights.
                                        </div>
                                        <div className="footer-actions">
                                            <div className="footer-form">
                                                <div className="footer-input-container">
                                                    <div>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            placeholder="Enter your email"
                                                            className="footer-email-input"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="message"
                                                            placeholder="Enter your message"
                                                            className="footer-email-input"
                                                            value={formData.message}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <Button className="footer-button" onClick={handleSubmit}>
                                                        <span className="footer-button-text">Send Message</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
                                    </div>

                                    <div className='footer-links-section'>
                                        <div className="footer-column">
                                            <img src="/contact.png" alt="contact" style={{ height: '350px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                        <div className="footer-links-section">
                            <div className="footer-column">
                                <strong className="footer-column-title">Company</strong>
                                <div className="footer-links">
                                    <Link to="/about" className="footer-link">
                                        About Us
                                    </Link>
                                    <Link to="/careers" className="footer-link">
                                        Careers
                                    </Link>
                                    <Link to="/contact" className="footer-link">
                                        Contact Us
                                    </Link>
                                    <Link to="/faqs" className="footer-link">
                                        FAQs
                                    </Link>
                                    <Link to="/terms-and-conditions" className="footer-link">
                                        Terms of Service
                                    </Link>
                                    <Link to="/data-deletion-policy" className="footer-link">
                                        Data deletion policy                                                </Link>
                                </div>
                            </div>
                            <div className="footer-column">
                                <strong className="footer-column-title">Quick Links</strong>
                                <div className="footer-links">
                                    <Link to="/privacy-and-policy" className="footer-link">
                                        Privacy Policy
                                    </Link>
                                    <Link to="/cookie" className="footer-link">
                                        Cookie Policy
                                    </Link>
                                    <Link to="/accessibility" className="footer-link">
                                        Accessibility
                                    </Link>
                                    <Link to="/blog" className="footer-link">
                                        Blog
                                    </Link>
                                    <Link to="/sitemap" className="footer-link">
                                        Sitemap
                                    </Link>
                                </div>
                            </div>
                            <div className="footer-column">
                                <strong className="footer-column-title ">Follow Us</strong>
                                <div className="footer-links">
                                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2 footer-link">
                                        <FaInstagram size={30} className="social-icon instagram-icon" /> Instagram
                                    </a>
                                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2 footer-link">
                                        <FaFacebook size={30} className="social-icon facebook-icon" /> Facebook
                                    </a>
                                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2 footer-link">
                                        <FaTwitter size={30} className="social-icon twitter-icon" /> Twitter
                                    </a>
                                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2 footer-link">
                                        <FaLinkedin size={30} className="social-icon linkedin-icon" /> Linkedin
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="footer-credits">
                            <div className="footer-row">
                                <div className="thq-divider-horizontal"></div>
                                <span className="thq-body-small">&copy; 2024 Paaratech Inc. All rights reserved.</span>
                                <div className="footer-footer-links2">
                                    <span> <Link to="/privacy-policy" className="thq-body-small">Privacy Policy</Link></span>
                                    <span><Link to="/terms-of-service" className="thq-body-small">Terms of Service</Link></span>
                                    <span><Link to="/cookie-policy" className="thq-body-small">Cookie Policy</Link> </span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default HomeFooter
