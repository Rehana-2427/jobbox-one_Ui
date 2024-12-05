import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import Pagination from '../../Pagination';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';

const CandidateJobs = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applyjobs, setApplyJobs] = useState([]);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [hasUserApplied, setHasUserApplied] = useState({});
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleFilterChange = async (e) => {
    const status = e.target.value
    setFilterStatus(status);
    localStorage.setItem('candidateJobsPage', 0);
    setPage(0);

  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0);
  };
  useEffect(() => {
    if (search && filterStatus) {
      searchJobsWithFilter(search, filterStatus);
    }
    else if (search) {
      fetchJobBySearch(search);
    } else if (filterStatus) {
      fetchDataByFilter(filterStatus);
    } else {
      fetchData();
    }
  }, [page, pageSize, search, sortedColumn, sortOrder, filterStatus, userId]);

  async function fetchData() {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/paginationJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchDataByFilter(filterStatus) {
    console.log(filterStatus)
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
        userId: userId, // Example parameter to pass to backend API
        filterStatus: filterStatus
      };
      console.log(filterStatus)

      const response = await axios.get(`${BASE_API_URL}/paginationFilterJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  async function searchJobsWithFilter(search, filterStatus) {
    console.log(filterStatus)
    try {
      const params = {
        search: search,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
        userId: userId, // Example parameter to pass to backend API
        filterStatus: filterStatus
      };
      console.log(filterStatus)

      const response = await axios.get(`${BASE_API_URL}/searchJobsWithFilter`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };


  const handleApplyButtonClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowResumePopup(true);
  };

  const handleResumeSelect = async (resumeId) => {
    if (selectedJobId && resumeId) {
      await applyJob(selectedJobId, resumeId);
      setSelectedJobId(null);
      setShowResumePopup(false);
    }
  };

  const applyJob = async (jobId, resumeId) => {
    let loadingPopup;

    try {
      // Show loading message using SweetAlert
      loadingPopup = Swal.fire({
        title: 'Applying to the job...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const appliedOn = new Date(); // Get current date and time
      const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
      const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
      const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month

      const formattedDate = `${year}-${month}-${day}`;

      const response = await axios.put(`${BASE_API_URL}/applyJob`, null, {
        params: { jobId, userId, formattedDate, resumeId },
      });

      if (response.data) {
        setApplyJobs((prevApplyJobs) => [...prevApplyJobs, { jobId, formattedDate }]);
        setHasUserApplied((prev) => ({ ...prev, [jobId]: true }));

        // Close the loading popup
        Swal.close();

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Apply Successful!",
          text: "You have successfully applied for this job."
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      // Close loading popup on error
      if (loadingPopup) {
        Swal.close();
      }
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    } finally {
      // Ensure loading popup is closed if still open
      if (loadingPopup) {
        Swal.close();
      }
    }
  };


  useEffect(() => {
    axios.get(`${BASE_API_URL}/getResume`, { params: { userId } })
      .then(response => {
        setResumes(response.data);
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
      });
  }, [userId]);

  useEffect(() => {
    checkHasUserApplied();
  }, [jobs, userId]);

  const checkHasUserApplied = async () => {
    const applications = {};
    try {
      for (const job of jobs) {
        const response = await axios.get(`${BASE_API_URL}/applicationApplied`, {
          params: { jobId: job.jobId, userId }
        });
        applications[job.jobId] = response.data;
      }
      setHasUserApplied(applications);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };

  const fetchJobBySearch = async () => {
    try {
      const params = {
        search: search,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
        //  userId: userId, // Example parameter to pass to backend API
        //  filterStatus: filterStatus
      };
      const response = await axios.get(`${BASE_API_URL}/searchJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);

      const statuses = await Promise.all(response.data.content.map(job => hasUserApplied(job.jobId, userId)));
      const statusesMap = {};
      response.data.content.forEach((job, index) => {
        statusesMap[job.jobId] = statuses[index];
      });

    } catch (error) {
      console.log("No data Found" + error);
    }
    console.log("Search submitted:", search);
  };

  const handleSort = (column) => {
    if (sortedColumn === column) {
      // Toggle sort order if the same column is clicked
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Sort by the new column (default to ascending)
      setSortedColumn(column);
      setSortOrder('asc');
    }
  };
  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };


  const handlePageClick = (data) => {
    const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1)); // Ensure selectedPage is within range
    setPage(selectedPage);
    localStorage.setItem('candidateJobsPage', selectedPage); // Store the page number in localStorage
  };
  useEffect(() => {
    const storedPage = localStorage.getItem('candidateJobsPage');
    if (storedPage !== null) {
      const parsedPage = Number(storedPage);
      if (parsedPage < totalPages) {
        setPage(parsedPage);
        console.log(page);
      }
    }
  }, [totalPages]);
  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return ''; // Handle case where name is undefined
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  const initials = getInitials(userName);
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;

  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);
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
        localStorage.removeItem(`userName_${userId}`);
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
    <div className='dashboard-container'>

      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
        <CandidateLeftSide user={{ userName, userId }} onClose={toggleLeftSide} />
      </div>
      <div className="right-side" >
        {showResumePopup && (
          <ResumeSelectionPopup
            resumes={resumes}
            onSelectResume={handleResumeSelect}
            onClose={() => setShowResumePopup(false)}
          />
        )}

        <div
          style={{
            overflowY: 'auto',
            maxHeight: isSmallScreen ? '600px' : '1000px',
            paddingBottom: '20px'
          }}
        >
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
                <Dropdown.Item as={Link} to="/settings">
                  <i className="i-Data-Settings me-1" /> Account settings
                </Dropdown.Item>
                <Dropdown.Item as="button" onClick={handleLogout}>
                  <i className="i-Lock-2 me-1" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div
            className="filter p-3 border rounded shadow-sm"
            style={{ maxWidth: '30%', backgroundColor: '#f4f4f9' }}
          >
            <label htmlFor="status" className="form-label" style={{ color: '#6c5b7b' }}>
              Filter by Actions:
            </label>
            <select
              id="status"
              className="form-select form-select-sm fs-6"
              style={{ borderColor: '#6c5b7b' }}
              onChange={handleFilterChange}
              value={filterStatus}
            >
              <option value="all">Show all</option>
              <option value="Apply">Yet to apply</option>
              <option value="Applied">Already applied</option>
            </select>
          </div>
          {/* overflowY: 'auto',  */}
          <div style={{ maxHeight: '600px', paddingBottom: '50px' }}>
            {jobs.length > 0 && (
              <div>
                {/* <h2> Regular Jobs For {userName}</h2> */}
                <div className="table-details-list table-wrapper">
                  <h2> Regular Jobs For {userName}</h2>
                  <p>
                    Similar to tables and dark tables, use the modifier classes
                    <code>.table-light</code> to make <code>thead</code> appear light
                  </p>
                  <Table hover className="text-center">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" onClick={() => handleSort('jobTitle')}>
                          Job Profile
                          {/* Show the sort symbol based on sortedColumn and sortOrder */}
                          {sortedColumn === 'jobTitle' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}
                        </th>
                        <th scope="col" onClick={() => handleSort('companyName')}>
                          Company Name{' '}
                          {/* Show the sort symbol based on sortedColumn and sortOrder */}
                          {sortedColumn === 'companyName' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}
                        </th>
                        <th scope="col" onClick={() => handleSort('applicationDeadline')}>
                          Application Deadline{' '}
                          {/* Show the sort symbol based on sortedColumn and sortOrder */}
                          {sortedColumn === 'applicationDeadline' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}
                        </th>
                        <th scope="col" onClick={() => handleSort('skills')}>
                          Skills{' '}
                          {/* Show the sort symbol based on sortedColumn and sortOrder */}
                          {sortedColumn === 'skills' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}
                        </th>
                        <th scope="col" onClick={() => handleSort('location')}>
                          Location{' '}
                          {/* Show the sort symbol based on sortedColumn and sortOrder */}
                          {sortedColumn === 'location' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}
                        </th>
                        <th scope="col">Job description</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id} id="job-table-list">
                          <td
                            title={
                              job.jobCategory === 'evergreen' && !job.applicationDeadline
                                ? 'This position is always open for hiring, feel free to apply anytime!'
                                : ''
                            }
                          >
                            {job.jobTitle}
                          </td>
                          <td>{job.companyName}</td>
                          <td>
                            {job.jobCategory === 'evergreen' && !job.applicationDeadline ? (
                              <span
                                style={{ color: 'green', fontWeight: 'bold' }}
                                title="This position is always open for hiring, feel free to apply anytime!"
                              >
                                Evergreen Job - No Due Date
                              </span>
                            ) : (
                              job.applicationDeadline || 'Not Specified'
                            )}
                          </td>
                          <td>{job.skills}</td>
                          <td>{job.location}</td>
                          <td>
                            <Button
                              variant="secondary"
                              className="description btn-rounded"
                              onClick={() => {
                                const url = new URL('/#/candidate-dashboard/job-description', window.location.origin);
                                url.searchParams.append('companyName', encodeURIComponent(job.companyName || ''));
                                url.searchParams.append('jobId', encodeURIComponent(job.jobId || ''));
                                url.searchParams.append('userId', encodeURIComponent(userId || ''));
                                url.searchParams.append('userName', encodeURIComponent(userName || ''));
                                window.open(url.toString(), '_blank', 'noopener,noreferrer');
                              }}
                            >
                              View
                            </Button>
                          </td>
                          <td>
                            {hasUserApplied[job.jobId] === true || (applyjobs && applyjobs.jobId === job.jobId) ? (
                              <p>Applied</p>
                            ) : (
                              <Button onClick={() => handleApplyButtonClick(job.jobId)}>Apply</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {selectedJobSummary && (
                  <div className="modal-summary">
                    <div className="modal-content-summary">
                      <span className="close" onClick={handleCloseModal}>
                        &times;
                      </span>
                      <div className="job-summary">
                        <h3>Job Summary</h3>
                        <pre className="job-details-text">{selectedJobSummary}</pre>
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
            )}

            {jobs.length === 0 && <h1>No jobs found.</h1>}

            <div className="dream p-3">
              <p className="text-center responsive-text">
                Can't find your dream company or dream job? Don't worry, you can still apply to them.
              </p>
              <p className="text-center responsive-text">
                Just add the name of your dream company and job role and apply to them directly.
              </p>
              <div className="app d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/candidate-dashboard/dream-company', { state: { userName, userId } });
                  }}
                  className="w-md-auto"
                >
                  Apply to your dream company
                </Button>

                <Button
                  variant="success"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/candidate-dashboard/dream-job', { state: { userName, userId } });
                  }}
                  className="w-md-auto"
                >
                  Apply to your dream job
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CandidateJobs;
