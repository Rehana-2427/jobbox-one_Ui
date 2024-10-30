import { AppBar, Avatar, Box, Button, FormControl, Menu, MenuItem, Select, Tab, Tabs, Toolbar, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert


// Import your CSS file
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import DrawerComp from "./DrawerComp";

const CustomNavbar = () => {
    const currentPath = window.location.pathname;
    const [value, setValue] = useState();
    const [selectedValue, setSelectedValue] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [usernameInitials, setUsernameInitials] = useState(""); // State to store username initials
    const [anchorEl, setAnchorEl] = useState(null); // State to manage dropdown menu
    const open = Boolean(anchorEl);
    const [user, setUser] = useState(null); // Store the user object
    const navigate = useNavigate();


    const { users } = useAuth(); // Get the user from context

    useEffect(() => {
        // Check if user is logged in (you can check localStorage/sessionStorage here)
        const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is saved here after login
        if (loggedInUser && loggedInUser.userName) {
            setIsLoggedIn(true);
            setUser(loggedInUser); // Set user object
            setUsernameInitials(loggedInUser.userName.slice(0, 2).toUpperCase()); // Extract first two letters and capitalize
        }
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);

        // Navigate based on the selected value
        if (value === "Register") {
            navigate('/hr-signup'); // Link for HR registration
        } else if (value === "Login") {
            navigate('/signin'); // Link for HR login
        }
    };
    // Custom breakpoints
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    const isMediumScreen = useMediaQuery('(max-width: 800px)');
    const isLargeScreen = useMediaQuery('(max-width: 990px)');
    //  const isExtraLargeScreen = useMediaQuery('(max-width: 1200px)');

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget); // Open the dropdown menu
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Close the dropdown menu
    };

    // Logout function to remove user from localStorage and reset state
    // Logout function to remove user from localStorage and reset state
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
                handleMenuClose(); // Close the dropdown
            }
        });
    };

    const handleGoToDashboard = () => {
        if (!user) return; // Exit early if user is not available

        // Navigate based on user role and status
        if (user.userRole === 'HR' && user.userStatus === 'Approved') {
            navigate('/hr-dashboard', { state: { userEmail: user.userEmail, userRole: 'HR' } });
        } else if (user.userRole === 'Candidate') {
            navigate('/candidate-dashboard', {
                state: { userId: user.userId, userRole: 'candidate' } // Pass userId and userRole
            });
        }

        handleMenuClose(); // Close the dropdown after navigation
    };


    return (
        <Box>
            {isSmallScreen || isMediumScreen || isLargeScreen ? (
                <DrawerComp /> // Show Drawer on smaller and medium screens
            ) : (
                <AppBar className="app-bar" style={{ backgroundColor: 'white' }}>
                    <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            <img src="/jb_logo.png" alt="JobBox Logo" style={{ width: '200px', height: 'auto', maxHeight: '100px' }} />
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <Tabs
                                value={value}
                                onChange={(e, newValue) => setValue(newValue)}
                                sx={{
                                    '& .MuiTab-root': {
                                        color: 'black', // Keep tab text color black by default
                                        transition: 'border-bottom 0.3s ease', // Add transition for smooth effect
                                    },
                                    '& .Mui-selected': {
                                        color: 'black', // Keep selected tab text color black
                                        borderBottom: '3px solid purple', // Underline for selected tab
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: 'transparent', // Hide the default indicator
                                    },
                                }}
                            >
                                <Tab
                                    component={Link}
                                    to="/"
                                    label="Home"
                                    sx={{ borderBottom: value === 0 ? '3px solid purple' : 'none' }} // Underline for the first tab
                                />
                                <Tab
                                    component={Link}
                                    to="/about-jobbox"
                                    label="About Jobbox"
                                    sx={{ borderBottom: value === 1 ? '3px solid purple' : 'none' }} // Underline for the second tab
                                />
                                <Tab
                                    component={Link}
                                    to="/aboutus"
                                    label="About Us"
                                    sx={{ borderBottom: value === 2 ? '3px solid purple' : 'none' }} // Underline for the third tab
                                />
                                {currentPath !== '/' && (
                                    <Tab
                                        component={Link}
                                        to="/admin-register"
                                        label="Admin"
                                        sx={{ borderBottom: value === 3 ? '3px solid purple' : 'none' }} // Underline for the admin tab
                                    />
                                )}
                                <Tab
                                    component={Link}
                                    to="/jobdbcompanies"
                                    label="Companies"
                                    sx={{ borderBottom: value === (currentPath !== '/' ? 4 : 3) ? '3px solid purple' : 'none' }} // Adjust for the companies tab
                                />
                            </Tabs>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            {isLoggedIn ? (
                                <>
                                    {/* <i style={{color:'black'}}>Welcome {user.userName}</i> */}
                                    {/* Avatar for user initials */}
                                    <Avatar
                                        sx={{ bgcolor: 'grey', cursor: 'pointer' }}
                                        onClick={handleMenuClick}
                                    >
                                        {usernameInitials}
                                    </Avatar>

                                    {/* Dropdown Menu */}
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <MenuItem onClick={handleGoToDashboard}>Go to Dashboard</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/signin"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'white',
                                            color: 'black',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: 'black',
                                            }
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/candidate-signup"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'purple',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'purple',
                                                color: 'white',
                                            }
                                        }}
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </Box>
                        {/* Conditionally show "For Employers" dropdown if the user is not logged in or if logged in as HR */}
                        {!isLoggedIn || (isLoggedIn && user?.userRole === 'candidate') ? (
                            <Box>
                                <FormControl sx={{ m: 1, minWidth: 100 }}>
                                    <Select
                                        value={selectedValue}
                                        onChange={handleChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        sx={{
                                            '& .MuiSelect-select': {
                                                border: 'none',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>For Employers</em>
                                        </MenuItem>
                                        <MenuItem component={Link}
                                            to="/hr-signup" value="Register">Register
                                        </MenuItem>
                                        <MenuItem component={Link}
                                            to="/hr-sign-in" value="Login">Login
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        ) : null}

                    </Toolbar>
                </AppBar>
            )}
        </Box>
    )
}

export default CustomNavbar
