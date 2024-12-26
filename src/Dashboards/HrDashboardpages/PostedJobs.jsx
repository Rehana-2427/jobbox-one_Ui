import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Footer from '../../pages/Footer';
import Pagination from '../../Pagination';
import DashboardLayout from './DashboardLayout ';
import './HrDashboard.css';

const PostedJobs = () => {

  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(' ');

  const fetchJobs = async () => {
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };

      const response = await axios.get(`${BASE_API_URL}/getRegularJobsByAllHrsInCompany`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching jobs data:', error);
    }
  };

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const fetchJobBysearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchJobsByCompany`, {
        params: { search, userEmail, page, pageSize }
      });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      console.log(response.data);
    } catch (error) {
      console.log("Error searching:", error);
      alert("Error searching for jobs. Please try again later.");
    }
  }

  useEffect(() => {
    if (search) {
      fetchJobBysearch();
    } else {
      fetchJobs();
    }
  }, [userEmail, page, pageSize, sortedColumn, sortOrder, search]);


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPage(0);
    setPageSize(size);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setPage(selectedPage);
  };

  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;

  return (
    <DashboardLayout>
      <div className="main-content">
        <Row>
          <Col md={4}>
            <h2>
              {jobs.length === 0 ? (
                <div style={{ color: 'red', textAlign: 'center' }}>
                  {search
                    ? `There is no job with this ""`
                    : 'You have not posted any jobs yet. Post Now'}
                </div>
              ) : (
                <div className='text-start'>All Regular Jobs</div>
              )}
            </h2>
          </Col>

          <Col md={3} className="d-flex align-items-left">
            {/* Search Bar */}
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

        {jobs.length > 0 ? (
          <div>
            <div className='table-details-list  table-wrapper '>
              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr>
                    <th scope="col">Hr Name</th>
                    <th scope="col">Company Name</th>

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
                      onClick={() => handleSort('jobType')}
                      style={{ cursor: 'pointer' }}
                    >
                      Job Type{' '}
                      <span>
                        <span
                          style={{
                            color: sortedColumn === 'jobType' && sortOrder === 'asc' ? 'black' : 'gray',
                          }}
                        >
                          ↑
                        </span>{' '}
                        <span
                          style={{
                            color: sortedColumn === 'jobType' && sortOrder === 'desc' ? 'black' : 'gray',
                          }}
                        >
                          ↓
                        </span>
                      </span>
                    </th>

                    <th
                      scope="col"
                      onClick={() => handleSort('skills')}
                      style={{ cursor: 'pointer' }}
                    >
                      Skills{' '}
                      <span>
                        <span
                          style={{
                            color: sortedColumn === 'skills' && sortOrder === 'asc' ? 'black' : 'gray',
                          }}
                        >
                          ↑
                        </span>{' '}
                        <span
                          style={{
                            color: sortedColumn === 'skills' && sortOrder === 'desc' ? 'black' : 'gray',
                          }}
                        >
                          ↓
                        </span>
                      </span>
                    </th>

                    <th
                      scope="col"
                      onClick={() => handleSort('numberOfPosition')}
                      style={{ cursor: 'pointer' }}
                    >
                      Vacancy{' '}
                      <span>
                        <span
                          style={{
                            color: sortedColumn === 'numberOfPosition' && sortOrder === 'asc' ? 'black' : 'gray',
                          }}
                        >
                          ↑
                        </span>{' '}
                        <span
                          style={{
                            color: sortedColumn === 'numberOfPosition' && sortOrder === 'desc' ? 'black' : 'gray',
                          }}
                        >
                          ↓
                        </span>
                      </span>
                    </th>

                    <th scope="col">Job Description</th>

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
                  </tr>
                </thead>

                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td>{job.userName}</td>
                      <td>{job.companyName}</td>
                      <td><a onClick={() => handleViewSummary(job.jobsummary)}>{job.jobTitle}</a></td>
                      <td>{job.jobType}</td>
                      <td>{job.skills}</td>
                      <td>{job.numberOfPosition}</td>
                      <td><Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job.jobsummary)}>Summary</Button></td>
                      <td>{job.applicationDeadline}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {selectedJobSummary && (
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Job Summary</h5>
                      </div>
                      <div className="modal-body">
                        <pre className="job-details-text">{selectedJobSummary}</pre>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
        ) : (
          // <p>No jobs available.</p>
          <section> </section>
        )}
      </div>
      <Footer />

    </DashboardLayout>
  );
}
export default PostedJobs;
