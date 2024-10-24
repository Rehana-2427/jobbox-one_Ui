import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../Pagination';

const CompanyJobs = ({ companyId }) => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [jobs, setJobs] = useState([]);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate(); // Initialize the navigate hook
  const [selectedJob, setSelectedJob] = useState(null);

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };

  console.log()
  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const fetchJobs = useCallback(async () => {
    try {
      const params = {
        companyId: companyId,
        page: page,
        size: pageSize,
        sortBy: sortedColumn, // Include sortedColumn and sortOrder in params
        sortOrder: sortOrder,
      };

      const response = await axios.get(`${BASE_API_URL}/jobsPostedCompany`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching jobs data:', error);
    }
  }, [companyId, page, pageSize, sortedColumn, sortOrder]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, page, pageSize, sortedColumn, sortOrder]);

  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const handleViewSummary = (job) => {
    setSelectedJob(job);
  };
  const handleBackToList = () => {
    setSelectedJob(null); // Reset selectedJob to show the job list again
  };
  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  return (
    <div className="company-job" style={{ marginTop: '20px', width: '100%', marginLeft: '10px' }}>
      {!selectedJob ? (
        <div className="jobs_list">
          {jobs.length > 0 ? (
            <>
              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr>
                    <th scope="col" onClick={() => handleSort('jobTitle')}>
                      Job Title {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope="col" onClick={() => handleSort('jobType')}>
                      Job Type {sortedColumn === 'jobType' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope="col" onClick={() => handleSort('skills')}>
                      Skills {sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope="col" onClick={() => handleSort('numberOfPosition')}>
                      Vacancy {sortedColumn === 'numberOfPosition' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope="col">Job Description</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td
                        title={job.jobCategory === "evergreen" && !job.applicationDeadline ?
                          "This position is always open for hiring,candidates can apply any time and hr open to chat with right candidates!" :
                          ""
                        }
                      >
                        {job.jobTitle}
                      </td>
                      <td>{job.jobType}</td>
                      <td>{job.skills}</td>
                      <td>
                        {job.jobCategory === "evergreen" && job.numberOfPosition === 0 ? (
                          <h6 style={{ color: 'green' }}>Evergreen job</h6>
                        ) : (
                          job.numberOfPosition
                        )}
                      </td>
                      <td>
                        {/* Use Link instead of Button */}
                        <Link
                          to={`/jobboxCompanyPage/eachCompanyPage/publicJobDetailsPage`}
                          state={{
                            companyName: job.companyName,
                            companyId: companyId,
                            jobId: job.jobId,
                          }}
                          className='btn btn-secondary btn-rounded'
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

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
            <h1>No jobs found.</h1>
          )}
        </div>
      ) : (
        <div className="selected-job-details">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleBackToList}>
              Back to Jobs
            </Button>
          </div>
          <h3>Job Details</h3>
          <p><strong>Title:</strong> {selectedJob.jobTitle}</p>
          <p><strong>Type:</strong> {selectedJob.jobType}</p>
          <p><strong>Skills:</strong> {selectedJob.skills}</p>
          <p><strong>Posting Date:</strong> {selectedJob.postingDate}</p>
          <p><strong>Vacancy:</strong> {selectedJob.numberOfPosition}</p>
          <p><strong>Salary:</strong> {selectedJob.salary}</p>
          <p><strong>Location:</strong> {selectedJob.location}</p>
          <strong>Job Summary:</strong>
          <pre className="job-details-text">{selectedJob.jobsummary}</pre>
          <p><strong>Application Deadline:</strong> {selectedJob.applicationDeadline}</p>
        </div>
      )}
    </div>
  )
}

export default CompanyJobs
