import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Pagination from '../../Pagination';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';


const ViewMoreJobs = () => {
    // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const [queryParams, setQueryParams] = React.useState({});

    React.useEffect(() => {
        const queryString = window.location.href.split('#')[0].split('?')[1];
        const params = new URLSearchParams(queryString);
        const companyName = params.get('companyName');
        const jobId = params.get('jobId');
        const userId = params.get('userId');
        const userName = params.get('userName');
        setQueryParams({ companyName, jobId, userId, userName });
    }, [location]);

    const { companyName, userId, userName } = queryParams;
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5); // Default page size
    const [totalPages, setTotalPages] = useState(0);
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [resumes, setResumes] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [hasUserApplied, setHasUserApplied] = useState({});
    const [selectedJobSummary, setSelectedJobSummary] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [companyLogo, setCompanyLogo] = useState("");
    const [companyBanner, setCompanyBanner] = useState("");
    const [jobs, setJobs] = useState([]);
    const [applyjobs, setApplyJobs] = useState([]);
    const [showResumePopup, setShowResumePopup] = useState(false);
    const [search, setSearch] = useState('');
    const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);
    

    console.log(companyName);
    const toggleLeftSide = () => {
        console.log("Toggling left side visibility");
        setIsLeftSideVisible(!isLeftSideVisible);
    };

    useEffect(() => {
        if (search) {
            fetchJobBySearch();
        }
        else{
            fetchCompanyJobs()
        }
    }, [page, pageSize, search, sortedColumn, sortOrder, filterStatus, companyName]);

    useEffect(()=>{
        if(companyName){
            fetchCompanyBanner(companyName)
            fetchCompanyLogo(companyName)
        }
    },[companyName])
    async function fetchCompanyJobs() {
        try {
            const params = {
                page: page,
                size: pageSize,
                sortBy: sortedColumn,
                sortOrder: sortOrder,
                companyName: companyName
            };
            const response = await axios.get(`${BASE_API_URL}/getJobsByCompany`, { params });
            setJobs(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const fetchCompanyLogo = async (companyName) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/logo`, { params: { companyName }, responseType: 'arraybuffer' });
            const image = `data:image/jpeg;base64,${btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            )}`;
            setCompanyLogo(image);
        } catch (error) {
            console.error('Error fetching company logo:', error);
        }
    };

    const fetchCompanyBanner = async (companyName) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/banner`, { params: { companyName }, responseType: 'arraybuffer' });
            const image = `data:image/jpeg;base64,${btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            )}`;
            setCompanyBanner(image);
        } catch (error) {
            console.error('Error fetching company banner:', error);
        }
    };
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
      };

    const handleSort = (column) => {
        let order = 'asc';
        if (sortedColumn === column) {
            order = sortOrder === 'asc' ? 'desc' : 'asc';
        }
        setSortedColumn(column);
        setSortOrder(order);
    };
    const handleApplyButtonClick = (jobId) => {
        setSelectedJobId(jobId);
        setShowResumePopup(true);
    };
    const handleCloseModal = () => {
        setSelectedJobSummary(null);
    };
    const handlePageSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
    };
    const handlePageClick = (data) => {
        const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1)); // Ensure selectedPage is within range
        setPage(selectedPage);
        localStorage.setItem('moreJobsCompany', selectedPage); // Store the page number in localStorage
    };
    const isLastPage = page === totalPages - 1;
    const isPageSizeDisabled = isLastPage;
    const fetchJobBySearch = async () => {
        try {
          const params = {
            search: search,
            page: page,
            size: pageSize,
            sortBy: sortedColumn,
            sortOrder: sortOrder,
            companyName:companyName
          };
          const response = await axios.get(`${BASE_API_URL}/searchJobsInCompany`, { params });
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

    const handleResumeSelect = async (resumeId) => {
        if (selectedJobId && resumeId) {
            await applyJob(selectedJobId, resumeId);
            setSelectedJobId(null);
            setShowResumePopup(false);
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

   
    return (
        <div className='dashboard-container'>
            <div>
                <button className="hamburger-icon" onClick={toggleLeftSide} >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
                <CandidateLeftSide user={{ userName, userId }} onClose={toggleLeftSide} />
            </div>

            <div className="right-side" style={{ overflowY: 'scroll' }}>
                {showResumePopup && (
                    <ResumeSelectionPopup
                        resumes={resumes}
                        onSelectResume={handleResumeSelect}
                        onClose={() => setShowResumePopup(false)}
                    />
                )}
                <div>
                    <Card style={{ width: '100%', height: '60%' }}>
                        <Card.Body style={{ padding: 0, position: 'relative' }}>
                            <div style={{ position: 'relative', height: '55%' }}>
                                <img
                                    src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                                    alt="Company Banner"
                                    className="banner-image"
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                                />
                            </div>
                            <div style={{ position: 'absolute', top: '100%', left: '50px', transform: 'translateY(-50%)' }}>
                                <img
                                    src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                                    alt="Company Logo"
                                    className="logo-image"
                                    style={{
                                        width: '200px', // Fixed width
                                        height: '120px', // Fixed height
                                        cursor: 'pointer',
                                        // border: '5px solid white',
                                        clipPath: 'ellipse(50% 50% at 50% 50%)', // Creates a horizontal oval
                                        objectFit: 'cover', // Ensures the image covers the dimensions without distortion
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </div><br></br><br></br>

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
                </div>

                {jobs.length > 0 && (
                    <div>
                        <h2>{companyName} Jobs</h2>
                        <div className='table-details-list table-wrapper'>
                            <Table hover className='text-center'>
                                <thead className="table-light">
                                    <tr>
                                        <th scope='col' onClick={() => handleSort('jobTitle')}>
                                            Job Profile {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th scope='col' onClick={() => handleSort('applicationDeadline')}>
                                            Application Deadline {sortedColumn === 'applicationDeadline' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th scope='col' onClick={() => handleSort('skills')}>
                                            Skills {sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th scope='col' onClick={() => handleSort('location')}>
                                            Location {sortedColumn === 'location' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th scope='col'>Job description</th>
                                        <th scope='col'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map(job => (
                                        <tr key={job.id} id='job-table-list'>
                                            <td>{job.jobTitle}</td>
                                            <td>{job.applicationDeadline}</td>
                                            <td>{job.skills}</td>
                                            <td>{job.location}</td>
                                            <td>
                                                <Button
                                                    variant="secondary"
                                                    className='description btn-rounded'
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
                                    <span className="close" onClick={handleCloseModal}>&times;</span>
                                    <div className="job-summary">
                                        <h3>Job Summary</h3>
                                        <pre className='job-details-text'>{selectedJobSummary}</pre>
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
            </div>
        </div>
    )
}

export default ViewMoreJobs
