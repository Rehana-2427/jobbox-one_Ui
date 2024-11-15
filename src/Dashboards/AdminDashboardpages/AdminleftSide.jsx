import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { faBuilding, faComment, faHouse, faPlusCircle, faUserAlt, faUserCheck, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useRef, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { RxDashboard } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';


function AdminLeftSide({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const renderNavLinks = () => (
    <Nav className="flex-column full-height align-items-center">
      {navLinks.map((link, index) => (
        <React.Fragment key={index}>
          <Link
            to={link.to}
            onClick={() => {
              navigate(link.to);
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
                color: 'black'
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
                <h2 style={{ color: 'black' }}>Admin</h2>
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
            <div ref={scrollContainerRef} className="scrollbar-container" style={{ height: 'calc(100vh - 170px)', overflowY: 'auto', paddingRight: '10px', color: 'gray' }}>
              {renderNavLinks()}
            </div>
          </Container>
        </Navbar>
      )}
    </div>
  );
}

export default AdminLeftSide;
