import React, { useState } from "react";
import DasboardNavbar from "./DasboardNavbar"; // Import your sidebar/navbar component

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      {/* Left Side: Sidebar */}
      <div
        style={{
          width: isSidebarOpen ? "14%" : "0", // Adjust width based on sidebar state
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
          transition: "width 0.3s ease-in-out", // Smooth transition
        }}
      >
        <DasboardNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Right Side: Main Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "80px",
          marginLeft: isSidebarOpen ? "0" : "20px", // Adjust margin when sidebar is closed
          width: isSidebarOpen ? "calc(100% - 14%)" : "100%", // Adjust width based on sidebar state
          transition: "width 0.3s ease-in-out", // Smooth transition
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
