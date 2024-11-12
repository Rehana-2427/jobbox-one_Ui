import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const AllowingAccess = () => {
  const [accessData] = useState([
    { user: 'HR', accessTo: 'Posting Jobs', accessStatus: 'Allow' },
    { user: 'Candidate', accessTo: 'Applying Jobs', accessStatus: 'Allow' },
    { user: 'HR', accessTo: 'Posting Jobs', accessStatus: 'Allow' },
  ]);
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };
  return (
    <div className='dashboard-container'>
      <div>
        <button className="hamburger-icon" onClick={toggleLeftSide} >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
      <AdminleftSide onClose={toggleLeftSide} />
      </div>

      <div className="right-side">
        <div>
          <h2 style={{ textAlign: 'center' }}>Access Dashboard</h2>
          <div className='table-details-list table-wrapper'>
          <Table hover className='text-center' >
              <thead className="table-light">
                <tr >
                  <th >User</th>
                  <th >Access To</th>
                  <th >Access Status</th>
                </tr>
              </thead>
              <tbody>
                {accessData.map((data, index) => (
                  <tr key={index} >
                    <td >{data.user}</td>
                    <td >{data.accessTo}</td>
                    <td >{data.accessStatus}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          </div>
        </div>
      </div>
  )
}

export default AllowingAccess
