import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button, Dropdown, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import Pagination from '../../Pagination';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import DashboardLayout from './DashboardLayout';

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
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)

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
  }, [search, page, pageSize, sortOrder, sortedColumn]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };
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
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
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







  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;



 
 

  return (
    <DashboardLayout>
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
      </div>
      <div className="main-content">
        {companies.length > 0 ? (
          <div className='table-details-list table-wrapper'>
            <h2> Companies For {userName}</h2>
            <p>
              Similar to tables and dark tables, use the modifier classes
              <code>.table-light</code> to make <code>thead</code> appear light
            </p>
            <Table hover className='text-center'>
              <thead className="table-light">
                <tr>
                  <th scope="col" onClick={() => handleSort('companyName')}>Company Name {sortedColumn === 'companyName' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}</th>
                  <th scope="col" onClick={() => handleSort('industryService')}>Industry {sortedColumn === 'industryService' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}</th>
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
    </DashboardLayout>
  );
};


export default CandidatesCompanies;
