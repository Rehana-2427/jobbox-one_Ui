import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import './HrDashboard.css';
import HrLeftSide from './HrLeftSide';

const DasboardNavbar = ({ user, isSidebarOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    // Initialize state with defaults
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // If user prop is available, use it, else fallback to location.state
        if (user) {
            setUserName(user.userName || '');  // Set userName from user prop
            setUserEmail(user.userEmail || '');      // Set userId from user prop
        } else if (location.state) {
            // If user prop is not available, fallback to location.state
            setUserName(location.state?.userName || '');
            setUserEmail(location.state?.userEmail || '');
        }
        console.log("userName --> " + userName + " and userEmail --> " + userEmail);
    }, [user, location.state]);  // Effect depends on user and location.state 
    useEffect(() => {
        const storedUserName = localStorage.getItem(`userName_${userEmail}`);
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, [userEmail]);


    const convertToUpperCase = (str) => {
        return String(str).toUpperCase();
    };

    const getInitials = (name) => {
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
        } else {
            return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
        }
    };
    const initials = getInitials(userName);
    const toggleFullScreen = () => {
        if (document.fullscreenEnabled) {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen();
            else document.exitFullscreen();
        }
    };


    const { logout } = useAuth(); // Get logout function from context

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure you want to logout?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                logout(); // Call the logout function
                // Clear user data from localStorage
                localStorage.removeItem(`userName_${userEmail}`);
                // Navigate to the login page or home page
                navigate('/'); // Update with the appropriate path for your login page
            }
        });
    };

    return (
        <div className="main-header" style={{ position: 'fixed' }}>
            <div className="dashboard-navbar-logo">
                {isSidebarOpen ? (
                    <img src="/jb_logo.png" alt="Logo" style={{ height: '60px', width: '150px' }} />
                ) : (
                    <img src="/jb_temp_logo.png" alt="Logo" style={{ height: '70px', width: '70px' }} />
                )}
            </div>

            <div className="menu-toggle" style={{ marginLeft: '50px' }} onClick={toggleSidebar}>
                <div />
                <div />
                <div />
            </div>
            {isSidebarOpen && (
                <HrLeftSide user={{ userName, userEmail }} isOpen={isSidebarOpen} />
            )}

            <div className="d-none d-lg-flex align-items-center gap-3">
                {/* MEGA MENU BUTTON (Only Icon) */}
                <div className="mega-menu-icon cursor-pointer">
                    Mega Menu
                </div>

                {/* SEARCH BOX INPUT (Only Icon) */}
                {/* <div className="search-bar">
                    <input type="text" placeholder="Search" />
                    <i className="search-icon text-muted i-Magnifi-Glass1" />
                </div> */}
            </div>

            <div className="m-auto" />

            <div className="header-part-right">
                {/* FULLSCREEN HANDLER (Only Icon) */}
                <i
                    datafullscreen="true"
                    className="i-Full-Screen header-icon d-none d-sm-inline-block"
                    onClick={toggleFullScreen}
                />

                {/* APPS MENU BAR (Only Icon) */}
                <div className="app-menu-icon">
                    <i className="i-Safe-Box text-muted header-icon" />
                </div>

                {/* NOTIFICATION MENU BAR (Only Icon) */}
                <div className="notification-icon-container">
                    <span className="badge bg-primary cursor-pointer"></span>
                    <i className="i-Bell text-muted header-icon" />
                </div>

                {/* USER PROFILE MENU BAR (Only Icon) */}
                <div className="user col px-3">
                    <Dropdown className="ml-2">
                        <Dropdown.Toggle as="span" className="toggle-hidden">
                            <div className="initials-placeholder">
                                {initials}
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="mt-3">
                            <Dropdown.Item as={Link} to="/settings">
                                <i className="i-Data-Settings me-1" /> Account settings
                            </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={handleLogout}>
                                <i className="i-Lock-2 me-1" /> Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>

    )
}

export default DasboardNavbar
