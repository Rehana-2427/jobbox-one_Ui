import { faBriefcase, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const CompanyStatusCards = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // Get the userName and userId from location.state if available, otherwise from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));  // Assuming 'user' is stored in localStorage

        const userNameFromLocation = location.state?.userName || storedUser?.userName || '';
        const userEmailFromLocation = location.state?.userEmail || storedUser?.userEmail || null;

        setUserName(userNameFromLocation);
        setUserEmail(userEmailFromLocation);
    }, [location]);  // Re-run the effect when the location changes
    
    const [countOfJobs, setCountOfJobs] = useState(0);
    const [countOfApplications, setCountOfApplications] = useState(0);
    // const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(0);
    const DATA = [
        { icon: faBriefcase, title: countOfJobs, subtitle: "Total Jobs", link: "/hr-dashboard/posted-jobs" },
        { icon: faUser, title: countOfApplications, subtitle: "Applicants" },
        // { icon: faStar, title: countOfShortlistedCandiCompany, subtitle: "Shortlisted" },
        { icon: faEnvelope, subtitle: "Dream Applications", link: '/hr-dashboard/dream-applications' },
        { icon: faEnvelope, subtitle: "Evergreen Jobs Applications", link: '/hr-dashboard/evergreenjobs-applications' }
    ];

    // useEffect(() => {
    //     if (!userName && userEmail) {
    //         fetchUserData(userEmail);
    //     }
    // }, [userEmail, userName]);

    // const fetchUserData = async (userEmail) => {
    //     try {
    //         const response = await axios.get(`${BASE_API_URL}/getHRName`, {
    //             params: { userEmail: userEmail }
    //         });
    //         setUserData(response.data);
    //         setUserName(response.data.userName);
    //         localStorage.setItem(`userName_${userEmail}`, response.data.userName);
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     }
    // };


    const fetchCounts = useCallback(async (userEmail) => {
        try {
            const jobsResponse = await axios.get(`${BASE_API_URL}/CountOfJobsPostedByEachCompany`, {
                params: { userEmail: userEmail }
            });
            const applicationsResponse = await axios.get(`${BASE_API_URL}/CountOfApplicationByEachCompany`, {
                params: { userEmail: userEmail }
            });
            // const shortlistedResponse = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany`, {
            //     params: { userEmail: userEmail }
            // });

            setCountOfJobs(jobsResponse.data);
            setCountOfApplications(applicationsResponse.data);
            // setCountOfShortlistedCandiCompany(shortlistedResponse.data);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    }, [userEmail]);
    useEffect(() => {
        if (userEmail) {
            fetchCounts(userEmail);
        }
    }, [userEmail, fetchCounts]);
    return (
        <Col md={12} style={{ paddingLeft: '15px',paddingRight:'15px' }}>
            <Row>
                {DATA.map((item, index) => (
                    <Col lg={3} sm={6} key={index}>
                        <Card
                            className="card card-icon-bg card-icon-bg-primary o-hidden mb-4"
                            style={{ height: '100px',paddingLeft:'10px' }}
                        >
                            <Card.Body>
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className="me-2 text-primary mb-0 text-24 fw-semibold"
                                />
                                <div className="content gap-1">
                                    {item.link ? (
                                        <Link
                                            to={item.link}
                                            state={{ userName, userEmail }}
                                            className="nav-link"
                                        >
                                            <p className="text-muted mb-0 text-capitalize title-responsive">
                                                {item.subtitle}
                                            </p>
                                            <p className="lead text-primary text-24 mb-0 text-capitalize">
                                                {item.title}
                                            </p>
                                        </Link>
                                    ) : (
                                        <>
                                            <p className="text-muted mb-0 text-capitalize subtitle-responsive">
                                                {item.subtitle}
                                            </p>
                                            <p className="lead text-primary text-24 mb-0 text-capitalize">
                                                {item.title}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Col>
    )
}

export default CompanyStatusCards
