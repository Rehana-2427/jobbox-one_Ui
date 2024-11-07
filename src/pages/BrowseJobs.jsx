import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import './BrowseJobs.css';
import CustomNavbar from './CustomNavbar';
import HomeFooter from './HomeFooter';
import JobListings from './JobListings';

const BrowseJobs = () => {
    const navigate = useNavigate();
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const [latestjobs, setLatestJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [companyLogos, setCompanyLogos] = useState({});
    const [search, setSearch] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(4); // Default page size
    const [totalPages, setTotalPages] = useState(0);
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    // const [isSearching, setIsSearching] = useState(false); // Track if searching is active
    const isLastPage = page === totalPages - 1;
    const isPageSizeDisabled = isLastPage;
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    useEffect(() => {
        // Fetch latest jobs or jobs based on search only when the search button is clicked
        if (search) {
            fetchJobBySearch();
        }
        else {
            fetchData();
        }
    }, [page, pageSize, search, sortOrder, sortedColumn]);

    // Fetch latest jobs
    const fetchData = useCallback(async () => {
        const params = {
            page: page,
            size: pageSize,
        };
        try {
            const response = await axios.get(`${BASE_API_URL}/latestJobs`, { params }); // Added { params } here
            setLatestJobs(response.data.content);
            setTotalPages(response.data.totalPages);
            await fetchImages(response.data.content); // Pass the correct job data to fetchImages
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [page, pageSize]);


    // Fetch company logos
    // Fetch company logos
    const fetchImages = async (jobs) => {
        try {
            const logoPromises = jobs.map(job => {
                console.log("Fetching logo for:", job.companyName); // Debugging line
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
            const response = await axios.get(`${BASE_API_URL}/logo`, {
                params: { companyName },
                responseType: 'arraybuffer',
            });
            return `data:image/jpeg;base64,${btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            )}`;
        } catch (error) {
            console.error('Error fetching company logo for:', companyName, error); // Debugging line
            return "/path/to/default_logo.png"; // Default logo in case of error
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
            };
            const response = await axios.get(`${BASE_API_URL}/searchJobs`, { params });
            setJobs(response.data.content);
            setTotalPages(response.data.totalPages);
            await fetchImages(response.data.content); // Add this line to fetch logos for search results
        } catch (error) {
            console.log("No data Found" + error);
        }
    };

    // Handle input change for search bar
    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setSearch(inputValue);
        setPage(0);
        // if (inputValue.trim() === '') {
        //     setIsSearching(false); // Reset to latest jobs if input is cleared
        //     setShowWarning(false); // Hide warning when input changes
        // } else
        //   setIsSearching(true); // set to search jobs 
    };

    // // Handle search button click
    // const handleSearchClick = () => {
    //     if (search.trim() === '') {
    //         setShowWarning(true); // Show warning if search is empty
    //     } else {
    //         setIsSearching(true); // Trigger search only when input is not empty
    //         setShowWarning(false); // Hide warning on valid search
    //     }
    // };

    // Handle page change for pagination
    const handlePageClick = (data) => {
        setPage(data.selected);
    };

    const handlePageSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
    };


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
        <div>
            <CustomNavbar />
            <div className='browse-jobs home-card-one text-wrapper'>
                <h1 className='text-center'>Find Your Dream Job & Apply for it</h1>
                <p className='text-center' style={{ fontSize: '20px' }}>Jobs for you to explore</p>
                <div class="parent-container">
                    <div className='home-search-bar'>
                        <input
                            type="text"
                            placeholder="Search by jobTitle/CompanyName/Skills/Location"
                            value={search}
                            className='search-input-bar'
                            onChange={handleInputChange}


                        />

                        <FaSearch fontSize={20} style={{
                            position: 'absolute',
                            top: '12px',
                            right: '50px', // Adjust as needed to position it correctly
                        }} />

                        {/* <Button
                        className="search-button"
                        onClick={handleSearchClick}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            height: '40px',
                            width: '130px',
                        }}
                    >
                        <b style={{ fontSize: '18px' }}>Search</b>
                    </Button> */}
                    </div>
                </div>



                {jobs.length > 0 && search && (
                    <>
                        <h2>Search Results</h2>
                        <div className="d-flex flex-wrap justify-content-center">
                            {jobs.map(job => {
                                const daysAgoText = calculateDaysAgo(job.postingDate);
                                return (

                                    <Card key={job.id} className='browse-job-card image-wrapper' style={{ maxWidth: '300px', margin: '10px', padding: '10px', position: 'relative' }}
                                        onClick={() => {
                                            const url = new URL('/#/browse-jobs/job-details', window.location.origin);
                                            url.searchParams.append('companyName', encodeURIComponent(job.companyName));
                                            url.searchParams.append('jobId', encodeURIComponent(job.jobId)); // Use job.id
                                            window.open(url.toString(), '_blank', 'noopener,noreferrer'); // Open in a new tab
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
                        {/* <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            handlePageClick={handlePageClick}
                            handlePageSizeChange={handlePageSizeChange}
                            pageSize={pageSize}
                            isPageSizeDisabled={isPageSizeDisabled}
                        /> */}
                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            totalPages={totalPages}
                            handlePageSizeChange={handlePageSizeChange}
                            isPageSizeDisabled={isPageSizeDisabled}
                            handlePageClick={handlePageClick}
                        />
                    </>
                )}

                {!search && latestjobs.length > 0 && (
                    <>

                        <h2 style={{ paddingTop: '40px' }}>Newly Posted Jobs</h2>
                        {/* <div className="d-flex flex-wrap justify-content-center"> */}
                        <div className="image-slider-container">
                        <div className="image-slider">

                            {latestjobs.map(job => {
                                const daysAgoText = calculateDaysAgo(job.postingDate);
                                return (
                                            <Card
                                                key={job.id}
                                                className=' image-wrapper'
                                                style={{ maxWidth: '300px', margin: '10px', padding: '10px', position: 'relative' }}
                                                onClick={() => {
                                                    const url = new URL('/#/browse-jobs/job-details', window.location.origin);
                                                    url.searchParams.append('companyName', encodeURIComponent(job.companyName));
                                                    url.searchParams.append('jobId', encodeURIComponent(job.jobId)); // Use job.id
                                                    window.open(url.toString(), '_blank', 'noopener,noreferrer'); // Open in a new tab
                                                }}
                                            >
                                                <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    
                                                    <img
                                                        src={companyLogos[job.companyName] || "/path/to/default_logo.png"}
                                                        alt={`${job.companyName} logo`}
                                                        className='square-image'
                                                        style={{ width: '30%', height: '30%', position: 'absolute', top: '5px', right: '10px' }} // Adjusted top value
                                                    />
                                                    <Card.Title style={{ marginTop: '40px' }}>{job.jobTitle}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{job.companyName}</Card.Subtitle>
                                                    <Card.Text>{daysAgoText}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                       
                                );
                            })}
                            {/* <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                handlePageClick={handlePageClick}
                                handlePageSizeChange={handlePageSizeChange}
                                pageSize={pageSize}
                                isPageSizeDisabled={isPageSizeDisabled}
                            /> */}


                        </div>
                        </div>
                        {/* <Pagination
                                page={page}
                                pageSize={pageSize}
                                totalPages={totalPages}
                                handlePageSizeChange={handlePageSizeChange}
                                isPageSizeDisabled={isPageSizeDisabled}
                                handlePageClick={handlePageClick}
                            /> */}
                    </>
                )}

                {jobs.length === 0 && search && <h1 className='text-center' style={{ color: 'red' }}>"No jobs found"</h1>}
            </div>

            {/* <div className="thq-section-padding">
                <div className='thq-section-max-width'>
                    <div className='cta-accent2-bg'>
                        <div className='cta-accent1-bg'>
                            <div className='cta-container1'>
                                <div className='cta-content'>
                                    <span className='thq-heading-2'>Need to Apply to Your Dream Company and Dream Job?</span>
                                    <p className='thq-body-large'>Don't worry! At JobBox, your job search is easy—explore opportunities with just one click and connect with top employers ready for your talent!</p>
                                </div>
                                <div className="button-container">
                                    {isLoggedIn ? (
                                        user?.userRole === 'Candidate' ? (
                                            <Button
                                                type="button"
                                                className="thq-button-filled cta-button"
                                                variant="info"
                                                style={{ marginRight: '10px' }}
                                                onClick={() => navigate('/candidate-dashboard/dream-job', { state: { userId: user.userId, userName: user.userName } })}
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

            </div> */}

            <div className="jobbox-container" style={{ height: '600px'}}>
                <div className="column" style={{ position: 'relative', bottom: '30px' }}>
                    <img src="dreamJob.jpeg" alt="Image 2" style={{ width: '100%', height: '100%' }} />
                </div>
                <div className="steps-container column" style={{height:'530px'}}>
                    <div className='cta-accent2-bg'>
                        <div className='cta-accent1-bg'>
                            <div className='cta-content'>
                                <span className='thq-heading-2'>Need to Apply to Your Dream Company and Dream Job?</span>
                                <p className='thq-body-large'>Don't worry! At JobBox, your job search is easy—explore opportunities with just one click and connect with top employers ready for your talent!</p>

                                <div className="button-container">
                                    {isLoggedIn ? (
                                        user?.userRole === 'Candidate' ? (
                                            <Button
                                                type="button"
                                                className="thq-button-filled cta-button"
                                                variant="info"
                                                style={{ marginRight: '10px' }}
                                                onClick={() => navigate('/candidate-dashboard/dream-job', { state: { userId: user.userId, userName: user.userName } })}
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

            </div >

            <div style={{marginTop:'100px'}}>
                <JobListings />
            </div>
            <div style={{marginTop:'100px'}}>
                <HomeFooter />
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
    );
};

export default BrowseJobs;
