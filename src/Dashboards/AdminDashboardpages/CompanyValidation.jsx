import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import swal from 'sweetalert2';
// import './AdminDashboard.css';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import Pagination from '../../Pagination';
import AdminleftSide from './AdminleftSide';

const BASE_API_URL = process.env.REACT_APP_API_URL;
const CompanyValidation = () => {
  const [companyData, setCompanyData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');


  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };



  useEffect(() => {
    fetchCompanyData();
  }, [page, pageSize, sortedColumn, sortOrder]);

  const fetchCompanyData = async () => {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/displayCompanies`, { params });
      setCompanyData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const appliedOn = new Date(); // Get current date and time
  const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
  const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
  const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month

  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate); // Output: 2024-07-09 (example for today's date)
  const approveCompany = async (companyId, companyName) => {
    console.log('Request Approved');
    try {
      const approved = "Approved";
      const res = await axios.put(`${BASE_API_URL}/updateApproveCompany`, null, {
        params: {
          companyName,
          actionDate: formattedDate,
          companyStatus: approved,
        },
      });
      if (res.data) {
        await swal.fire({
          icon: "success",
          title: "Approval Successful!",
          text: "The request has been approved."
        });
        fetchCompanyData();
        console.log(res.data);

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

  const rejectCompany = async (companyId, companyName) => {
    console.log('Request Rejected');
    try {
      const reject = "Rejected";
      const res = await axios.put(`${BASE_API_URL}/updateApproveCompany`, null, {
        params: {
          companyName,
          actionDate: formattedDate,
          companyStatus: reject,
        },
      });
      if (res.data) {
        await swal.fire({
          icon: "success",
          title: "Rejection Successful!",
          text: "The request has been rejected."
        });
        fetchCompanyData();
      } else {
        throw new Error('Rejection failed');
      }
      console.log(res.data);

    } catch (error) {
      console.log('Error rejecting request:', error);
      await swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: "Failed to reject the request. Please try again later."
      });
    }
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
          {companyData.length > 0 ? (
            <>
              <h2 style={{ textAlign: 'center' }}>Details of Company Validation</h2>
              <div className='table-details-list table-wrapper'>
                <Table hover className='text-center' >
                  <thead className="table-light">
                    <tr>
                      <th onClick={() => handleSort('companyName')}>
                        Company Name {sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyData.map((company) => (
                      <tr key={company.companyId}>
                        <td>{company.companyName}</td>
                        <td>

                          <span className="icon-button select" onClick={() => approveCompany(company.companyId, company.companyName)}>
                            <BsCheckCircle />
                          </span>
                          <span className="icon-button reject" onClick={() => rejectCompany(company.companyId, company.companyName)}>
                            <BsXCircle />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          ) : (
            <h4 className='text-center'>Loading.. .!!</h4>
          )}
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
}

export default CompanyValidation;
