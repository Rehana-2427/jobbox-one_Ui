import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [user, setUser] = useState(null); // Store the user object
    const [userId, setUserId] = useState(null); // State to store userId
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in (you can check localStorage/sessionStorage here)
        const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is saved here after login
        if (loggedInUser && loggedInUser.userName) {
            setIsLoggedIn(true);
            setUser(loggedInUser); // Set user object
            if (loggedInUser.userRole === 'Candidate') {
                setUserId(loggedInUser.userId); // Store userId for candidate
            }
        }
    }, []);

    const handleJoinUsClick = () => {
        // Check if user is a candidate and has a user ID
        if (isLoggedIn && user && user.userRole === 'Candidate' && userId) {
            navigate('/candidate-dashboard', {
                state: { userId: user.userId, userRole: 'candidate' } // Pass userId and userRole
            });
        } else {
            navigate('/signin'); // Navigate to signin page if candidate is not logged in
        }
    };
    return (
        <div className='text-center'>
            <h1>Welcome to <b style={{color:'purple'}}>Job</b><b style={{color:'gray'}}>box.one</b> - Your Career Partner</h1>
            <p>At jobbox.one, we connect job seekers with tailored opportunities that align perfectly with their career goals.</p>
            <p>Our platform offers resources and support to enhance your job search journey, ensuring you have the tools you need to succeed.</p>
            <p>Join our community today and take the first step towards achieving your dream career!</p>
            <Button onClick={handleJoinUsClick} style={{ marginTop: '14px' }}>Join us today!</Button>
        </div>
    )
}

export default Welcome
