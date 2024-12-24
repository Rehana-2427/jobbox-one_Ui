import { faBuilding, faEnvelope, faFile, faFileLines, faLayerGroup, faMoneyCheckDollar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function CandidateLeftSide({ user, isOpen }) {
    const { userName, userId } = user;
    const location = useLocation();
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState(location.pathname); // Track the active link

    // Define the sidebar navigation links
    const navLinks = [
        { to: '/candidate-dashboard', label: 'Dashboard', icon: <RxDashboard size={'30'} /> },
        { to: '/candidate-dashboard/jobs', label: 'Jobs', icon: <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: '1.7rem' }} /> },
        { to: '/candidate-dashboard/companies', label: 'Companies', icon: <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '1.7rem' }} /> },
        { to: '/candidate-dashboard/my-application', label: 'Applications', icon: <FontAwesomeIcon icon={faFileLines} style={{ fontSize: '1.7rem' }} /> },
        { to: '/candidate-dashboard/resume', label: 'Resumes', icon: <FontAwesomeIcon icon={faFile} style={{ fontSize: '1.7rem' }} /> },
        { to: '/candidate-dashboard/profile', label: 'Profile', icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.7rem' }} /> },
        { to: '/candidate-dashboard/payment', label: 'Payment', icon: <FontAwesomeIcon icon={faMoneyCheckDollar} style={{ fontSize: '1.7rem' }} /> },
        { to: '/contact', label: 'Contact', icon: <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1.7rem' }} /> }
    ];

    const scrollContainerRef = useRef(null);

    // Scroll position persistence
    useEffect(() => {
        // Restore scroll position when component mounts or location changes
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

    const isLinkActive = (link) => {
        const currentPath = location.pathname;

        // Define special cases dynamically
        const specialCases = {
            '/candidate-dashboard/jobs': '/candidate-dashboard/jobs',
            '/candidate-dashboard/companies': '/candidate-dashboard/companies',
            '/candidate-dashboard/resume': '/candidate-dashboard/resume',
        };

        // Check if the link's `to` value matches any special case
        for (const [key, basePath] of Object.entries(specialCases)) {
            if (link.to === key && currentPath.startsWith(basePath)) {
                return true;
            }
        }

        // Default case: Exact match
        return currentPath === link.to;
    };


    const handleLinkClick = (to) => {
        if (to === activeLink) {
            // Prevent navigation and maintain the current scroll position
            return;
        }
        setActiveLink(to); // Set the active link
        sessionStorage.setItem('scrollPosition', scrollContainerRef.current.scrollTop);
        navigate(to, { state: { userId, userName } });
    };

    useEffect(() => {
        const savedScrollPosition = sessionStorage.getItem('scrollPosition');
        if (savedScrollPosition && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
        }
    }, [location]);
    // Render the navigation links
    const renderNavLinks = () => (
        <Nav className="flex-column full-height align-items-center">
            {navLinks.map((link, index) => (

                <React.Fragment key={index}>

                    <div style={{ position: 'relative' }}>
                        <Link
                             to={link.to}
                             onClick={(e) => {
                                 e.preventDefault();
                                 handleLinkClick(link.to);
                             }}
                            className={`nav-link d-flex align-items-center ${isLinkActive(link) ? 'active' : ''}`} style={{
                                fontSize: '1.1rem',
                                transition: 'color 0.3s',
                                color: isLinkActive(link) ? '#663399' : '#332e38',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    height: '50px',  // Set the height you want
                                    width: 'auto',  // The width will adjust based on content, or you can specify a fixed width like '200px'
                                    minWidth: '100px',  // Optional: ensure it doesn't shrink too small
                                    justifyContent: 'center'  // Optionally center content vertically within the div
                                }}>
                                    {link.icon && <span style={{ marginBottom: '10px' }}>{link.icon}</span>}
                                    {link.label}
                                </div>
                                <div
                                    className="triangle"
                                    style={{
                                        width: '0',
                                        height: '0',
                                        borderStyle: 'solid',
                                        borderWidth: '0 0 30px 30px',
                                        borderColor: 'transparent transparent #663399 transparent',
                                        position: 'absolute',
                                        top: '70%', // Center the triangle vertically
                                        left: '100%', // Position the triangle next to the label
                                        marginLeft: '10px', // Adjust horizontal spacing
                                        display: isLinkActive(link) ? 'block' : 'none',
                                    }}
                                />
                            </div>
                        </Link>
                    </div>
                    <hr style={{ width: '100%', borderColor: 'black' }} />
                </React.Fragment>
            ))}
        </Nav>
    );

    // const renderNavLinks = () => (
    //     <Nav className="flex-column full-height align-items-center">
    //         {navLinks.map((link, index) => (
    //             <React.Fragment key={index}>
    //                 <div style={{ position: 'relative' }}>
    //                     <Link
    //                         to={link.to}
    //                         onClick={(e) => {
    //                             e.preventDefault();
    //                             handleLinkClick(link.to);
    //                         }}
    //                         className={`nav-link d-flex align-items-center ${isLinkActive(link) ? 'active' : ''}`}
    //                         style={{
    //                             fontSize: '1.1rem',
    //                             transition: 'color 0.3s',
    //                             color: isLinkActive(link) ? '#663399' : '#332e38',
    //                         }}
    //                     >
    //                         <div
    //                             style={{
    //                                 display: 'flex',
    //                                 alignItems: 'center',
    //                                 flexDirection: 'column',
    //                                 position: 'relative',
    //                                 height: '50px',
    //                                 width: 'auto',
    //                                 minWidth: '100px',
    //                                 justifyContent: 'center',
    //                             }}
    //                         >
    //                             {link.icon && <span style={{ marginBottom: '10px' }}>{link.icon}</span>}
    //                             {link.label}
    //                         </div>
    //                         <div
    //                             className="triangle"
    //                             style={{
    //                                 width: '0',
    //                                 height: '0',
    //                                 borderStyle: 'solid',
    //                                 borderWidth: '0 0 30px 30px', // Adjust the size of the triangle
    //                                 borderColor: 'transparent transparent #663399 transparent',
    //                                 position: 'absolute',
    //                                 top: '70%', // Adjust position as needed
    //                                 left: '100%',
    //                                 marginLeft: '10px',
    //                                 display: isLinkActive(link) ? 'block' : 'none',
    //                             }}
    //                         />
    //                     </Link>

    //                 </div>
    //                 <hr style={{ width: '100%', borderColor: 'black' }} />
    //             </React.Fragment>
    //         ))}
    //     </Nav>
    // );





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
}

export default CandidateLeftSide;
