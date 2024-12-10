import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { MdDelete, MdEdit } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { default as swal } from 'sweetalert2';
import Pagination from '../../Pagination';
import DashboardLayout from './DashboardLayout ';
import './HrDashboard.css';

const MyJobs = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const userName = location.state?.userName;
  const [jobs, setJobs] = useState([]);
  const [selectedJobSummary, setSelectedJobSummary] = useState('');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const currentPage = location.state?.currentPage || 0;
  const [page, setPage] = useState(currentPage);
  const currentPageSize = location.state?.currentPageSize || 6; // Default page size
  const [pageSize, setPageSize] = useState(currentPageSize); // Default to 5 items per page

  const state1 = location.state || {};
  console.log(state1);
  console.log("current page from update job", currentPage, " page size", currentPageSize);
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };


  useEffect(() => {
    if (location.state?.currentPage === undefined && location.state?.currentPageSize === undefined) {
      setPage(0);
      setPageSize(6); // Set default page size to 5
    }
  }, [location.state?.currentPage, location.state?.currentPageSize]);

  console.log("page", page)
  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const handleDelete = (jobId) => {
    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!" + " All applications will be deleted",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete job only if user confirms
        deleteJob(jobId);
      }
    });
  };

  // Function to perform the delete action
  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`${BASE_API_URL}/deleteJob?jobId=${jobId}`);
      setJobs(prevJobs => prevJobs.filter(job => job.jobId !== jobId));
      swal.fire(
        'Deleted!',
        'The job has been deleted.',
        'success'
      );
    } catch (error) {
      console.error('Error deleting job:', error);
      swal.fire(
        'Error!',
        'An error occurred while deleting the job.',
        'error'
      );
    }
  };


  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/jobsPostedByHrEmail`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching HR data:', error);
    }
  }, [userEmail, page, pageSize, sortedColumn, sortOrder]);

  const fetchJobBySearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/searchJobsByHR`, {
        params: { search, userEmail, page, pageSize }
      });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching for jobs. Please try again later.');
    }
  }, [search, userEmail, page, pageSize]);

  useEffect(() => {
    if (search) {
      fetchJobBySearch();
    } else {
      fetchJobs();
    }
  }, [fetchJobBySearch, fetchJobs, search]);

  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;


  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setPage(selectedPage);

  };

  return (
    <DashboardLayout>
      <div className="main-content">
        <Row>
          <Col md={4}>
            <h2>
              {jobs.length === 0 ? (
                <div style={{ color: 'red', textAlign: 'center' }}>
                  {search
                    ? `There is no job with this "${search}"`
                    : 'You have not posted any jobs yet. Post Now'}
                </div>
              ) : (
                <div className="left-text">Jobs posted by {userName}</div>
              )}
            </h2>
          </Col>

          <Col md={4} className="d-flex align-items-left">
            {/* Search Bar */}
            <div className="search-bar" style={{ flex: 1 }}>
              <input
                style={{ borderRadius: '6px', height: '35px', width: '100%' }}
                type="text"
                name="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <Button style={{ marginRight: '20px' }}>
              <Link
                to={{ pathname: '/hr-dashboard/my-jobs/addJob', state: { userName, userEmail } }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/hr-dashboard/my-jobs/addJob', { state: { userName, userEmail } });
                }}
                style={{ textDecoration: 'none', color: 'inherit' }} // removes default link styling
              >
                Add Job
              </Link>
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-bubble spinner-bubble-primary m-5" />
            <span>Loading...</span>
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div>
              <div className="table-details-list table-wrapper">
                <Table hover className="text-center">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" onClick={() => handleSort('jobTitle')} style={{ cursor: 'pointer' }}>
                        Job Title{' '}
                        <span>
                          <span style={{ color: sortedColumn === 'jobTitle' && sortOrder === 'asc' ? 'black' : 'gray', }}>↑</span>{' '}
                          <span style={{ color: sortedColumn === 'jobTitle' && sortOrder === 'desc' ? 'black' : 'gray', }}>↓</span>
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
                        onClick={() => handleSort('postingDate')}
                        style={{ cursor: 'pointer' }}
                      >
                        Posting Date{' '}
                        <span>
                          <span
                            style={{
                              color: sortedColumn === 'postingDate' && sortOrder === 'asc' ? 'black' : 'gray',
                            }}
                          >
                            ↑
                          </span>{' '}
                          <span
                            style={{
                              color: sortedColumn === 'postingDate' && sortOrder === 'desc' ? 'black' : 'gray',
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
                        No of Position{' '}
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
                      <th scope="col">Job Description</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.jobId}>
                        <td>{job.jobTitle}</td>
                        <td>{job.jobType}</td>
                        <td>{job.postingDate}</td>
                        <td>{job.skills}</td>
                        <td>{job.numberOfPosition}</td>
                        <td>{job.salary}</td>
                        <td>
                          {job.jobCategory === 'evergreen' && !job.applicationDeadline ? (
                            <span style={{ color: 'green', fontWeight: 'bold' }} title="This position is always open for hiring, feel free to apply anytime!">
                              Evergreen Job - No Due Date
                            </span>
                          ) : (
                            job.applicationDeadline || 'Not Specified'
                          )}
                        </td>
                        <td>
                          <Button variant="secondary" className="description btn-rounded" onClick={() => handleViewSummary(job.jobsummary)}>
                            Summary
                          </Button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span
                              className="cursor-pointer text-success me-2 update"
                              onClick={() =>
                                navigate('/hr-dashboard/my-jobs/update-job', {
                                  state: { userName, userEmail, jobId: job.jobId, currentPage: page, currentPageSize: pageSize },
                                })
                              }
                            >
                              <MdEdit size={18} className="text-success" />
                            </span>
                            <span className="delete cursor-pointer text-danger me-2" onClick={() => handleDelete(job.jobId)}>
                              <MdDelete className="text-danger" size={18} />
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>


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
          <section className="no-jobs-message">

          </section>
        )}
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
    </DashboardLayout>
  );
};
export default MyJobs;
