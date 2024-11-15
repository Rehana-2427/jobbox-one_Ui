import { faAddressCard, faBriefcase, faBuilding, faEnvelope, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HrLeftSide = ({ user, onClose }) => {
    const { userName, userEmail } = user;
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
        { to: '/hr-dashboard', label: 'Dashboard', icon: <RxDashboard size={30} /> },
        { to: '/hr-dashboard/my-jobs', label: 'My Jobs', icon: <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '1.7rem' }} /> },
        {
            label: 'All Jobs',
            icon: <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: '1.7rem' }} />,
            subLinks: [
                { to: '/hr-dashboard/posted-jobs', label: 'Posted Jobs' },
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

    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open);
    };

    const renderNavLinks = () => (
        <Nav className="flex-column full-height align-items-center">
            {navLinks.map((link, index) => (
                <React.Fragment key={index}>
                    {!link.subLinks ? (
                        <Link
                            to={{ pathname: link.to, state: { userName, userEmail } }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(link.to, { state: { userName, userEmail } });
                                if (isSmallScreen) {
                                    onClose();
                                }
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
                                            to={{ pathname: subLink.to, state: { userName, userEmail } }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(subLink.to, { state: { userName, userEmail } });
                                                if (isSmallScreen) {
                                                    onClose();
                                                }
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
        <div>
            {isSmallScreen ? (
                <>
                    <IconButton onClick={toggleDrawer(true)} style={{ marginLeft: '12px' }}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        anchor="left"
                        open={isDrawerOpen}
                        onClose={toggleDrawer(false)}
                        elevation={0}
                        PaperProps={{
                            sx: {
                                boxShadow: 'none', // Removes any potential shadow
                                border: 'none',    // Ensures no border or shadow effect
                            },
                            style: {
                                boxShadow: 'none', // Ensures no shadow on the Drawer paper itself
                                color:'black'
                            },
                        }}
                        BackdropProps={{ invisible: true }}
                    >
                        <div style={{ width: 250, padding: '10px' }}>
                            <Navbar.Brand>
                                <a href="/">
                                    <img src="/jb_logo.png" alt="jobboxlogo" className="auth-logo" style={{ backgroundColor: 'white' }} />
                                </a>
                            </Navbar.Brand>
                            <Navbar.Text>
                                <h2 style={{ color: 'black' }}>{userName}</h2>
                            </Navbar.Text>
                            <div ref={scrollContainerRef} style={{ height: 'calc(100vh - 170px)', overflowY: 'auto', paddingRight: '10px', color: 'gray' }}>
                                {renderNavLinks()}
                            </div>
                        </div>
                    </Drawer>
                </>
            ) : (
                <Navbar expand="lg" className="flex-column align-items-center" style={{ height: '100vh', backgroundColor: 'white', textAlign: 'center' }}>
                    <Container fluid className="flex-column">
                        <Navbar.Brand>
                            <a href="/">
                                <img src="/jb_logo.png" alt="jobboxlogo" className="auth-logo" style={{ backgroundColor: 'white' }} />
                            </a>
                        </Navbar.Brand>
                        <Navbar.Text>
                            <h2 style={{ color: 'black' }}>{userName}</h2>
                        </Navbar.Text>
                        <div ref={scrollContainerRef} className="scrollbar-container" style={{ height: 'calc(100vh - 170px)', overflowY: 'auto', paddingRight: '10px', color: 'gray' }}>
                            {renderNavLinks()}
                        </div>
                    </Container>
                </Navbar>
            )}
        </div>
    );
};

export default HrLeftSide;
