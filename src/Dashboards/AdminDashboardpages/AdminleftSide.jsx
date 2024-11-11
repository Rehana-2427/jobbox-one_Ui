import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { faBuilding, faComment, faHouse, faPlusCircle, faTimes, faUserAlt, faUserCheck, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function AdminLeftSide({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 900);
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
    { to: '/admin-dashboard', label: 'Dashboard', icon: <RxDashboard size={'30'} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/user-validation', label: 'User Validation', icon: <FontAwesomeIcon icon={faUserCheck} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/company-validation', label: 'Com Validation', icon: <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '1.5rem', alignItems: 'center' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/allowing-access', label: 'Access', icon: <FontAwesomeIcon icon={faAccessibleIcon} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/block-account', label: 'Block Account', icon: <FontAwesomeIcon icon={faUserLock} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/add-company-details', label: 'Com Details', icon: <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/my-profile', label: 'My Profile', icon: <FontAwesomeIcon icon={faUserAlt} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/admin-dashboard/contacts', label: 'Contacts', icon: <FontAwesomeIcon icon={faComment} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
    { to: '/', label: 'Home', icon: <FontAwesomeIcon icon={faHouse} style={{ fontSize: '1.5rem' }} />, iconColor: '#007bff' },
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
      <Navbar expand="lg" className="flex-column align-items-start" style={{ height: '100vh', backgroundColor: 'white' }}>
        <Container fluid className="flex-column">
          <Navbar.Brand>
            <img
              style={{ backgroundColor: 'white' }}
              src="/jb_logo.png"
              alt="jobboxlogo"
              className='auth-logo'
            />
          </Navbar.Brand>
          <Navbar.Text>
            <h2 style={{ color: 'black' }}>Admin Name</h2>
          </Navbar.Text>
          <div ref={scrollContainerRef} className='scrollbar-container' style={{ height: 'calc(100vh - 170px)', overflowY: 'auto', paddingRight: '10px', color: 'gray' }}>
            <Nav className="flex-column full-height align-items-center">
              {navLinks.map((link, index) => (
                <React.Fragment key={index}>
                  <Link
                    to={link.to}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.to);
                    }}
                    className="nav-link d-flex align-items-center"
                    style={{
                      fontSize: '1.1rem',
                      transition: 'color 0.3s',
                      color: 'black',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'purple';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'black';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                      {link.icon && <span style={{ marginRight: '10px' }}>{link.icon}</span>}
                      {link.label}
                    </div>
                  </Link>
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

export default AdminLeftSide;
