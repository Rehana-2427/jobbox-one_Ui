import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import Pagination from '../../Pagination';
import HrLeftSide from './HrLeftSide';
const People = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const [people, setPeople] = useState([]);
    const userName = location.state?.userName;
    const userEmail = location.state?.userEmail;
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
    const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
    const isLastPage = page === totalPages - 1;
    const isPageSizeDisabled = isLastPage;
    const [user, setUser] = useState(null); // State to hold user data
    const fetchHRData = useCallback(async () => {
        if (!user) return; // Ensure user is loaded
        try {
            const params = {
                userEmail: user.userEmail, // Use the user email from the context
                page,
                size: pageSize,
                sortBy: sortedColumn,
                sortOrder,
            };
            const response = await axios.get(`${BASE_API_URL}/getHrEachCompany`, { params });
            setPeople(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log("People--> "+response.data.content);
            console.log("People.length--> "+response.data.content.length);
        } catch (error) {
            console.error('Error fetching HR data:', error);
        }
    }, [user, page, pageSize, sortedColumn, sortOrder]);
    useEffect(() => {
        // Load user data from localStorage on component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    useEffect(() => {
        fetchHRData();
    }, [fetchHRData]);
    const handleSort = (column) => {
        let order = 'asc';
        if (sortedColumn === column) {
            order = sortOrder === 'asc' ? 'desc' : 'asc';
        }
        setSortedColumn(column);
        setSortOrder(order);
    };
    const navigate = useNavigate();
    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setPage(selectedPage);
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
    const initials = getInitials(userName);
    const handlePageSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
        setPage(0); // Reset page when page size change
    };
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
            confirmButtonColor: '#3085D6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                localStorage.removeItem(`userName_${userEmail}`);
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
                <HrLeftSide user={{ userName, userEmail }} onClose={toggleLeftSide} />
            </div>
            <div className="right-side">
                <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
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
                {people.length > 0 && (
                    <div>
                        <div className='table-details-list'>
                            <Table hover className='text-center'>
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" onClick={() => handleSort('userName')}>
                                            HR Name {sortedColumn === 'userName' && (
                                                sortOrder === 'asc' ? '▲' : '▼'
                                            )}
                                        </th>
                                        <th scope="col" onClick={() => handleSort('userEmail')}>
                                            Email {sortedColumn === 'userEmail' && (
                                                sortOrder === 'asc' ? '▲' : '▼'
                                            )}
                                        </th>
                                        <th scope="col">Company Name </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {people.map(person => (
                                        <tr key={person.userId}>
                                            <td>{person.userName}</td>
                                            <td>
                                                <a href={`mailto:${person.userEmail}`}>{person.userEmail}</a>
                                            </td>
                                            <td>{person.companyName}</td>
                                        </tr>
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
                    </div>
                 )} 
            </div>
      
        </div>
    );
}
export default People;






