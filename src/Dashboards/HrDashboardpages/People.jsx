import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Footer from '../../pages/Footer';
import Pagination from '../../Pagination';
import DashboardLayout from './DashboardLayout ';
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
    const [loading, setLoading] = useState(false); // State to manage loading  
    const fetchHRData = useCallback(async () => {
        if (!user) return; // Ensure user is loaded
        try {
            setLoading(true);
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
            console.log("People--> " + response.data.content);
            console.log("People.length--> " + response.data.content.length);
        } catch (error) {
            console.error('Error fetching HR data:', error);
        } finally {
            setLoading(false);
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
    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setPage(selectedPage);
    };

    const handlePageSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
        setPage(0); // Reset page when page size change
    };

    return (
        <DashboardLayout>
            <div className="main-content">
                <Row>
                    <Col md={4}>
                        <h2><div className="text-start">HR Details</div></h2>
                    </Col>
                </Row>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-bubble spinner-bubble-primary m-5" />
                        <span>Loading...</span>
                    </div>
                ) : people.length > 0 && (
                    <div>
                        <div className='table-details-list table-wrapper'>
                            <Table hover className='text-center'>
                                <thead className="table-light">
                                    <tr>
                                        <th
                                            scope="col"
                                            onClick={() => handleSort('userName')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            HR Name
                                            <span>
                                                <span
                                                    style={{
                                                        color: sortedColumn === 'userName' && sortOrder === 'asc' ? 'black' : 'gray',
                                                    }}
                                                >
                                                    ↑
                                                </span>
                                                <span
                                                    style={{
                                                        color: sortedColumn === 'userName' && sortOrder === 'desc' ? 'black' : 'gray',
                                                    }}
                                                >
                                                    ↓
                                                </span>
                                            </span>
                                        </th>
                                        <th
                                            scope="col"
                                            onClick={() => handleSort('userEmail')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Email
                                            <span>
                                                <span
                                                    style={{
                                                        color: sortedColumn === 'userEmail' && sortOrder === 'asc' ? 'black' : 'gray',
                                                    }}
                                                >
                                                    ↑
                                                </span>
                                                <span
                                                    style={{
                                                        color: sortedColumn === 'userEmail' && sortOrder === 'desc' ? 'black' : 'gray',
                                                    }}
                                                >
                                                    ↓
                                                </span>
                                            </span>
                                        </th>
                                        <th scope="col">Company Name</th>
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
            <Footer />

        </DashboardLayout>
    );
}
export default People;






