import { faBuilding, faEye, faFileAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DashboardBrief = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const userId = location.state?.userId;
    console.log(userId);
    const navigate = useNavigate();
    const [userData, setUserData] = useState();
    const [userName, setUserName] = useState(location.state?.userName || '');
    const [countOfResume, setCountOfResumes] = useState(null);
    const [countOfCompanies, setCountOfCompanies] = useState(null);
    const [countOfAppliedCompanies, setCountOfAppliedCompanies] = useState(null);
    const [countOfshortlistedApplications, setCountOfshortlistedApplications] = useState(null);
    const [applicationsData, setApplicationsData] = useState([]);
    const [resumeViewCount, setResumeViewCount] = useState(null);

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

                const resumecount = await axios.get(`${BASE_API_URL}/resume-view-count`, {
                    params: {
                        userId: userId
                    }
                });
                setResumeViewCount(resumecount.data)
            } catch (error) {
                console.error('Error fetching Data:', error);
                setCountOfCompanies(null);
            }
        };
        fetchData(userId);
    }, [userId]);

    const DATA = [
        { icon: faBuilding, title: countOfAppliedCompanies, subtitle: "Applied Companies", link: "/candidate-dashboard/candidate-companies", state: { userName, userId, appliedCompany: true } },
        { icon: faFileAlt, title: countOfResume, subtitle: "Resumes", link: "/candidate-dashboard/resume" },
        { icon: faEye, title: resumeViewCount, subtitle: "Resume Views" },
        { icon: faStar, title: countOfshortlistedApplications, subtitle: "Shortlist", link: '/candidate-dashboard/my-application', state: { userName, userId, applicationStatus: "Shortlisted" } },
    ];
    return (
        <Col md={12} style={{ paddingTop: '10px', paddingLeft: '10px' }}>
            <Row>
                {DATA.map((item, index) => (
                    <Col lg={3} sm={6} key={index}>
                        <Card className="card-icon-bg gap-3 card-icon-bg-primary o-hidden mb-4" style={{ maxWidth: '250px', height: '100px' }}>
                            <Card.Body className="align-items-center gap-4">
                                <FontAwesomeIcon icon={item.icon} className="me-2 text-primary mb-0 text-24 fw-semibold" />
                                <div className="content gap-1">
                                    {item.link ? (
                                        <Link
                                            to={{
                                                pathname: item.link,
                                                state: item.state ? item.state : { userName, userId },
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
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Col>
    )
}

export default DashboardBrief
