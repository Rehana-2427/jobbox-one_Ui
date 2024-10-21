import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const CompanyAddedMsg = () => {
  return (
    <div className="company-add-msg-container">
      <h1>Thank You!</h1>
      <p>You have successfully added the company details. To access your dashboard,  <Link to="/add-company-details">click here</Link>.</p>
    </div>
  )
}

export default CompanyAddedMsg
