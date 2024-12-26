import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Footer from '../../pages/Footer';
import Pagination from '../../Pagination';
import DashboardLayout from './DashboardLayout ';

const Applications = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;
  const currentJobApplicationPage = location.state?.currentJobApplicationPage || 0;
  const currentJobApplicationPageSize = location.state?.currentJobApplicationPageSize || 6;
  const [jobs, setJobs] = useState('')
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(currentJobApplicationPage);
  const [pageSize, setPageSize] = useState(currentJobApplicationPageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const [loading, setLoading] = useState(true);


  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;


  console.log("current page from view Application", currentJobApplicationPage)
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };
  const handlePageClick = (data) => {
    const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1)); // Ensure selectedPage is within range
    setPage(selectedPage);
    localStorage.setItem('currentApplicationPage', selectedPage); // Store the page number in localStorage
  };

  useEffect(() => {
    localStorage.setItem('currentViewPage', 0);
    if (search) {
      fetchJobBysearch();
    }
    else {
      fetchJobs()
    }

  }, [userEmail, search, page, pageSize, sortOrder, sortedColumn]);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentApplicationPage');
    if (storedPage !== null) {
      const parsedPage = Number(storedPage);
      if (parsedPage < totalPages) {
        setPage(parsedPage);
        console.log(page);
      }
    }
  }, [totalPages]);


  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
        sortBy: sortedColumn, // Include sortedColumn and sortOrder in params
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/jobsByHrEmail`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching HR data:', error);
    }
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset page when page size change
  }
  const fetchJobBysearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/searchJobsByHR`, {
        params: { search, userEmail, page, pageSize }
      });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      console.log("Error searching:", error);
      alert("Error searching for jobs. Please try again later.");
    }

  }
  useEffect(() => {
    if (location.state?.currentJobApplicationPage === undefined && location.state?.currentJobApplicationPageSize === undefined) {
      setPage(0);
      setPageSize(6)
    }
  }, [location.state?.currentJobApplicationPage, location.state?.currentJobApplicationPageSize]);
  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const state1 = location.state || {};
  console.log(state1)
  console.log("current page from update job")

  return (
    <DashboardLayout>
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Row>
          <Col md={4}>
            <h2>
              <div className="text-start">Applications </div>
            </h2>
          </Col>
          <Col md={4} className="d-flex align-items-left">
            <div className="search-bar" style={{ flex: 1 }}>
              <input
                style={{ borderRadius: '6px', height: '35px', width: '70%', marginRight: '20px',marginBottom:'10px' }}
                type="text"
                name="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
            </div>

          </Col>
        </Row>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-bubble spinner-bubble-primary m-5" />
            <span>Loading...</span>
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className='table-details-list  table-wrapper '>
              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr>
                    <th
                      scope="col"
                      onClick={() => handleSort('jobTitle')}
                      style={{ cursor: 'pointer' }}
                    >
                      Job Title{' '}
                      <span>
                        <span
                          style={{
                            color: sortedColumn === 'jobTitle' && sortOrder === 'asc' ? 'black' : 'gray',
                          }}
                        >
                          ↑
                        </span>{' '}
                        <span
                          style={{
                            color: sortedColumn === 'jobTitle' && sortOrder === 'desc' ? 'black' : 'gray',
                          }}
                        >
                          ↓
                        </span>
                      </span>
                    </th>

                    <th
                      scope="col"
                      onClick={() => handleSort('applicationDeadline')}
                      style={{ cursor: 'pointer' }}
                    >
                      Application Deadline{' '}
                      <span>
                        <span
                          style={{
                            color: sortedColumn === 'applicationDeadline' && sortOrder === 'asc' ? 'black' : 'gray',
                          }}
                        >
                          ↑
                        </span>{' '}
                        <span
                          style={{
                            color: sortedColumn === 'applicationDeadline' && sortOrder === 'desc' ? 'black' : 'gray',
                          }}
                        >
                          ↓
                        </span>
                      </span>
                    </th>

                    <th scope="col">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map(job => (
                    (
                      <tr key={job.jobId}>
                        <td>{job.jobTitle}</td>
                        <td>
                          {job.applicationDeadline ? job.applicationDeadline : <span style={{ color: 'green' }}>Evengreen Job</span>}
                        </td>
                        <td>
                          <Link
                            to="/hr-dashboard/hr-applications/view-applications"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/hr-dashboard/hr-applications/view-applications', { state: { userName: userName, userEmail: userEmail, jobId: job.jobId, currentJobApplicationPage: page, currentJobApplicationPageSize: pageSize } });
                            }}
                            className="nav-link"
                          >
                            <Button>View Application</Button>
                          </Link>
                        </td>
                      </tr>
                    )
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
          </>
        ) : (
          <section>
            <h2>No Applications</h2>
          </section>
        )}
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default Applications;


