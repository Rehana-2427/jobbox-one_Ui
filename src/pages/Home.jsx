import React, { useEffect, useState } from 'react';
import CircularImageSlider from './CircularImageSlider';
import CustomNavbar from './CustomNavbar';
import Footer from './Footer';
import Jobboxcard from './Jobboxcard';
import './PagesStyle/Pages.css';
import ServicesCard from './ServicesCard';
import Testimonials from './Testimonials';
import Welcome from './Welcome';

const Home = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [padding, setPadding] = useState(50);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setPadding(10);
      } else if (window.innerWidth < 768) {
        setPadding(100);
      } else {
        setPadding(20);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <div className="custom-navbar-container">
        <CustomNavbar />
      </div>
      <div>
        <div className='welcome-msg'>
          <Welcome />
        </div>
        <div className="home-video-card">
          <div className="column">
            <video width="100%" autoPlay muted loop>
              <source src="\jobbox-one-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="steps-container column">
            <div className='cta-content'>
              <span className='thq-heading-2' style={{ borderBottom: '2px solid purple', display: 'inline-block' }} >Find Your Dream Job</span>
              <p className='thq-body-large'>
                "Discover job opportunities and advance your career with JobBox. We connect you with top employers and help you find roles that match your skills and interests. Start your journey today and unlock your potential! Whether you're looking for your first job or the next step in your career, JobBox has something for everyone. Join us and take the first step toward a brighter future!"
              </p>
              <div className='cta-actions'>
                <a href="/#/browse-jobs" target="_blank" rel="noopener noreferrer">
                  <button type="button" className="thq-button-filled cta-button">
                    Browse Jobs
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='jobbox-card'>
          <Jobboxcard />
        </div>
        <div>
          <ServicesCard />
        </div>
        <div style={{ paddingTop: `${padding}px`, paddingBottom: `${padding}px` }}>
          <CircularImageSlider />
        </div>

        <div>
          <Testimonials />
        </div>
        {/* <div>
        <HomeFooter />
      </div> */}
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
