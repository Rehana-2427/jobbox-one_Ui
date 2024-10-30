import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

const FAQ = () => {
    const [selectedCategory, setSelectedCategory] = useState("General");

    // Define questions, answers, and optional images for each category
    const faqData = {
        General: [
            { question: "What is Jobbox.one, and how does it work?", answer: "Jobbox.one connects job seekers with employers for efficient hiring." },
            { question: "How can I create an account on Jobbox.one?", answer: "Click 'Register' on the homepage, fill in details, and submit.", images: ["/candidate_reg.png", "/employee_reg.png"] },
            { question: "Is Jobbox.one free for job seekers?", answer: "Yes, job seekers can search and apply to jobs for free." }
        ],
        "For Job Seekers": [
            {
                question: "How do I search for jobs on Jobbox.one?",
                answer: "Enter keywords such as job title, company name, skills, or posting date in the search bar. You can also use filters to narrow down your results.",
                images: ["/search_Job.png", "/search-comapny.png"]
            },

            { question: "How can I apply for a job?", answer: "Click 'Apply,' select your resume, and submit your application." },
            {
                question: "Can I apply for my dream job and company?",
                answer: "Yes, you can search and apply for jobs at your dream companies on Jobbox.one. If your dream company is not listed, you can still express your interest and apply for your desired roles."
            }
        ],
        "For Employers": [
            { question: "How do I post a job on Jobbox.one?", answer: "Log into your account, go to 'Post a Job,' and fill in the details.", images:["/post_job.png"]},
            { question: "What packages or pricing options are available for job postings?", answer: "Various packages are available, including featured listings." },
            { question: "Can I view and manage applications on Jobbox.one?", answer: "Yes, manage applications directly from your dashboard." }
        ],
        "Account & Profile Management": [
            { question: "How do I update my profile information?", answer: "Go to 'Profile Settings' and edit the fields as needed." },
            { question: "Can I upload a resume, and is it secure?", answer: "Yes, resumes are securely stored and viewable by employers." },
            { question: "How can I delete my account?", answer: "Go to 'Account Settings' and select 'Delete Account'." }
        ],
        "Technical Support": [
            { question: "I’m experiencing issues with the website. What should I do?", answer: "Try clearing your cache or contact support at info@paisafund.com." },
            { question: "Which browsers work best for Jobbox.one?", answer: "Jobbox.one works best on Chrome, Firefox, Safari, and Edge." },
            { question: "Can I get notifications for new job postings?", answer: "Yes, enable notifications in your account settings." }
        ],
        "Privacy & Security": [
            { question: "Is my personal information secure on Jobbox.one?", answer: "Yes, we use encryption to protect user data." },
            { question: "Who can see my profile and personal details?", answer: "Only employers you apply to can see your details." },
            { question: "How do you handle data and privacy?", answer: "We follow strict data privacy laws. See our Privacy Policy for details." }
        ],
        "Billing & Subscriptions": [
            { question: "What payment methods are accepted for employer accounts?", answer: "We accept credit cards, PayPal, and bank transfers." },
            {
                question: "Can I get a refund if I’m not satisfied?",
                answer: "Refunds are available under certain conditions:",
                conditions: [
                    "1) If you cancel your subscription within 14 days of purchase.",
                    "2) If you have not utilized any services associated with your subscription.",
                    "3) If you encounter a technical issue that cannot be resolved by our support team."
                ]
            },

            { question: "How do I cancel or change my subscription plan?", answer: "Go to 'Billing Settings' in your account to make changes." }
        ]
    };

    // Handle category selection
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div>
            <Container>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <img src="/jb_logo.png" alt="JobBox Logo" style={{ width: '200px', height: 'auto', maxHeight: '100px' }} />
                </Typography>
                <Row>
                    {/* Sidebar with categories */}
                    <Col md={3} style={{ position: 'relative', top: '40px' }}>
                        <h3>Categories</h3>
                        <b>
                            {Object.keys(faqData).map(category => (
                                <p
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    style={{
                                        cursor: 'pointer',
                                        color: selectedCategory === category ? 'purple' : 'gray', // Purple for selected, gray for others
                                        fontWeight: selectedCategory === category ? 'bold' : 'normal'
                                    }}
                                >
                                    {category}
                                </p>
                            ))}
                        </b>
                    </Col>

                    {/* FAQ questions and answers for selected category */}
                    <Col md={9} style={{ position: 'relative', top: '40px' }}>
                        <Card body>
                            <h3>{selectedCategory} Questions</h3>
                            <ul>
                                {faqData[selectedCategory].map((item, index) => (
                                    <li key={index} style={{ marginBottom: '20px' }}>
                                        <b>{item.question}</b>
                                        <Card style={{width:'600px'}}>
                                            <p>{item.answer}</p>
                                            {item.conditions && item.conditions.map((condition, idx) => (
                                                <p key={idx}>{condition}</p> // Render each condition in a separate paragraph
                                            ))}
                                        </Card>
                                        {item.images && item.images.map((image, idx) => (
                                            <img
                                                key={idx}
                                                src={image}
                                                alt={`Illustration ${idx + 1}`}
                                                style={{ width: '100vw', marginTop: '10px', borderRadius: '8px' }}
                                            />
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default FAQ;
