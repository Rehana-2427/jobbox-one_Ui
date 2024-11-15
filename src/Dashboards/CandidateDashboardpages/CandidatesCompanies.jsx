import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button, Dropdown, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import Pagination from '../../Pagination';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const CandidatesCompanies = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const appliedCompany = location.state?.appliedCompany || false;
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handlePageClick = (data) => {
    const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1)); // Ensure selectedPage is within range
    setPage(selectedPage);
    localStorage.setItem('currentCandidateCompanyPage', selectedPage); // Store the page number in localStorage
  };


  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size changes
    // localStorage.setItem('currentCandidateCompanyPage', 0); // Store the page number in localStorage

  };

  console.log(appliedCompany)
  useEffect(() => {
    if (appliedCompany && !search) {
      fetchDataByAppliedCompanies();
    } else {

      fetchData();
    }
  }, [search, page, pageSize]);

  const fetchDataByAppliedCompanies = async () => {
    try {
      const appliedCompanies = await axios.get(`${BASE_API_URL}/appliedCompanies`, {
        params: {
          userId: userId,
          page: page,
          size: pageSize
        }
      });
      console.log(appliedCompanies.data.content.length);
      setCompanies(appliedCompanies.data.content);
      setTotalPages(appliedCompanies.data.totalPages);
    } catch (error) {
      console.log("Error fetching data: " + error);
    }
  };
  const fetchData = async () => {
    try {
      const url = search
        ? `${BASE_API_URL}/searchCompany`
        : `${BASE_API_URL}/companiesList`;

      const params = {
        search,
        page: page,
        size: pageSize
      };

      console.log("Fetching data with params:", params);
      const response = await axios.get(url, { params });
      if (response.data.content.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Company not found!"
        });
        setSearch('');
      }
      setCompanies(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("Error fetching data: " + error);
    }
  };
  const toggleSettings = () => {
    navigate('/');
  };
  useEffect(() => {
    const storedPage = localStorage.getItem('currentCandidateCompanyPage');
    if (storedPage !== null) {
      const parsedPage = Number(storedPage);
      if (parsedPage < totalPages) {
        setPage(parsedPage);
        console.log(page);
      }
    }
  }, [totalPages]); // Make sure to include totalPages dependency to sync the state
  const handleClick = (companyId) => {
    navigate("/candidate-dashboard/companyPage", { state: { companyId: companyId, userName: userName, userId: userId } });
  };


  const user = {
    userName: userName,
    userId: userId,
  };
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
                <div className="initials-placeholder"
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

          <div className="container mt-4">
            {companies.length > 0 ? (
              <div className='table-details-list table-wrapper'>
                <Table hover className='text-center'>
                  <thead className="table-light">
                    <tr>
                      <th>Company Name</th>
                      <th>Industry</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.companyId}>
                        <td>{company.companyName}</td>
                        <td>{company.industryService}</td>
                        <td>
                          <Button variant="primary" onClick={() => handleClick(company.companyId)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
          {/* Conditional Rendering for Pagination */}
          {companies.length > 0 && (
            <Pagination
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              handlePageSizeChange={handlePageSizeChange}
              isPageSizeDisabled={isPageSizeDisabled}
              handlePageClick={handlePageClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default CandidatesCompanies;
