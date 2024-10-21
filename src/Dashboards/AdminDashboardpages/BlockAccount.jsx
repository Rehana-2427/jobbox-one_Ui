import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Pagination from '../../Pagination';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const BlockAccount = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
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
      const response = await axios.get(`${BASE_API_URL}/rejectedHrs`, { params });
      setUserData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const companyName = userData.companyName;
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
        {userData.length > 0 ? (
          <>
            <h2>List of Rejected Hr's</h2>
            <div className='table-details-list table-wrapper'>
              <Table hover className='text-center' >
                <thead className="table-light">
                  <tr>
                    <th onClick={() => handleSort('userName')}>
                      UserName {sortedColumn === 'userName' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>  <th onClick={() => handleSort('userEmail')}>
                      userEmail {sortedColumn === 'userEmail' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('companyName')}>
                      Company {sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>

                  </tr>
                </thead>
                <tbody>
                  {userData.map(user => (
                    <tr key={user.userId}>
                      <td>{user.userName}</td>
                      <td>{user.userEmail}</td>
                      <td>{user.companyName}</td>
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
  )
}

export default BlockAccount
