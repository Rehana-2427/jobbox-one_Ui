import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../Pagination';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const AddCompanyDetails = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [companyData, setCompanyData] = useState([]);
  const currentAdminCompanyPage = location.state?.currentAdminCompanyPage || 0;
  const [page, setPage] = useState(currentAdminCompanyPage);
  const currentAdminCompanyPageSize = location.state?.currentAdminCompanyPageSize || 6;
  const [pageSize, setPageSize] = useState(currentAdminCompanyPageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const state1 = location.state || {};
  console.log(state1)
  console.log("current page from company details by admin", currentAdminCompanyPage)

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  useEffect(() => {
    if (location.state?.currentAdminCompanyPage === undefined && location.state?.currentAdminCompanyPageSize) {
      setPage(0);
    }
  }, [location.state?.currentAdminCompanyPage, location.state?.currentAdminCompanyPageSize]);
  useEffect(() => {
    fetchCompanyData();
  }, [page, pageSize]);


  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/companiesList?page=${page}&size=${pageSize}`);
      setCompanyData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
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
            paddingBottom: '100px'
          }}
        >
          {companyData.length > 0 ? (
            <>
              <h2>Add Company Details</h2>
              <div className='table-details-list table-wrapper'>
                <Table hover className='text-center'>
                  <thead className="table-light">
                    <tr>
                      <th>Company Name</th>
                      <th>Company WebSite</th>
                      <th>Company Email</th>
                      <th>Service</th>
                      <th onClick={() => handleSort('location')}>
                        Location {sortedColumn === 'location' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => handleSort('date')}>
                        Submit Date {sortedColumn === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th>Status</th>
                      <th onClick={() => handleSort('actionDate')}>
                        Action Date {sortedColumn === 'actionDate' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th>Add Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyData.map((company) => (
                      <tr key={company.companyId}>
                        <td>{company.companyName}</td>
                        <td>{company.websiteLink}</td>
                        <td>{company.jobboxEmail}</td>
                        <td>{company.industryService}</td>
                        <td>{company.location}</td>
                        <td>{company.date}</td>
                        <td>{company.companyStatus}</td>
                        <td>{company.actionDate}</td>
                        <td><Link to={{
                          pathname: '/admin-dashboard/companyDetailsByAdmin',
                          state: { companyName: company.companyName, currentAdminCompanyPage: page, currentAdminCompanyPageSize: pageSize }
                        }} onClick={(e) => {
                          e.preventDefault();
                          navigate('/admin-dashboard/companyDetailsByAdmin', { state: { companyName: company.companyName, currentAdminCompanyPage: page, currentAdminCompanyPageSize: pageSize } });
                        }}>ADD</Link></td>
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
  )
}

export default AddCompanyDetails
