import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../apiClient';
import Pagination from '../Pagination';
import './BrowseJobs.css';
import CustomNavbar from './CustomNavbar';
import Footer from './Footer';
import JobListings from './JobListings';

const BrowseJobs = () => {
    const navigate = useNavigate();
    const [latestjobs, setLatestJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [companyLogos, setCompanyLogos] = useState({});
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setPageSize] = useState(6); // Default page size
    const [totalPages, setTotalPages] = useState(0);
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const isLastPage = page === totalPages - 1;
    const isPageSizeDisabled = isLastPage;
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    useEffect(() => {
        if (search) {
            fetchJobBySearch();
        }
        else {
            fetchData();

        }
    }, [page, size, search, sortedColumn, sortOrder]);

    // Fetch latest jobs
    const fetchData = useCallback(async () => {
        const params = {
            page: page,
            size: size,
        };
        try {
            const response = await api.latestJobs(params); // Added { params } here
            setLatestJobs(response.data.content);
            setTotalPages(response.data.totalPages);
            await fetchImages(response.data.content); // Pass the correct job data to fetchImages
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [page, size]);

    // Fetch company logos
    const fetchImages = async (jobs) => {
        try {
            const logoPromises = jobs.map(job => {
                console.log("Fetching logo for:", job.companyName);
                return fetchCompanyLogo(job.companyName);
            });
            const logos = await Promise.all(logoPromises);
            const logosMap = {};
            jobs.forEach((job, index) => {
                logosMap[job.companyName] = logos[index];
            });
            setCompanyLogos(logosMap);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    // Fetch individual company logo
    const fetchCompanyLogo = async (companyName) => {
        try {
            const response = await api.getLogo(companyName)
            return `data:image/jpeg;base64,${btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            )}`;
        } catch (error) {
            console.error('Error fetching company logo for:', companyName, error); // Debugging line
            return "/path/to/default_logo.png"; // Default logo in case of error
        }
    };
    // useEffect(() => {
    //     fetchJobBySearch();
    // }, [page, size, search, sortedColumn, sortOrder]);


    const fetchJobBySearch = async () => {
        try {
            console.log("Fetching jobs with params:", { search, page, size, sortedColumn, sortOrder });
            const response = await api.searchJobs(search, page, size, sortedColumn, sortOrder);
            console.log("API Response:", response.data);
            setJobs(response.data.content);
            setTotalPages(response.data.totalPages);
            await fetchImages(response.data.content);
        } catch (error) {
            console.log("Error fetching jobs:", error);
        }
    };

    // Handle input change for search bar
    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setSearch(inputValue);
        setPage(0);
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

    useEffect(() => {
        const storedPage = localStorage.getItem('BrowseJobsPage');
        if (storedPage !== null) {
            const parsedPage = Number(storedPage);
            if (parsedPage < totalPages) {
                setPage(parsedPage);
                console.log(page);
            }
        }

        console.log({ storedPage, totalPages });

    }, [totalPages]);


    // Handle page change for pagination
    const handlePageClick = (data) => {
        const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1)); // Ensure selectedPage is within range
        setPage(selectedPage);
        localStorage.setItem('BrowseJobsPage', selectedPage); // Store the page number in localStorage
    };
    const handlePageSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
        setPage(0);
    };

    console.log({ page, size, totalPages, jobsLength: jobs.length });

    // Calculate days ago for job posting
    const calculateDaysAgo = (postingDate) => {
        const today = moment();
        const postedDate = moment(postingDate);
        const daysAgo = today.diff(postedDate, 'days');
        if (daysAgo < 0) return 'Invalid date';
        if (daysAgo === 0) return 'Posted today';
        if (daysAgo === 1) return '1 day ago';
        if (daysAgo >= 2) return `${daysAgo} days ago`;
        return null;
    };

    const openModal = (content) => {
        setShowModal(true); // Open modal
    };

    const handleCandidateClick = () => {
        openModal('candidate'); // Set modal content for candidate
        localStorage.setItem('redirectAfterLogin', 'dream-job');

    };
    const closeModal = () => {
        setShowModal(false); // Close modal
    };

    const handleModalOptionClick = (option) => {
        closeModal();

        if (option === 'login') {

            navigate('/signin', { state: { userType: 'Candidate' } });
        }
        else if (option === 'register') {

            navigate('/candidate-signup', { state: { userType: 'Candidate' } });

        }
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [user, setUser] = useState(null); // Store the user object
    const [userId, setUserId] = useState(null); // State to store userId
    useEffect(() => {
        // Check if user is logged in (you can check localStorage/sessionStorage here)
        const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is saved here after login
        if (loggedInUser && loggedInUser.userName) {
            setIsLoggedIn(true);
            setUser(loggedInUser); // Set user object
            if (loggedInUser.userRole === 'Candidate') {
                setUserId(loggedInUser.userId); // Store userId for candidate
            }
        }
    }, []);
    console.log("User ID:", userId); // Example of using userId


    return (
        <div style={{ overflow: 'hidden' }}> 
            <div className="custom-navbar-container">
                <CustomNavbar />
            </div>
            <div className='welcome-msg' style={{ overflowY: 'scroll',overflowX:'hidden'}}>
                <Row>
                    <h1 className='text-center'>Find Your Dream Job & Apply for it</h1>
                    <p className='text-center' style={{ fontSize: '20px' }}>Jobs for you to explore</p>
                    <div className="parent-container">
                        <div className='home-search-bar'>
                            <input
                                type="text"
                                placeholder="Search by jobTitle/CompanyName/Skills/Location"
                                value={search}
                                className='search-input-bar'
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {jobs.length > 0 && search && (
                        <>
                            <h4 className='text-center'>Search Results</h4>
                            <div className="d-flex flex-wrap justify-content-center">
                                {jobs.map(job => {
                                    const daysAgoText = calculateDaysAgo(job.postingDate);
                                    return (
                                        <Card key={job.id} className='browse-job-card image-wrapper' style={{ maxWidth: '300px', margin: '10px', padding: '10px', position: 'relative' }}
                                            onClick={() => {
                                                const baseUrl = '/#/browse-jobs/job-details';
                                                // Construct the query parameters manually
                                                const params = new URLSearchParams({
                                                    companyName: encodeURIComponent(job.companyName || ''),
                                                    jobId: encodeURIComponent(job.jobId || ''),
                                                }).toString();
                                                // Construct the final URL with parameters after the hash
                                                const fullUrl = `${window.location.origin}${baseUrl}?${params}`;
                                                console.log("full url --> " + fullUrl);
                                                // Open the new page in a new tab
                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                            }}
                                        >
                                            <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <img
                                                    src={companyLogos[job.companyName] || "/path/to/default_logo.png"}
                                                    alt={`${job.companyName} logo`}
                                                    style={{ width: '30%', height: '30%', position: 'absolute', top: '5px', right: '10px' }}
                                                />
                                                <Card.Title style={{ marginTop: '40px' }}>{job.jobTitle}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">{job.companyName}</Card.Subtitle>
                                                <Card.Text>{daysAgoText}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </div>
                            <Pagination
                                page={page}
                                pageSize={size}
                                totalPages={totalPages}
                                handlePageSizeChange={handlePageSizeChange}
                                isPageSizeDisabled={isPageSizeDisabled}
                                handlePageClick={handlePageClick}
                            />
                        </>
                    )}

                    {!search && latestjobs.length > 0 && (
                        <>
                            <h4 className='text-center' style={{ paddingTop: '10px' }}>Newly Posted Jobs</h4>
                            <div className="browse-jobs-container">
                                <div className="image-slider">
                                    {latestjobs.map(job => {
                                        const daysAgoText = calculateDaysAgo(job.postingDate);
                                        return (
                                            <Card style={{ width: '250px', marginLeft: '10px', paddingTop: '0px' }}
                                                key={job.id}
                                                onClick={() => {
                                                    const baseUrl = '/#/browse-jobs/job-details';
                                                    // Construct the query parameters manually
                                                    const params = new URLSearchParams({
                                                        companyName: encodeURIComponent(job.companyName || ''),
                                                        jobId: encodeURIComponent(job.jobId || ''),
                                                    }).toString();
                                                    // Construct the final URL with parameters after the hash
                                                    const fullUrl = `${window.location.origin}${baseUrl}?${params}`;
                                                    console.log("full url --> " + fullUrl);
                                                    // Open the new page in a new tab
                                                    window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                }}
                                            >

                                                <Card.Body>
                                                    <img
                                                        src={companyLogos[job.companyName] || "/path/to/default_logo.png"}
                                                        alt={`${job.companyName} logo`}
                                                        style={{ width: '30%', height: '30%', position: 'absolute', top: '5px', right: '10px' }}
                                                    />
                                                    <Card.Title style={{ marginTop: '40px', fontSize: '12px' }}>{job.jobTitle}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{job.companyName}</Card.Subtitle>
                                                    <Card.Text>{daysAgoText}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {jobs.length === 0 && search && <h1 className='text-center' style={{ color: 'red' }}>"No jobs found"</h1>}
                </Row>


                <br></br>
                <Row>
                    <div className="jobbox-container" style={{ height: 'auto' }}>
                        <div className="column" style={{ position: 'relative', bottom: '30px' }}>
                            <img src="dreamJob.jpeg" alt="Image 2" />
                        </div>

                        <div className="steps-container column" style={{ height: 'auto' }}>
                            <div className='cta-accent2-bg'>
                                <div className='cta-accent1-bg'>
                                    <div className='cta-content'>
                                        <span className='thq-heading-2'>
                                            Need to Apply to Your Dream Company and Dream Job?
                                        </span>
                                        <p className='thq-body-large'>Don't worry! At JobBox, your job search is easy—explore opportunities with just one click and connect with top employers ready for your talent!</p>

                                        <div className="button-container">
                                            {isLoggedIn ? (
                                                user?.userRole === 'Candidate' ? (
                                                    <Button
                                                        type="button"
                                                        className="thq-button-filled cta-button"
                                                        variant="info"
                                                        style={{ marginRight: '10px' }}
                                                        onClick={() => navigate('/candidate-dashboard/jobs/dream-job', { state: { userId: user.userId, userName: user.userName } })}
                                                    >
                                                        Apply for Your Dream Job at Your Dream Company
                                                    </Button>
                                                ) : null // No button for HR or other roles
                                            ) : (
                                                <Button
                                                    type="button"
                                                    className="thq-button-filled cta-button"
                                                    variant="info"
                                                    style={{ marginRight: '10px' }}
                                                    onClick={handleCandidateClick} // If no user is logged in, handle login click
                                                >
                                                    Apply for Your Dream Job at Your Dream Company
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <div>
                    <JobListings />
                </div>

                <div style={{ marginTop: '100px' }}>
                    <Footer />
                </div>

                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton style={{ backgroundColor: '#faccc', color: 'white', borderBottom: 'none' }}>
                        <Modal.Title>Choose an Option</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '20px', textAlign: 'center' }}>
                        <Button
                            variant="primary"
                            onClick={() => handleModalOptionClick('login')}
                            style={{ width: '100%', marginBottom: '10px', backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}
                        >
                            Already have an account - Login
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => handleModalOptionClick('register')}
                            style={{ width: '100%', backgroundColor: '#00b894', borderColor: '#00b894' }}
                        >
                            Don't have an account - Register
                        </Button>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default BrowseJobs;
