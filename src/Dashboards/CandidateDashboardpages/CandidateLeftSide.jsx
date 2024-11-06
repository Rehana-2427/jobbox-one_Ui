import { faBuilding, faEnvelope, faFile, faFileLines, faLayerGroup, faMoneyCheckDollar, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function CandidateLeftSide({ user, onClose }) {

    const { userName, userId } = user;
    const navigate = useNavigate();
    const location = useLocation();
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 900);
    const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);

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

    return (
        <div>
            <Button
                onClick={onClose}
                variant='secondary'
                style={{ display: isSmallScreen ? 'block' : 'none', marginLeft: '12px' }}
            >
                <FontAwesomeIcon icon={faTimes} style={{ fontSize: '1.5rem', color: 'black' }} />
            </Button>
            <Navbar expand="lg" className="flex-column align-items-center" style={{ height: '100vh', backgroundColor: 'white' }}>

                <Container fluid className="flex-column">

                    <Navbar.Brand>
                        <a href="/">
                            <img
                                style={{ backgroundColor: 'white' }}
                                src="/jb_logo.png"
                                alt="jobboxlogo"
                                className="auth-logo"
                            />
                        </a>
                    </Navbar.Brand>

                    <Navbar.Text>
                        <h2 style={{ color: 'black' }}>{userName}</h2>
                    </Navbar.Text>
                    <div ref={scrollContainerRef} className='scrollbar-container' style={{ height: 'calc(100vh - 170px)', overflowY: 'auto', paddingRight: '10px', color: 'gray' }}>
                        <Nav className="flex-column full-height align-items-center">
                            {navLinks.map((link, index) => (
                                <React.Fragment key={index}>
                                    {!link.dropdown ? (
                                        // Regular nav links
                                        <Link
                                            to={{ pathname: link.to, state: { userId, userName } }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(link.to, { state: { userId, userName } });
                                                if (isSmallScreen) {
                                                    onClose(); // Hide the sidebar on small screens
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
                                        // Dropdown link for "All Jobs"
                                        <Dropdown
                                            className="w-100"
                                            onMouseEnter={() => setIsJobsDropdownOpen(true)}
                                            onMouseLeave={() => setIsJobsDropdownOpen(false)}
                                            show={isJobsDropdownOpen}
                                        >
                                            <Dropdown.Toggle
                                                className="nav-link d-flex align-items-center"
                                                style={{
                                                    fontSize: '1.1rem',
                                                    color: 'black',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'transparent',
                                                    position: 'relative',
                                                    left: '20px'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                    {link.icon && <span style={{ marginRight: '10px' }}>{link.icon}</span>}
                                                    {link.label}
                                                </div>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu
                                                style={{
                                                    display: isJobsDropdownOpen ? 'block' : 'none',
                                                    position: 'absolute',
                                                    right: '50px',
                                                    top: '100%',
                                                    width: '100%',
                                                    padding: '0',
                                                    margin: '0',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {link.subLinks.map((subLink, subIndex) => (
                                                    <Dropdown.Item
                                                        as={Link}
                                                        key={subIndex}
                                                        to={{ pathname: subLink.to, state: { userId, userName } }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigate(subLink.to, { state: { userId, userName } });
                                                            if (isSmallScreen) {
                                                                onClose(); // Hide the sidebar on small screens
                                                            }
                                                        }}
                                                        style={{ width: '115px', position: 'relative', right: '20px' }}
                                                    >
                                                        {subLink.label}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                    <hr style={{ width: '100%', borderColor: 'black' }} />
                                </React.Fragment>
                            ))}
                        </Nav>
                    </div>

                </Container>
            </Navbar>
        </div>
    );
}
export default CandidateLeftSide;
