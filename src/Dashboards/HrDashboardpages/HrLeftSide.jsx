import { faAddressCard, faBriefcase, faBuilding, faEnvelope, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HrLeftSide = ({ user, isOpen }) => {
    const { userName, userEmail } = user;
    const navigate = useNavigate();
    const location = useLocation();
    const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
    const [activeLink, setActiveLink] = useState(location.pathname); // Track the active link

    const navLinks = [
        { to: '/hr-dashboard', label: 'Dashboard', icon: <RxDashboard size={30} /> },
        { to: '/hr-dashboard/my-jobs', label: 'My Jobs', icon: <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '1.7rem' }} /> },
        {
            label: 'All Jobs',
            icon: <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '1.7rem' }} />,
            subLinks: [
                { to: '/hr-dashboard/posted-jobs', label: 'Regular Jobs' },
                { to: '/hr-dashboard/evergreen-jobs', label: 'Evergreen Jobs' }
            ]
        },
        { to: '/hr-dashboard/hr-applications', label: 'Applicants', icon: <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/people', label: 'HR Team', icon: <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/hr-profile', label: 'Profile', icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.7rem' }} /> },
        { to: '/hr-dashboard/company-showcase', label: 'Company', icon: <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '1.7rem' }} /> },
        { to: '/contact', label: 'Contact', icon: <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1.7rem' }} /> }
    ];

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            const savedScrollPosition = sessionStorage.getItem('leftSideScrollPosition');
            if (savedScrollPosition) {
                scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
            }
        }

        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollPosition = scrollContainerRef.current.scrollTop;
                sessionStorage.setItem('leftSideScrollPosition', scrollPosition.toString());
            }
        };

        const currentRef = scrollContainerRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [location]);

    const handleLinkClick = (to) => {
        if (to === activeLink) {
            // Prevent navigation and maintain the current scroll position
            return;
        }
        setActiveLink(to); // Set the active link
        sessionStorage.setItem('scrollPosition', scrollContainerRef.current.scrollTop);
        navigate(to, { state: { userName, userEmail } });
    };

    useEffect(() => {
        const savedScrollPosition = sessionStorage.getItem('scrollPosition');
        if (savedScrollPosition && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
        }
    }, [location]);

    const renderNavLinks = () => (
        <Nav className="flex-column full-height align-items-center">
            {navLinks.map((link, index) => (
                <React.Fragment key={index}>
                    {!link.subLinks ? (
                        <div style={{ position: 'relative' }}>
                            <Link
                                to={link.to}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick(link.to);
                                }}
                                className={`nav-link d-flex align-items-center ${activeLink === link.to ? 'active' : ''}`}
                                style={{
                                    fontSize: '1.1rem',
                                    transition: 'color 0.3s',
                                    color: activeLink === link.to ? '#663399' : '#332e38',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    {link.icon && <span style={{ marginRight: '10px' }}>{link.icon}</span>}
                                    {link.label}
                                    <div
                                        className="triangle"
                                        style={{
                                            width: '0',
                                            height: '0',
                                            borderStyle: 'solid',
                                            borderWidth: '0 0 30px 30px',
                                            borderColor: 'transparent transparent #663399 transparent',
                                            position: 'absolute',
                                            top: '103%',
                                            left: '100%',
                                            marginLeft: '10px',
                                            display: location.pathname === link.to ? 'block' : 'none',
                                        }}
                                    />
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div
                            onMouseEnter={() => setIsJobsDropdownOpen(true)}
                            onMouseLeave={() => setIsJobsDropdownOpen(false)}
                            style={{ position: 'relative' }}
                        >
                            <div
                                className="nav-link d-flex align-items-start"
                                style={{
                                    fontSize: '1.1rem',
                                    transition: 'color 0.3s',
                                    color: link.subLinks.some((subLink) => activeLink === subLink.to) ? '#663399' : '#332e38',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    {link.icon && <span style={{ marginRight: '10px' }}>{link.icon}</span>}
                                    {link.label}
                                    <div
                                        className="triangle"
                                        style={{
                                            width: '0',
                                            height: '0',
                                            borderStyle: 'solid',
                                            borderWidth: '0 0 30px 30px',
                                            borderColor: 'transparent transparent #663399 transparent',
                                            position: 'absolute',
                                            top: '103%',
                                            left: '100%',
                                            marginLeft: '10px',
                                            display:
                                                location.pathname === link.to || (link.subLinks && link.subLinks.some(subLink => location.pathname === subLink.to))
                                                    ? 'block'
                                                    : 'none',
                                        }}
                                    />
                                </div>
                            </div>
                            {isJobsDropdownOpen && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', padding: '5px 0', overflow: 'hidden' }}>
                                    {link.subLinks.map((subLink, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            to={subLink.to}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleLinkClick(subLink.to);
                                            }}
                                            className={`dropdown-item ${activeLink === subLink.to ? 'active' : ''}`}
                                            style={{
                                                textAlign: 'start',
                                            }}
                                        >
                                            {subLink.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <hr style={{ width: '100%', borderColor: 'black' }} />
                </React.Fragment>
            ))}
        </Nav>
    );
    

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser && loggedInUser.userName) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <div
            ref={scrollContainerRef}
            className={`sidebar-left ${isOpen ? 'open' : 'closed'}`}
            style={{
                position: 'fixed',
                top: '80px',
                left: isOpen ? '0' : '-150px',
                width: '180px',
                height: '100vh',
                backgroundColor: '#f4f4f4',
                overflowX: 'hidden',
                overflowY: 'auto',
                boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.1)' : 'none',
                transition: 'left 0.3s ease-in-out',
                padding: '10px',
            }}
        >
            <Navbar.Text>
                <Box sx={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Box sx={{ fontSize: '24px', fontWeight: 'bold' }}>{user.userName}</Box>
                    <Box sx={{ borderBottom: '1px solid gray', marginTop: '8px', marginX: 'auto', width: '80%' }} />
                </Box>
            </Navbar.Text>
            {renderNavLinks()}
        </div>
    );
};

export default HrLeftSide;