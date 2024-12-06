import { faBriefcase, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const CompanyStatusCards = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const userEmail = location.state?.userEmail || '';
    const [userData, setUserData] = useState(null);
    const [userName, setUserName] = useState(location.state?.userName || '');
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

    useEffect(() => {
        if (!userName && userEmail) {
            fetchUserData(userEmail);
        }
    }, [userEmail, userName]);

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
        <Col md={12} style={{paddingTop:'10px',paddingLeft:'10px'}}>
            <Row>
                {DATA.map((card, index) => (
                    <Col lg={3} sm={6} key={index}>
                        <Card
                            className="card-icon-bg gap-3 card-icon-bg-primary o-hidden mb-4"
                            style={{ maxWidth: '250px' ,height:'100px'}}
                        >
                            <Card.Body className="align-items-center gap-4">
                                <FontAwesomeIcon
                                    icon={card.icon}
                                    className="me-2 text-primary mb-0 text-24 fw-semibold"
                                />
                                <div className="content gap-1">
                                    {card.link ? (
                                        <Link
                                            to={card.link}
                                            state={{ userName, userEmail }}
                                            className="nav-link"
                                        >
                                            <p className="text-muted mb-0 text-capitalize title-responsive">
                                                {card.subtitle}
                                            </p>
                                            <p className="lead text-primary text-24 mb-0 text-capitalize">
                                                {card.title}
                                            </p>
                                        </Link>
                                    ) : (
                                        <>
                                            <p className="text-muted mb-0 text-capitalize subtitle-responsive">
                                                {card.subtitle}
                                            </p>
                                            <p className="lead text-primary text-24 mb-0 text-capitalize">
                                                {card.title}
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
