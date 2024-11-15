import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Pagination from '../../Pagination';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const BASE_API_URL = process.env.REACT_APP_API_URL;
const UserValidation = () => {
  const [userData, setUserData] = useState([]);
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
    fetchUserData();
  }, [page, pageSize, sortedColumn, sortOrder]);

  const fetchUserData = async () => {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/displayUsers`, { params });
      setUserData(response.data.content);
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
            paddingBottom: '100px'
          }}
        >
          {userData.length > 0 ? (
            <>
              <h2>Users List</h2>
              <div className='table-details-list table-wrapper'>
                <Table hover className='text-center' >
                  <thead className="table-light">
                    <tr>
                      <th onClick={() => handleSort('userName')}>
                        User Name {sortedColumn === 'userName' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => handleSort('userRole')}>
                        User Role {sortedColumn === 'userRole' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => handleSort('userEmail')}>
                        User Email {sortedColumn === 'userEmail' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => handleSort('approvedOn')}>
                        Action Date {sortedColumn === 'approvedOn' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th onClick={() => handleSort('userStatus')}>
                        Status & Actions {sortedColumn === 'userStatus' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map(user => (
                      <tr key={user.userId}>
                        <td>{user.userName}</td>
                        <td>{user.userRole}</td>
                        <td>{user.userEmail}</td>
                        <td>{user.approvedOn}</td>
                        <td>{user.userStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

              </div></>
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
};

export default UserValidation;
