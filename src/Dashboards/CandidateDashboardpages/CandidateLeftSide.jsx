import { faBuilding, faEnvelope, faFile, faFileLines, faLayerGroup, faMoneyCheckDollar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function CandidateLeftSide({ user, isOpen }) {

    const { userName, userId } = user;
    const navigate = useNavigate();
    const location = useLocation();
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 900);
    const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 900);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const navLinks = [
        { to: '/candidate-dashboard', label: 'Dashboard', icon: <RxDashboard size={'30'} />, iconColor: '#007bff' },
        { to: '/candidate-dashboard/candidate-jobs', label: 'Jobs', icon: <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: '1.7rem' }} />, iconColor: '#007bff' },
        { to: '/candidate-dashboard/candidate-companies', label: 'Companies', icon: <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '1.7rem' }} />, iconColor: '#007bff' },
        { to: '/candidate-dashboard/my-application', label: 'Applications', icon: <FontAwesomeIcon icon={faFileLines} style={{ fontSize: '1.7rem' }} />, iconColor: '#007bff' },
        { to: '/candidate-dashboard/resume', label: 'Resumes', icon: <FontAwesomeIcon icon={faFile} style={{ fontSize: '1.7rem' }} />, iconColor: '#007bff' },
        { to: '/candidate-dashboard/profile', label: 'Profile', icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.7rem' }} />, iconColor: '#007bff' },
        { to: '/candidate-dashboard/payment', label: 'Payment', icon: <FontAwesomeIcon icon={faMoneyCheckDollar} style={{ fontSize: '1.7rem' }} />, iconColor: '#007bff' },
        { to: '/contact', label: 'Contact', icon: <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1.7rem' }} /> }
    ];
    const scrollContainerRef = useRef(null);
    useEffect(() => {
        // Restore scroll position when component mounts or location changes
        if (scrollContainerRef.current) {
            const savedScrollPosition = sessionStorage.getItem('leftSideScrollPosition');
            if (savedScrollPosition) {
                scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
            }
        }

        // Save scroll position when component unmounts or location changes
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
    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open);
    };

    const renderNavLinks = () => (
        <Nav className="flex-column full-height align-items-center">
            {navLinks.map((link, index) => (
                <React.Fragment key={index}>
                    {!link.subLinks ? (
                        <Link
                            to={{ pathname: link.to, state: { userName, userId } }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(link.to, { state: { userName, userId } });
                               
                            }}
                            className="nav-link d-flex align-items-center"
                            style={{
                                fontSize: '1.1rem',
                                transition: 'color 0.3s',
                                color: 'black',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                {link.icon && <span style={{ marginRight: '10px' }}>{link.icon}</span>}
                                {link.label}
                            </div>
                        </Link>
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
                                    color: 'black',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    {link.icon && <span style={{ marginRight: '10px' }}>{link.icon}</span>}
                                    {link.label}
                                </div>
                            </div>
                            {isJobsDropdownOpen && (
                                <div className="dropdown-menu show" style={{ position: 'absolute', padding: '5px 0', overflow: 'hidden' }}>
                                    {link.subLinks.map((subLink, subIndex) => (
                                        <Link
                                            key={subIndex}
                                            to={{ pathname: subLink.to, state: { userName, userId } }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(subLink.to, { state: { userName, userId } });
                                            
                                            }}
                                            className="dropdown-item"
                                            style={{ textAlign: 'start' }}
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

    return (
        <div
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
}
export default CandidateLeftSide;
