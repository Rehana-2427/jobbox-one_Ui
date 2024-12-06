import React from 'react';

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
