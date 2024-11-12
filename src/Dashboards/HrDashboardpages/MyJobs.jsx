import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Button, Dropdown, Table } from 'react-bootstrap';
import { MdDelete, MdEdit } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { default as swal, default as Swal } from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import Pagination from '../../Pagination';
import './HrDashboard.css';
import HrLeftSide from './HrLeftSide';

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

  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  const initials = getInitials(userName);

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

  }; const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };



  const { logout } = useAuth(); // Get logout function from context

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Call the logout function
        // Clear user data from localStorage
        localStorage.removeItem(`userName_${userEmail}`);
        // Navigate to the login page or home page
        navigate('/'); // Update with the appropriate path for your login page
      }
    });
  };
  return (
    <div className='dashboard-container'>
      <div>
        <button className="hamburger-icon" onClick={toggleLeftSide} >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
        <HrLeftSide user={{ userName, userEmail }} onClose={toggleLeftSide} />
      </div>

      <div className="right-side">
        {/* <div
          className="scroll-container"
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: '1500px',
          }}
        > */}
        <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
          <div className="search-bar">
            <input
              style={{ borderRadius: '6px', height: '35px' }}
              type="text"
              name="search"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <Dropdown className="ml-2">
            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">

              <div
                className="initials-placeholder"
                style={{
                  fontWeight: 'bold',
                }}
              >
                {initials}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-3">
              <Dropdown.Item as={Link} to="/settings">
                <i className="i-Data-Settings me-1" /> Account settings
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={handleLogout}>
                <i className="i-Lock-2 me-1" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'left' }}>
            {jobs.length === 0
              ? 'You have not posted any jobs yet. Post Now'
              : `Jobs posted by ${userName}`}
          </h2>
          <Button
            className="add-job-button"
            style={{ textAlign: 'right', marginBottom: '12px', position: 'relative', bottom: '30px', right: '20px' }}
          >
            <Link
              to={{ pathname: '/hr-dashboard/my-jobs/addJob', state: { userName, userEmail } }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/hr-dashboard/my-jobs/addJob', { state: { userName, userEmail } });
              }}
            >
              Add Job
            </Link>
          </Button>
        </div>


        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-bubble spinner-bubble-primary m-5" />
            <span>Loading...</span>
          </div>
        ) : jobs.length > 0 ? (
          <>
            {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'left' }}>Jobs posted by {userName}</h2>
              {!loading && jobs.length >= 0 && (
                <Button className="add-job-button" style={{ textAlign: 'right', marginBottom: '12px', position: 'relative', bottom: '30px', right: '20px' }}>
                  <Link
                    to={{ pathname: '/hr-dashboard/my-jobs/addJob', state: { userName, userEmail } }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/hr-dashboard/my-jobs/addJob', { state: { userName, userEmail } });
                    }}
                  >
                    Add Job
                  </Link>
                </Button>
              )}
            </div> */}

            <div>
              <div className='table-details-list table-wrapper'>
                <Table hover className='text-center' >
                  <thead className="table-light">
                    <tr>
                      <th scope="col" onClick={() => handleSort('jobTitle')}>
                        Job Title {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th scope="col" onClick={() => handleSort('jobType')}>
                        Job Type {sortedColumn === 'jobType' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th scope="col" onClick={() => handleSort('postingDate')}>
                        Posting Date {sortedColumn === 'postingDate' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th scope="col" onClick={() => handleSort('skills')}>
                        Skills {sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th scope="col" onClick={() => handleSort('numberOfPosition')}>
                        No of Position {sortedColumn === 'numberOfPosition' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th scope="col" onClick={() => handleSort('salary')}>
                        Salary {sortedColumn === 'salary' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th scope="col" onClick={() => handleSort('applicationDeadline')}>
                        Application Deadline {sortedColumn === 'applicationDeadline' && (sortOrder === 'asc' ? '▲' : '▼')}
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
                          {job.jobCategory === "evergreen" && !job.applicationDeadline ? (
                            <span style={{ color: 'green', fontWeight: 'bold' }} title="This position is always open for hiring, feel free to apply anytime!">
                              Evergreen Job - No Due Date
                            </span>
                          ) : (
                            job.applicationDeadline || 'Not Specified'
                          )}
                        </td>
                        <td><Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job.jobsummary)}>Summary</Button></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="cursor-pointer text-success me-2 update" onClick={() => navigate('/hr-dashboard/my-jobs/update-job', { state: { userName, userEmail, jobId: job.jobId, currentPage: page, currentPageSize: pageSize } })}>
                              <MdEdit size={18} className="text-success" />
                            </span>
                            <span className='delete cursor-pointer text-danger me-2' onClick={() => handleDelete(job.jobId)}>
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
            {/* <h2>You have not posted any jobs yet. Post Now</h2> */}
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
    </div>
  );
};

export default MyJobs;
