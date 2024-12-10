
import React from 'react';
import DashboardBrief from './DashboardBrief';
import DashboardLayout from './DashboardLayout';
import StatusGraph from './StatusGraph';


const CandidateDashboard = () => {
  
  return (
    <DashboardLayout>
      <div className="main-content">
        <h3 className='status-info text-center bg-light'>Application Status</h3>
        <DashboardBrief />
        <StatusGraph />
      </div>

    </DashboardLayout>
  );
};

export default CandidateDashboard;


