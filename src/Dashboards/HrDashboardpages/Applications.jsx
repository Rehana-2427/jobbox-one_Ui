import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';

import Pagination from '../../Pagination';
import HrLeftSide from './HrLeftSide';

const Applications = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";


  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;
  const currentJobApplicationPage = location.state?.currentJobApplicationPage || 0;
  const currentJobApplicationPageSize = location.state?.currentJobApplicationPageSize || 5;
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
      setPageSize(5)
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
  const state1 = location.state || {};
  console.log(state1)
  console.log("current page from update job")

  const initials = getInitials(userName);
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);

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
              <Dropdown.Item as={Link} to="/">
                <i className="i-Data-Settings me-1" /> Account settings
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={handleLogout}>
                <i className="i-Lock-2 me-1" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
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
                    <th scope="col" onClick={() => handleSort('jobTitle')}>
                      Job Title {sortedColumn === 'jobTitle' && sortOrder === 'asc' && '▲'}
                      {sortedColumn === 'jobTitle' && sortOrder === 'desc' && '▼'}
                    </th>
                    <th scope="col" onClick={() => handleSort('applicationDeadline')}>Application DeadLine{sortedColumn === 'applicationDeadline' && sortOrder === 'asc' && '▲'}
                      {sortedColumn === 'applicationDeadline' && sortOrder === 'desc' && '▼'}</th>
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
            <h2>You have not posted any jobs yet. Post Now</h2>
          </section>
        )}
      </div>
    </div>

  );
}

export default Applications;


