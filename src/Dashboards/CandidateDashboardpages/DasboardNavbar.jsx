import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import CandidateLeftSide from './CandidateLeftSide';
import axios from 'axios';

const DasboardNavbar = ({ isSidebarOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const userId = location.state?.userId || '';
    const [userName, setUserName] = useState(location.state?.userName || '');
    const [countOfUnreadNotification, setCountOfUnreadNotification] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState([]);

    // Fetch user data and notifications on mount or userId change
    useEffect(() => {
        const storedUserName = localStorage.getItem(`userName_${userId}`);
        if (storedUserName) {
            setUserName(storedUserName);
        }

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/getUnreadNotifications`, {
                    params: { userId }
                });
                setCountOfUnreadNotification(response.data.count);
                setUnreadNotifications(response.data.notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [userId]);

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
                localStorage.removeItem(`userName_${userId}`);
                // Navigate to the login page or home page
                navigate('/'); // Update with the appropriate path for your login page
            }
        });
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.post(`${BASE_API_URL}/markNotificationsAsRead`, null, {
                params: { userId, notificationId }
            });
            // Update state to reflect the notification as read
            const updatedNotifications = unreadNotifications.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            );
            setUnreadNotifications(updatedNotifications);
            setCountOfUnreadNotification(prevCount => prevCount - 1); // Decrease unread count
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <div className="main-header" style={{ position: 'fixed', width: '100%' }}>
            <div className="logo">
                <img src="/jb_logo.png" alt="Logo" style={{ width: '200px', height: '70px', marginLeft: '30px' }} />
            </div>

            <div className="menu-toggle" style={{ marginLeft: '50px' }} onClick={toggleSidebar}>
                <div />
                <div />
                <div />
            </div>

            {isSidebarOpen && (
                <CandidateLeftSide user={{ userName, userId }} isOpen={isSidebarOpen} />
            )}

            <div className="d-none d-lg-flex align-items-center gap-3">
                {/* MEGA MENU BUTTON (Only Icon) */}
                <div className="mega-menu-icon cursor-pointer">
                    Mega Menu
                </div>
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
                    <Dropdown className="ml-2">
                        <Dropdown.Toggle
                            as="div"
                            id="dropdownNotification"
                            className="badge-top-container toggle-hidden ml-2"
                        >
                            <span className="badge bg-primary cursor-pointer">
                                {countOfUnreadNotification}
                            </span>
                            <i className="i-Bell text-muted header-icon" />
                        </Dropdown.Toggle>
                        {countOfUnreadNotification > 0 && (
                            <Dropdown.Menu>
                                {unreadNotifications.length === 0 ? (
                                    <Dropdown.Item>No new notifications</Dropdown.Item>
                                ) : (
                                    unreadNotifications.map((notification, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => markNotificationAsRead(notification.id)}
                                            className={notification.read ? 'read-notification' : 'unread-notification'}
                                        >
                                            {notification.message}
                                        </Dropdown.Item>
                                    ))
                                )}
                            </Dropdown.Menu>
                        )}
                    </Dropdown>
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
    );
};

export default DasboardNavbar;
