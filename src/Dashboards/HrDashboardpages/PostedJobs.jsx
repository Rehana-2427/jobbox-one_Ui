import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import Pagination from '../../Pagination';
import './HrDashboard.css';
import HrLeftSide from './HrLeftSide';

const PostedJobs = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  // const BASE_API_URL = "http://localhost:8082/api/jobbox";
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

  const navigate = useNavigate();
  const toggleSettings = () => {
    navigate('/');
  };

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

  const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };

  
  const { logout } = useAuth(); // Get logout function from context

  const  handleLogout = () => {
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
      <div className="right-side" >
        <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
          <div className="search-bar" >
            <input style={{ borderRadius: '6px', height: '35px' }}
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
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'grey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
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
        <div className="jobs_list">
          <h2>All Jobs</h2>
          {jobs.length > 0 ? (
            <div>
              <div className='table-details-list  table-wrapper '>
                <Table hover className='text-center'>
                  <thead className="table-light">
                    <tr>
                      <th scope="col" onClick={() => handleSort('hrName')}>Hr Name{sortedColumn === 'hrName' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col">Company Name</th>
                      <th scope="col" onClick={() => handleSort('jobTitle')}>Job Title{sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col" onClick={() => handleSort('jobType')}>Job Type{sortedColumn === 'jobType' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col" onClick={() => handleSort('skills')}>Skills{sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col" onClick={() => handleSort('numberOfPosition')}>Vacancy{sortedColumn === 'numberOfPosition' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col">Job Description</th>
                      <th scope="col" onClick={() => handleSort('applicationDeadline')}>Application Deadline{sortedColumn === 'applicationDeadline' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      {/* <th>Job category</th> */}

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
                        {/* <td>{job.jobCategory}</td> */}

                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
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
          ) : (
            <p>No jobs available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default PostedJobs;
