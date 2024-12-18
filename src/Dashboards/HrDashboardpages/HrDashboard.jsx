import React, { useEffect } from 'react';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import CompanyStatusCards from './CompanyStatusCards';
import DashboardLayout from './DashboardLayout ';
import StatusGraph from './StatusGraph';
import { useNavigate } from 'react-router-dom';

// Register the necessary scales and elements with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HrDashboard = () => {
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if the hash contains the query parameters
    const hash = window.location.hash;

    // Ensure the URL contains query parameters after the hash (e.g., ?userName=john_doe)
    const urlParams = new URLSearchParams(hash.split('?')[1]);
     // Get the userName from the URL, handle empty string as null
     const userNameFromUrl = urlParams.get('userName') ? decodeURIComponent(urlParams.get('userName')) : null;
    // Get the userName from localStorage
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    const userNameFromLocalStorage = userFromLocalStorage ? userFromLocalStorage.userName : null;

    console.log("user -->", userFromLocalStorage);
    console.log("url name -->", userNameFromUrl, typeof(userNameFromUrl)," local name -->", userNameFromLocalStorage);

    // Check if userName is in the URL and matches the localStorage value
    if (userNameFromUrl !== null) {
      // If userNameFromUrl exists, compare it with the localStorage value
      if (userNameFromUrl === userNameFromLocalStorage) {
        // If they match, stay in the Candidate Dashboard
        console.log('Usernames match. Staying on the dashboard.');
      } else {
        // If they don't match, redirect to the login page
        console.log('If they dont match, redirect to the login page.');
        navigate('/login');
      }
    } else {
      // If no userName is present in the URL
      if (userFromLocalStorage) {
        // If there's a valid user in localStorage, stay in the dashboard
        console.log('No userName in URL, but user is logged in. Staying on the dashboard.');
      } else {
        // If no userName in the URL and no user in localStorage, redirect to login page
        console.log('If no userName in the URL and no user in localStorage, redirect to login page.');
        navigate('/login');
      }
    }
  }, [navigate]); // Re-run the effect when the navigate function changes

  return (
    <DashboardLayout>
      <div className="main-content">
        <h3 className="status-info text-center bg-light">Company Status</h3>
        <CompanyStatusCards />
        <StatusGraph />
      </div>
    </DashboardLayout>
  );
};

export default HrDashboard;
