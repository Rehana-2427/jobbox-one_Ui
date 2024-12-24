import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { MdEdit } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Footer from '../../pages/Footer';
import Pagination from '../../Pagination';
import DashboardLayout from './DashboardLayout ';

const EvergreenJobs = () => {

  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(' ');

  const fetchEverGreenJobs = async () => {
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };

      const response = await axios.get(`${BASE_API_URL}/getEverGreenJobsByCompany`, { params });
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



  useEffect(() => {
    fetchEverGreenJobs();

  }, [userEmail, page, pageSize, sortedColumn, sortOrder]);


  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0);
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
                  'You have not posted any jobs yet. Post Now'
                </div>
              ) : (
                <div className="left-text">Evergreen Jobs</div>
              )}
            </h2>
          </Col>

          <Col md={3} className="d-flex align-items-left">
            <div style={{ flex: 1 }}>
              <Button style={{ marginLeft: '115px' }}>
                <Link
                  to={{
                    pathname: '/hr-dashboard/evergreen-jobs/job-form',
                    state: { userName, userEmail, jobCategory: 'evergreen' }
                  }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/hr-dashboard/evergreen-jobs/job-form', { state: { userName, userEmail, jobCategory: 'evergreen' } });
                  }}
                >
                  Add Evergreen Job
                </Link>
              </Button>
            </div>
          </Col>
        </Row>

        {jobs.length > 0 ? (
          <div>
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
                      onClick={() => handleSort('salary')}
                      style={{ cursor: 'pointer' }}
                    >
                      Salary{' '}
                      <span>
                        <span
                          style={{
                            color: sortedColumn === 'salary' && sortOrder === 'asc' ? 'black' : 'gray',
                          }}
                        >
                          ↑
                        </span>{' '}
                        <span
                          style={{
                            color: sortedColumn === 'salary' && sortOrder === 'desc' ? 'black' : 'gray',
                          }}
                        >
                          ↓
                        </span>
                      </span>
                    </th>

                    <th scope="col">Job Description</th>

                    <th scope="col">Update Job</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td><a onClick={() => handleViewSummary(job.jobsummary)}>{job.jobTitle}</a></td>
                      <td>{job.jobType}</td>
                      <td>{job.skills}</td>
                      <td>{job.salary}</td>
                      <td><Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job.jobsummary)}>Summary</Button></td>
                      <td>
                        <span className="cursor-pointer text-success me-2 update" onClick={() => navigate('/hr-dashboard/evergreen-jobs/update', { state: { userName, userEmail, jobId: job.jobId, currentPage: page, currentPageSize: pageSize } })}>
                          <MdEdit size={18} className="text-success" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Pagination
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              handlePageSizeChange={handlePageSizeChange}
              isPageSizeDisabled={isPageSizeDisabled}
              handlePageClick={handlePageClick}
            />
          </div>
        ) : (
          <p>No jobs available.</p>
        )}
        {selectedJobSummary && (
          <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Job Summary</h5>
                  {/* <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button> */}
                </div>
                <div className="modal-body">
                  <pre className="job-details-text">{selectedJobSummary}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal} onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCloseModal();
                    }
                  }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

    </DashboardLayout>
  );
};

export default EvergreenJobs;
