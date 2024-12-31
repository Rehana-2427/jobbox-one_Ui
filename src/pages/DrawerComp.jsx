import MenuIcon from "@mui/icons-material/Menu";
import {
    Avatar,
    Box,
    Button,
    FormControl,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    MenuItem,
    Drawer as MuiDrawer,
    Select
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert

const pages = [
    { name: "Home", link: "/" },
    { name: "About Jobbox", link: "/about-jobbox" },
    { name: "About Us", link: "/aboutus" },
    { name: "Companies", link: "/jobboxcompanies" },
];

const DrawerComp = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const currentPath = window.location.pathname;
    const [selectedValue, setSelectedValue] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [usernameInitials, setUsernameInitials] = useState(""); // State to store username initials
    const [anchorEl, setAnchorEl] = useState(null); // State to manage dropdown menu
    const open = Boolean(anchorEl);
    const [user, setUser] = useState(null); // Store the user object
    const navigate = useNavigate();



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


    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget); // Open the dropdown menu
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Close the dropdown menu
    };

    // Logout function to remove user from localStorage and reset state
    const handleLogout = () => {
        setOpenDrawer(false); // Close the drawer immediately
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
            navigate('/hr-dashboard', { state: { userEmail: user.userEmail } });
        } else if (user.userRole === 'Candidate') {
            navigate('/candidate-dashboard', {
                state: { userId: user.userId, userRole: 'candidate' } // Pass userId and userRole
            });
        }

        handleMenuClose(); // Close the dropdown after navigation
    };


    return (
        <React.Fragment>
            <MuiDrawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        // height: '100vh', // Set the height to full viewport height
                        boxSizing: 'border-box', // Ensure padding and border are included in the height
                    }
                }}
            >
                <Box sx={{ width: 250, padding: 2 }}>
                    {/* Image */}
                    <img src="/jb_logo.png" alt="JobBox Logo" style={{ width: '100%', marginBottom: '16px' }} />
                    {isLoggedIn && (
                        <Box sx={{ textAlign: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
                                <Avatar
                                    sx={{ bgcolor: 'grey', cursor: 'pointer' }}
                                    onClick={handleMenuClick}
                                >
                                    {usernameInitials}
                                </Avatar>
                            </div>
                            <Box sx={{
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}>{user.userName}</Box>
                        </Box>
                    )}

                    {/* Navigation Links */}
                    <List>
                        {pages.map((page, index) => (
                            <ListItemButton
                                key={index}
                                component={Link}
                                to={page.link}
                                onClick={() => setOpenDrawer(false)}
                            >
                                <ListItemText primary={page.name} />
                            </ListItemButton>
                        ))}

                        {currentPath !== "/" && (
                            <ListItemButton
                                component={Link}
                                to="/admin-register"
                                onClick={() => setOpenDrawer(false)}
                            >
                                <ListItemText primary="Admin" />
                            </ListItemButton>
                        )}
                    </List>


                    {!isLoggedIn || (isLoggedIn && user?.userRole === 'candidate') ? (
                        <FormControl sx={{
                            m: 1, minWidth: 100, '& .MuiSelect-select': {
                                border: 'none', // Remove border
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none', // Remove outline border
                            }
                        }}

                        >
                            <Select
                                value={selectedValue}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="">
                                    <em>For Employers</em>
                                </MenuItem>
                                <MenuItem component={Link} to="/hr-signup" value="Register">Register</MenuItem>
                                <MenuItem component={Link} to="/hr-sign-in" value="Login">Login</MenuItem>
                            </Select>
                        </FormControl>
                    ) : null}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            position: 'absolute',  // Position the box at the bottom
                            bottom: '70px',  // Distance from the bottom of the viewport
                            left: '50%',  // Center horizontally
                            transform: 'translateX(-50%)',  // Adjust for centering
                            width: '100%',  // Make it full width if needed
                            maxWidth: '400px',  // Optional: limit width
                            padding: '10px',// Optional: add padding
                            overflow: 'hidden'

                        }}
                    >
                        {isLoggedIn ? (  // Show buttons based on login status
                            <>
                                <Button
                                    onClick={handleGoToDashboard}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: 'black'
                                        }
                                    }}
                                >
                                    Go to Dashboard
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'purple',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'purple',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Logout
                                </Button>
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
                                            color: 'black'
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
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}

                    </Box>
                </Box>
            </MuiDrawer>
            <IconButton
                sx={{ color: "black", marginLeft: "auto" }}
                onClick={() => setOpenDrawer(!openDrawer)}
            >
                <MenuIcon />
            </IconButton>
        </React.Fragment>
    );
};

export default DrawerComp;
