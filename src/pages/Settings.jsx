import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Table, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CustomNavbar from './CustomNavbar';
import './PagesStyle/Pages.css';
import Settings_Profile_Details from './Settings_Profile_Details';
import Subscription from './Subscription';

const Settings = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState({
        jobRecommendations: false,
        applicationUpdates: false,
        profileInsights: false,
        recruiterUpdates: false,
        applicationStatus: false,
        hiringTrends: false,
    });

    useEffect(() => {
        // Check if user is logged in (you can check localStorage/sessionStorage here)
        const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is saved here after login
        if (loggedInUser && loggedInUser.userName) {
            setIsLoggedIn(true);
            setUser(loggedInUser); // Set user object
        }
    }, []);

    const handleNotificationToggle = (name, value) => {
        setNotifications((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('user'); // Remove user from localStorage
                setIsLoggedIn(false);
                navigate('/'); // Redirect to home page
            }
        });
    };
    const handleDeactivateAccount = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Your account will be deactivated!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, deactivate!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                // Add your account deactivation logic here
                localStorage.removeItem('user'); // Remove user from localStorage
                setIsLoggedIn(false);
                navigate('/'); // Redirect to home page or any other page
                Swal.fire(
                    'Deactivated!',
                    'Your account has been deactivated.',
                    'success'
                );
            }
        });
    };

    return (
        <div>
            <CustomNavbar />
            <Settings_Profile_Details />
            <hr style={{ border: '1px solid black', marginLeft: '50px', marginRight: '50px' }} />

            <Container className='settings-Notifications' style={{ padding: '20px' }}>
                <Col md={3} style={{ marginBottom: '20px' }}>
                    <h3 className='text-center'>Notifications</h3>
                    <h5 className='text-center'>Manage notifications</h5>
                </Col>
                <Col>
                    <Card style={{ width: '400px', marginLeft: '400px' }}>
                        {isLoggedIn && user && user.userRole === 'Candidate' && (
                            <>
                                <h5>Candidate Notifications</h5>
                                <Table borderless responsive>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <strong>Job Recommendations</strong>
                                                <p>New Job posting notifications based on your profile</p>
                                            </td>
                                            <td>
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name="jobRecommendations"
                                                    value={notifications.jobRecommendations}
                                                    onChange={(value) => handleNotificationToggle('jobRecommendations', value)}
                                                >
                                                    <ToggleButton value={true} className="custom-toggle">Yes</ToggleButton>
                                                    <ToggleButton value={false} className="custom-toggle">No</ToggleButton>
                                                </ToggleButtonGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Application Updates</strong>
                                                <p>Track your application status</p>
                                            </td>
                                            <td>
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name="applicationStatus"
                                                    value={notifications.applicationStatus}
                                                    onChange={() => handleNotificationToggle('applicationStatus')}
                                                >
                                                    <ToggleButton value={true}>Yes</ToggleButton>
                                                    <ToggleButton value={false}>No</ToggleButton>
                                                </ToggleButtonGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Profile Insights</strong>
                                                <p>Gain insights into your profile views and receive tips to enhance your profile strength</p>
                                            </td>
                                            <td>
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name="profileInsights"
                                                    value={notifications.profileInsights}
                                                    onChange={() => handleNotificationToggle('profileInsights')}
                                                >
                                                    <ToggleButton value={true}>Yes</ToggleButton>
                                                    <ToggleButton value={false}>No</ToggleButton>
                                                </ToggleButtonGroup>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </>
                        )}
                        {isLoggedIn && user && user.userRole === 'HR' && (
                            <>
                                <h5>HR Notifications</h5>
                                <Table borderless responsive>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <strong>Recruiter Updates</strong>
                                                <p>Receive notifications for newly posted jobs that match your expertise and interests.</p>
                                            </td>
                                            <td>
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name="recruiterUpdates"
                                                    value={notifications.recruiterUpdates}
                                                    onChange={(value) => handleNotificationToggle('recruiterUpdates', value)}
                                                >
                                                    <ToggleButton value={true} className="custom-toggle">Yes</ToggleButton>
                                                    <ToggleButton value={false} className="custom-toggle">No</ToggleButton>
                                                </ToggleButtonGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Application Status Updates</strong>
                                                <p>Receive alerts on candidate application progress and status changes.</p>
                                            </td>
                                            <td>
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name="applicationUpdates"
                                                    value={notifications.applicationUpdates}
                                                    onChange={() => handleNotificationToggle('applicationUpdates')}
                                                >
                                                    <ToggleButton value={true}>Yes</ToggleButton>
                                                    <ToggleButton value={false}>No</ToggleButton>
                                                </ToggleButtonGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Hiring Trends Updates</strong>
                                                <p>Receive insights on current hiring trends and best practices to attract top candidates.</p>
                                            </td>
                                            <td>
                                                <ToggleButtonGroup
                                                    type="radio"
                                                    name="hiringTrends"
                                                    value={notifications.hiringTrends}
                                                    onChange={() => handleNotificationToggle('hiringTrends')}
                                                >
                                                    <ToggleButton value={true}>Yes</ToggleButton>
                                                    <ToggleButton value={false}>No</ToggleButton>
                                                </ToggleButtonGroup>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </>
                        )}
                    </Card>
                </Col>
            </Container>

            <hr style={{ border: '1px solid black', marginLeft: '50px', marginRight: '50px' }} />
            <Subscription />
            <hr style={{ border: '1px solid black', marginLeft: '50px', marginRight: '50px' }} />

            <Container className='settings-Notifications' style={{ padding: '20px' }}>
                <Col md={6} style={{ marginBottom: '20px',position:'relative',right:'100px' }}>
                    <h3 className='text-center'>Session Management</h3>
                    <h5 className='text-center'>Sign out of all active sessions across all devices.</h5>
                </Col>
                <Col style={{ position:'relative',left:'150px' }}>
                
                    <Button onClick={handleLogout}>Logout</Button>
                    <hr style={{ border: '1px solid black', marginRight: '70px' }} />
                    <h4>Deactivate your account</h4>
                    <p>Temporarily hide your profile from recruiters</p>
                    <p style={{ color: 'purple' }} onClick={handleDeactivateAccount}>Temporarily Deactivate Account</p>
                </Col>
            </Container>
        </div >
    );
};

export default Settings;
