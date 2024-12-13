import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DasboardNavbar from "./DasboardNavbar"; // Import your sidebar/navbar component

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility
  const [isMobileView, setIsMobileView] = useState(false); // Detect if it's mobile view
  const location = useLocation();

  // Retrieve user email and name from location state or default empty values
  const userEmail = location.state?.userEmail || '';
  const [userName, setUserName] = useState(location.state?.userName || '');

  useEffect(() => {
    const storedUserName = localStorage.getItem(`userName_${userEmail}`);
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [userEmail]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) { // 768px is the breakpoint for mobile view
        setIsMobileView(true);
        setIsSidebarOpen(false); // Ensure sidebar is closed on mobile by default
      } else {
        setIsMobileView(false);
        setIsSidebarOpen(true); // Keep sidebar open for larger screens
      }
    };

    // Listen for window resize
    window.addEventListener("resize", handleResize);
    handleResize(); // Run once to set the initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility for mobile
    } else {
      setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility for larger screens
    }
  };

  const handleLinkClick = () => {
    if (isMobileView) {
      setIsSidebarOpen(false); // Close the sidebar on mobile when clicking outside
    }
  };

  // User object to pass to HrLeftSide
  const user = {
    userName: userName,
    userEmail: userEmail,
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      {/* Left Side: Sidebar */}
      <div
        style={{
          width: isSidebarOpen ? (isMobileView ? "10%" : "14%") : "0", // For mobile, sidebar takes 80% width when open
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
          position: isMobileView ? "absolute" : "relative", // Sidebar should overlay content on mobile
          zIndex: isMobileView ? "1000" : "auto", // Ensure sidebar appears above content on mobile
          transition: "width 0.3s ease-in-out", // Smooth transition for larger screens
        }}
      >
        <DasboardNavbar user={user} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Right Side: Main Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "80px",
          marginLeft: isMobileView ? "0" : isSidebarOpen ? "0" : "0", // No margin for mobile; adjust for sidebar on larger screens
          width: "100%", // Right side content always takes full width
          transition: isMobileView ? "none" : "margin-left 0.3s ease-in-out", // Smooth transition only on larger screens
        }}
        onClick={handleLinkClick}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
