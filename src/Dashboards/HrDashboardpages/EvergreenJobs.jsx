import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { MdEdit } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';

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
  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };
  const initials = getInitials(userName);

  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };
  console.log(userName, userEmail)

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
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

  useEffect(() => {
    // Update the `isSmallScreen` state based on screen resizing
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 767);

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <DashboardLayout>  <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
      {/* <div className="search-bar" >
              <input style={{ borderRadius: '6px', height: '35px' }}
                type="text"
                name="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
            </div> */}

    </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ textAlign: 'left' }}>Evergreen Jobs</h2>
        <Button className="add-job-button" style={{ textAlign: 'right', marginBottom: '12px', position: 'relative', bottom: '30px', right: '20px' }}>
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
      {jobs.length > 0 ? (
        <div>
          <div className='table-details-list  table-wrapper '>
            <Table hover className='text-center'>
              <thead className="table-light">
                <tr>
                  <th scope="col" onClick={() => handleSort('jobTitle')}>Job Title{sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th scope="col" onClick={() => handleSort('jobType')}>Job Type{sortedColumn === 'jobType' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th scope="col" onClick={() => handleSort('skills')}>Skills{sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th>Salary</th>
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
          {/* {selectedJobSummary && (
                <div className="modal-summary">
                  <div className="modal-content-summary">
                    <span
                      className="close"
                      onClick={handleCloseModal}
                      role="button"
                      tabIndex="0"
                      aria-label="Close"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleCloseModal();
                        }
                      }}
                    >
                      &times;
                    </span>
                    <div className="job-summary">
                      <h3>Job Summary</h3>
                      <pre className="job-details-text">{selectedJobSummary}</pre>
                    </div>
                  </div>
                </div>
              )} */}
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

    </DashboardLayout>
  );
};

export default EvergreenJobs;
