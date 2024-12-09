import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Pagination from '../../Pagination';
const CompanyJobs = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const [jobs, setJobs] = useState([]);
    const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
    const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const [userData, setUserData] = useState({});
    const userEmail = location.state?.userEmail || '';
    const isLastPage = page === totalPages - 1;
    const isPageSizeDisabled = isLastPage;

    const getUser = async (userEmail) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
            setUserData(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchJobs();
        if (userEmail) {
            getUser(userEmail);
        }
    }, [userEmail, page, pageSize, sortedColumn, sortOrder]);

    const fetchJobs = async () => {
        try {
            const params = {
                userEmail: userEmail,
                page: page,
                size: pageSize,
                sortBy: sortedColumn, // Include sortedColumn and sortOrder in params
                sortOrder: sortOrder,
            };

            const response = await axios.get(`${BASE_API_URL}/jobsPostedByHrEmaileachCompany`, { params });
            setJobs(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching jobs data:', error);
        }
    };


    const handlePageSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
        setPage(0); // Reset page when page size change
    };

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

    const handleCloseModal = () => {
        setSelectedJobSummary(null);
    };

    const [selectedJobSummary, setSelectedJobSummary] = useState(null);

    const handleViewSummary = (summary) => {
        setSelectedJobSummary(summary);
    };

    return (
        <div className="company-job" style={{ marginTop: '20px', width: '100%', height: "fit-content" }}>
            <div className="jobs_list">
                {jobs.length > 0 ? (
                    <div>
                        <div className='table-wrapper'>
                            <Table hover className='text-center'>
                                <thead className="table-light">
                                    <tr>
                                        <th
                                            scope="col"
                                            onClick={() => handleSort('jobTitle')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Job Title
                                            <span>
                                                <span
                                                    style={{
                                                        color: sortedColumn === 'jobTitle' && sortOrder === 'asc' ? 'black' : 'gray',
                                                    }}
                                                >
                                                    ↑
                                                </span>
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
                                            Job Type
                                            <span>
                                                <span
                                                    style={{
                                                        color: sortedColumn === 'jobType' && sortOrder === 'asc' ? 'black' : 'gray',
                                                    }}
                                                >
                                                    ↑
                                                </span>
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
                                            Skills
                                            <span>
                                                <span
                                                    style={{
                                                        color: sortedColumn === 'skills' && sortOrder === 'asc' ? 'black' : 'gray',
                                                    }}
                                                >
                                                    ↑
                                                </span>
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
                                            Vacancy
                                            <span>
                                                <span
                                                    style={{
                                                        color: sortedColumn === 'numberOfPosition' && sortOrder === 'asc' ? 'black' : 'gray',
                                                    }}
                                                >
                                                    ↑
                                                </span>
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
                                    </tr>
                                </thead>

                                <tbody>
                                    {jobs.map(job => (
                                        <tr key={job.id}>
                                            <td
                                                title={job.jobCategory === "evergreen" && job.numberOfPosition === 0 ?
                                                    "Company is always hiring for this position and open to chat with right candidates" :
                                                    ""
                                                }
                                            >
                                                {job.jobTitle}
                                            </td>
                                            <td>{job.jobType}</td>
                                            <td>{job.skills}</td>
                                            <td>
                                                {job.jobCategory === "evergreen" && job.numberOfPosition === 0 ? (
                                                    <h6 style={{ color: 'green' }} title="Company is always hiring for this position and open to chat with right candidates">
                                                        Evergreen job
                                                    </h6>
                                                ) : (
                                                    job.numberOfPosition
                                                )}
                                            </td>
                                            <td>
                                                <Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job.jobsummary)}>
                                                    Summary
                                                </Button>
                                            </td>
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

                        {/* Pagination */}
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
    )
}
export default CompanyJobs


