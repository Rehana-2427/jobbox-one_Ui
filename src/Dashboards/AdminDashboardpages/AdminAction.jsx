import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button, Table } from 'react-bootstrap';
import swal from 'sweetalert2';
import Pagination from '../../Pagination';
import AdminleftSide from './AdminleftSide';




const BASE_API_URL = process.env.REACT_APP_API_URL;
const AdminAction = () => {
  const [hrDetails, setHRDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHRDetails = async () => {
    try {

      const params = {
        page: page,
        size: pageSize,
      };
      const response = await axios.get(`${BASE_API_URL}/getHr`, { params })
      setTotalPages(response.data.totalPages);
      setHRDetails(response.data.content);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRDetails();
  }, [page, pageSize]);

  const appliedOn = new Date(); // Get current date and time
  const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
  const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
  const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month

  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate); // Output: 2024-07-09 (example for today's date)

  const approveRequest = async (userEmail, userId) => {
    console.log('Request Approved');
    const approved = "Approved";

    try {
      const res = await axios.put(`${BASE_API_URL}/updateApprove?userEmail=${userEmail}&approvedOn=${formattedDate}&userStatus=${approved}`);
      console.log(res.data);
      console.log(res.data);
      if (res.data) {
        await swal.fire({
          icon: "success",
          title: "Approval Successful!",
          text: "The request has been approved."
        });
        fetchHRDetails(); // Reload HR details after approval
      } else {
        throw new Error('Approval failed');
      }
    } catch (error) {
      console.log('Error approving request:', error);
      await swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: "Failed to approve the request. Please try again later."
      });
    }
  };

  const rejectRequest = async (userEmail, userId) => {
    console.log('Request Rejected');
    const rejected = "Rejected";
    try {
      const res = await axios.put(`${BASE_API_URL}/updateApprove?userEmail=${userEmail}&approvedOn=${formattedDate}&userStatus=${rejected}`);
      console.log(res.data);

      if (res.data) {
        await swal.fire({
          icon: "success",
          title: "Rejection Successful!",
          text: "The request has been rejected."
        });
        fetchHRDetails(); // Reload HR details after rejection
      } else {
        throw new Error('Rejection failed');
      }
    } catch (error) {
      console.log('Error rejecting request:', error);
      await swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: "Failed to reject the request. Please try again later."
      });
    }
  };
  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size changes
  };

  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

  useEffect(() => {
    // Update the `isSmallScreen` state based on screen resizing
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 767);

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='dashboard-container'>

      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
        <AdminleftSide onClose={toggleLeftSide} />
      </div>

      <div className="right-side">

        <div
          style={{
            overflowY: 'auto',
            maxHeight: isSmallScreen ? '600px' : '1000px',
            paddingBottom: '20px'
          }}
        >
          <header className="admin-header">
            <h2 style={{ color: 'wheat' }}>User Validation</h2>
          </header>
          <div className='table-details-list table-wrapper'>
            <Table hover className='text-center'>
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>CompanyWebsite</th>
                  <th>Date of user registarion</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hrDetails.map(hr => (
                  <tr key={hr.userId}>
                    <td>{hr.userName} ({hr.companyName} HR)</td>
                    <td>{hr.userEmail}</td>
                    <td>{hr.companyWebsite}</td>
                    <td>{hr.appliedDate}</td>
                    <td>
                      <Button key='success' variant='success' className="m-1 text-capitalize" onClick={() => approveRequest(hr.userEmail, hr.userId)}>
                        Approve
                      </Button>

                      <Button key='danger' variant='danger' className="m-1 text-capitalize" onClick={() => rejectRequest(hr.userEmail, hr.userId)}>
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}

          <Pagination
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            handlePageSizeChange={handlePageSizeChange}
            isPageSizeDisabled={isPageSizeDisabled}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>
    </div>

  );

};

export default AdminAction;
