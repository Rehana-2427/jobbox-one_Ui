import React, { useEffect, useState } from 'react';
import CustomNavbar from './CustomNavbar';
import Footer from './Footer';

const About = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinkStyle = screenWidth > 990 ? { marginRight: '40px', marginLeft: '150px' } : {};
  return (
    <div className="about-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="custom-navbar-container">
        <CustomNavbar />
      </div>

      {/* Main content */}
      <div className='welcome-msg'>
        {/* Your main content goes here */}
        <h1>About Us</h1>


        {/* Footer section */}
        <div style={{ marginTop: '400px' }}>
          <Footer />
        </div>
      </div>
    </div>

  )
}

export default About
