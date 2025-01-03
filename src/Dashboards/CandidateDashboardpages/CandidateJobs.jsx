import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from '../../pages/Footer';
import Pagination from '../../Pagination';
import './CandidateDashboard.css';
import DashboardLayout from './DashboardLayout';
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
  const [loading, setLoading] = useState(false); // State to manage loading

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
      setLoading(true);
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
    }finally{
      setLoading(false);
    }
  };

  async function fetchDataByFilter(filterStatus) {
    console.log(filterStatus)
    try {
      setLoading(true);
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
    }finally{
      setLoading(false);
    }
  };


  async function searchJobsWithFilter(search, filterStatus) {
    console.log(filterStatus)
    try {
      setLoading(true);
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
    }finally{
      setLoading(false);
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


  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;


  return (
    <DashboardLayout>
      <div className="main-content">
        <Row>
          <Col className='filter-action' md={4} style={{ paddingTop: '10px',marginLeft:'12px',marginRight:'12px'}}>
            <label htmlFor="status" className="form-label" style={{ color: '#6c5b7b' }}>
              Filter by Actions:
            </label>
            <select
              id="status"
              className="form-select form-select-sm fs-6"
              style={{ borderColor: '#6c5b7b',paddingRight:'20px'}}
              onChange={handleFilterChange}
              value={filterStatus} 
            >
              <option value="all">Show all</option>
              <option value="Apply">Yet to apply</option>
              <option value="Applied">Already applied</option>
            </select>
          </Col>
          <Col md={3} className="d-flex align-items-left" style={{ paddingTop: '30px' }}>
            {/* Search Bar */}
            <div className="search-bar" style={{ flex: 1 }}>
              <input
                style={{ borderRadius: '6px', height: '40px', width: '100%' }}
                type="text"
                name="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </Col>

        </Row>
        <Col md={4}>
          <h2 className='text-start' style={{paddingLeft:'12px'}}>Jobs For {userName}</h2>
        </Col>
        {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-bubble spinner-bubble-primary m-5" />
              <span>Loading...</span>
            </div>
          ) : jobs.length > 0 && (
          <div>
            <div className="table-details-list table-wrapper">
              <Table hover className="text-center">
                <thead className="table-light">
                  <tr>
                    <th scope="col" onClick={() => handleSort('jobTitle')} style={{ cursor: 'pointer' }}>
                      Job Profile{' '}
                      <span>
                        <span style={{ color: sortedColumn === 'jobTitle' && sortOrder === 'asc' ? 'black' : 'gray', }}>↑</span>{' '}
                        <span style={{ color: sortedColumn === 'jobTitle' && sortOrder === 'desc' ? 'black' : 'gray', }}>↓</span>
                      </span>
                    </th>
                    <th scope="col" onClick={() => handleSort('companyName')} style={{ cursor: 'pointer' }}>
                      Company Name{' '}
                      <span>
                        <span style={{ color: sortedColumn === 'companyName' && sortOrder === 'asc' ? 'black' : 'gray', }}>↑</span>{' '}
                        <span style={{ color: sortedColumn === 'companyName' && sortOrder === 'desc' ? 'black' : 'gray', }}>↓</span>
                      </span>
                    </th>
                    <th scope="col" onClick={() => handleSort('applicationDeadline')} style={{ cursor: 'pointer' }}>
                      Application Deadline{' '}
                      <span>
                        <span style={{ color: sortedColumn === 'applicationDeadline' && sortOrder === 'asc' ? 'black' : 'gray', }}>↑</span>{' '}
                        <span style={{ color: sortedColumn === 'applicationDeadline' && sortOrder === 'desc' ? 'black' : 'gray', }}>↓</span>
                      </span>
                    </th>
                    <th scope="col" onClick={() => handleSort('skills')} style={{ cursor: 'pointer' }}>
                      Skills{' '}
                      <span>
                        <span style={{ color: sortedColumn === 'skills' && sortOrder === 'asc' ? 'black' : 'gray', }}>↑</span>{' '}
                        <span style={{ color: sortedColumn === 'skills' && sortOrder === 'desc' ? 'black' : 'gray', }}>↓</span>
                      </span>
                    </th>
                    <th scope="col" onClick={() => handleSort('location')} style={{ cursor: 'pointer' }}>
                      Location{' '}
                      <span>
                        <span style={{ color: sortedColumn === 'location' && sortOrder === 'asc' ? 'black' : 'gray', }}>↑</span>{' '}
                        <span style={{ color: sortedColumn === 'location' && sortOrder === 'desc' ? 'black' : 'gray', }}>↓</span>
                      </span>
                    </th>
                    <th scope="col">Job description</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} id="job-table-list">
                      <td title={job.jobCategory === 'evergreen' && !job.applicationDeadline ? 'This position is always open for hiring, feel free to apply anytime!' : ''}>
                        {job.jobTitle}
                      </td>
                      <td>{job.companyName}</td>
                      <td>
                        {job.jobCategory === 'evergreen' && !job.applicationDeadline ? (
                          <span style={{ color: 'green', fontWeight: 'bold' }} title="This position is always open for hiring, feel free to apply anytime!">
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
                            // Base URL for the new page
                            const baseUrl = '/#/candidate-dashboard/jobs/job-description/';
                            // Construct the query parameters manually
                            const params = new URLSearchParams({
                              companyName: encodeURIComponent(job.companyName || ''),
                              jobId: encodeURIComponent(job.jobId || ''),
                              userId: encodeURIComponent(userId || ''),
                              userName: encodeURIComponent(userName || '')
                            }).toString();
                            // Construct the final URL with parameters after the hash
                            const fullUrl = `${window.location.origin}${baseUrl}?${params}`;
                            console.log("full url --> " + fullUrl);
                            // Open the new page in a new tab
                            window.open(fullUrl, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          View
                        </Button>

                        {/* <Button
                          variant="secondary"
                          className="description btn-rounded"
                          onClick={() => {
                            // Log the values to the console
                            console.log("Navigating to Job Description with the following details:");
                            console.log("Company Name:", job.companyName || '');
                            console.log("Job ID:", job.jobId || '');
                            console.log("User  ID:", userId || '');
                            console.log("User  Name:", userName || '');

                            // Navigate to the job description page
                            navigate('/candidate-dashboard/candidate-jobs/job-description', {
                              state: {
                                companyName: job.companyName || '',
                                jobId: job.jobId || '',
                                userId: userId || '',
                                userName: userName || '',
                              },
                            });
                          }}
                        >
                          View
                        </Button> */}

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
        {!loading && jobs.length === 0 && <h1>No jobs found.</h1>}
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
                navigate('/candidate-dashboard/jobs/dream-company', { state: { userName, userId } });
              }}
              className="w-md-auto"
            >
              Apply to your dream company
            </Button>

            <Button
              variant="success"
              onClick={(e) => {
                e.preventDefault();
                navigate('/candidate-dashboard/jobs/dream-job', { state: { userName, userId } });
              }}
              className="w-md-auto"
            >
              Apply to your dream job
            </Button>
          </div>
        </div>
        {showResumePopup && (
          <ResumeSelectionPopup
            resumes={resumes}
            onSelectResume={handleResumeSelect}
            show={true}
            onClose={() => setShowResumePopup(false)}
          />
        )}
      </div>
      <Footer />
    </DashboardLayout>

  );
};

export default CandidateJobs;
