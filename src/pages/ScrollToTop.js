
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        // Scroll to the top of the page whenever the location changes
        window.scrollTo(0, 0);
    }, [location]); // Dependency array makes sure it runs on route change

    return null; // This component does not render anything visible
};

export default ScrollToTop;
