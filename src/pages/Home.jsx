import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CircularImageSlider from './CircularImageSlider';
import CustomNavbar from './CustomNavbar';
import HomeFooter from './HomeFooter';
import Jobboxcard from './Jobboxcard';
import './PagesStyle/Pages.css';
import DreamCard from './DreamCard';

const Home = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
  };

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchJobBySearch();
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      let response;
      // if (search) {
      //   response = await axios.get(`${BASE_API_URL}/searchJobs`, { params: { ...params, search } });
      //   setJobs(response.data.content);
      // } else {
      response = await axios.get(`${BASE_API_URL}/latestJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      //}
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [page, pageSize, search, sortedColumn, sortOrder]);

  const fetchJobBySearch = useCallback(async () => {
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
    } catch (error) {
      console.log("No data Found" + error);
    }
    console.log("Search submitted:", search);
  }, [search, page, pageSize, sortedColumn, sortOrder]);

  useEffect(() => {
    localStorage.setItem('currentCompanyPage', 0);
    localStorage.setItem('currentCompanyPageSize', 5);
    if (search) {
      fetchJobBySearch();
    } else {
      fetchData();
    }
  }, [page, pageSize, search, sortedColumn, sortOrder]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinkStyle = screenWidth > 990 ? { marginRight: '40px', marginLeft: '150px' } : {};
  const carouselImageList = [
    "/jb_logo.png",
    "/jb_logo.png",
    "/jb_logo.png",
    "/jb_logo.png"
  ];
  const [groupedImages, setGroupedImages] = useState([]);
  const [imageKeys, setImageKeys] = useState({}); // To store the mapping of image URLs to keys
  const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/companylogos`);
        const imagesMap = response.data;
        const imagesArray = Object.entries(imagesMap).map(([id, imageData]) => ({
          id: parseInt(id, 10),
          src: `data:image/jpeg;base64,${imageData}`
        }));
        const imageSrcKeys = imagesArray.reduce((acc, { id, src }) => {
          acc[src] = id;
          return acc;
        }, {});
        setImageKeys(imageSrcKeys);
        setGroupedImages(groupeImages(imagesArray, 4));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);

  const groupeImages = (images, groupSize) => {
    const result = [];
    for (let i = 0; i < images.length; i += groupSize) {
      result.push(images.slice(i, i + groupSize));
    }
    return result;
  };

  const handleImageClick = (imageSrc) => {
    const key = imageKeys[imageSrc];
    if (key) {
      navigate(`/jobboxCompanyPage/eachCompanyPage`, { state: { companyId: key } });
    }
  };
  console.log(imageKeys)
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const handleCandidateClick = () => {
    setShowModal(true); // Open modal
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

      navigate('/signup/userSignup', { state: { userType: 'Candidate' } });
    }
  };
  const [padding, setPadding] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setPadding(10); // Less padding for smaller screens
      } else if (window.innerWidth < 768) {
        setPadding(100);
      } else {
        setPadding(20); // Default padding for larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set the initial padding based on the initial screen size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <div>
        <CustomNavbar />
      </div>
      {/* <div className="carousel-container" style={{ paddingTop: '70px' }}>
        <Card body className="text-center" style={{ width: '100%' }}>
          <Carousel >
            {carouselImageList.map((img, ind) => (
              <Carousel.Item key={ind} >
                <img
                  className="d-block w-25 carousel-image"
                  src={img}
                  alt={`Slide ${ind}`}

                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Card>
      </div> */}

      {/* <div className='jobs'style={{ paddingTop: '150px' }}>
        <h2>Find your dream job</h2>
        <div className='search'>
          <div className='home-search-bar'>
            <input
              type="text"
              placeholder="Search by jobrole,companyname,skills,location"
              value={search}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="text-center">
            <p><b>Popular Searches:</b> Designer, Web Developer, IOS, Developer, PHP, Senior Developer, Engineer</p>
          </div>
        </div>
        {jobs.length > 0 && (
          <div>
            <div className='text-center'>
              <h2>Latest Jobs & Companies</h2>
            </div>
            <div className='table-details-list table-wrapper' style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr>
                    <th scope='col' onClick={() => handleSort('jobTitle')}>
                      Job Profile {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope='col' onClick={() => handleSort('companyName')}>
                      Company Name{sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
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
                    <th scope='col'>Job Summary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} id='job-table-list'>
                      <td
                        title={job.jobCategory === "evergreen" && !job.applicationDeadline ?
                          "This position is always open for hiring,candidates can apply any time and hr open to chat with right candidates!" :
                          ""
                        }
                      >
                        {job.jobTitle}
                      </td>
                      <td>{job.companyName}</td>
                      <td>
                        {job.jobCategory === "evergreen" && !job.applicationDeadline ? (
                          <span style={{ color: 'green', fontWeight: 'bold' }}>
                            Evergreen Job-No Due Date
                          </span>
                        ) : (
                          job.applicationDeadline || 'Not Specified'
                        )}
                      </td>                    <td>{job.skills}</td>
                      <td>{job.location}</td>
                      <td><Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job.jobsummary)}>Summary</Button></td>
                      <td> <Button
                        variant="success"
                        onClick={handleCandidateClick}
                      >
                        Apply
                      </Button></td>
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
        )}
        {jobs.length === 0 && <h1>No jobs found.</h1>}
      </div> */}

      <div className="thq-section-padding home-card-one">
        <div className='thq-section-max-width'>
          <div className='cta-accent2-bg'>
            <div className='cta-accent1-bg'>
              <div className='cta-container1'>
                <div className='cta-content'>
                  <span className='thq-heading-2'>Find Your Dream Job</span>
                  <p className='thq-body-large'>
                    Explore thousands of job opportunities and take the next step in your career. Whether you're a seasoned professional or just starting out, JobBox connects you with top employers across a wide range of industries.
                    Discover roles tailored to your skills and passions, and seize the chance to make an impact. With easy access to job listings, personalized recommendations, and helpful career resources, your dream job is just a click away. Start your journey today and unlock your true potential!
                  </p>

                </div>
                <div className='cta-actions'>
                  <a href="/#/browse-jobs" target="_blank" rel="noopener noreferrer">
                    <button type="button" className="thq-button-filled cta-button">
                      Browse Jobs
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Jobboxcard />
      </div>
      <div>
      <DreamCard/>
      </div>
      <div style={{ paddingTop: `${padding}px`, paddingBottom: `${padding}px` }}>
        <CircularImageSlider />
      </div>

      <div>
        <HomeFooter />
      </div>

      {/* Modal for Apply button */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton style={{ backgroundColor: '#faccc', color: 'white', borderBottom: 'none' }}>
          <Modal.Title>Choose an Option</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px', textAlign: 'center' }}>

          <>
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
          </>

        </Modal.Body>
      </Modal>

    </div>
  );
};

export default Home;
