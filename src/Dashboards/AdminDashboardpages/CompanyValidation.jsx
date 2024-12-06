import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import swal from 'sweetalert2';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import Pagination from '../../Pagination';
import AdminleftSide from './AdminleftSide';

const BASE_API_URL = process.env.REACT_APP_API_URL;

const CompanyValidation = () => {
  const [companyData, setCompanyData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);
  const [showInputIndex, setShowInputIndex] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [companyName, setCompanyName] = useState('');

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const fetchCompanyData = async () => {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/displayCompanies`, { params });
      setCompanyData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [page, pageSize, sortedColumn, sortOrder]);

  const toggleLeftSide = () => {
    setIsLeftSideVisible(!isLeftSideVisible);
  };

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0);
  };

  const approveCompany = async (companyId, companyName) => {
    const appliedOn = new Date();
    const formattedDate = `${appliedOn.getFullYear()}-${String(appliedOn.getMonth() + 1).padStart(2, '0')}-${String(appliedOn.getDate()).padStart(2, '0')}`;
    try {
      const approved = "Approved";
      const res = await axios.put(`${BASE_API_URL}/updateApproveCompany`, null, {
        params: {
          companyName,
          actionDate: formattedDate,
          companyStatus: approved,
        },
      });
      if (res.data) {
        swal.fire({
          icon: "success",
          title: "Approval Successful!",
          text: "The request has been approved.",
        });
        fetchCompanyData();
      } else {
        throw new Error('Approval failed');
      }
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: "Failed to approve the request. Please try again later.",
      });
    }
  };

  const rejectCompany = async (companyId, companyName) => {
    const appliedOn = new Date();
    const formattedDate = `${appliedOn.getFullYear()}-${String(appliedOn.getMonth() + 1).padStart(2, '0')}-${String(appliedOn.getDate()).padStart(2, '0')}`;
    try {
      const reject = "Rejected";
      const res = await axios.put(`${BASE_API_URL}/updateApproveCompany`, null, {
        params: {
          companyName,
          actionDate: formattedDate,
          companyStatus: reject,
        },
      });
      if (res.data) {
        swal.fire({
          icon: "success",
          title: "Rejection Successful!",
          text: "The request has been rejected.",
        });
        fetchCompanyData();
      } else {
        throw new Error('Rejection failed');
      }
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: "Failed to reject the request. Please try again later.",
      });
    }
  };

  const handleMergeClick = (index) => {
    setShowInputIndex(showInputIndex === index ? null : index);
  };

  const handleInputChange = (index, value) => {
    setInputValues({ ...inputValues, [index]: value });
  };

  const handleCompanySearch = async (index, value) => {
    setInputValues({ ...inputValues, [index]: value });

    if (value.trim() === '') {
      setCompanySuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_API_URL}/searchCompanyNames?companyName=${value}`);
      setCompanySuggestions(response.data);
    } catch (error) {
      console.error('Error searching for companies:', error);
      setCompanySuggestions([]);
    }
  };

  const handleSelectCompany = (company) => {
    // Set the company name state to the selected company's name
    setCompanyName(company.companyName);

    // Clear the suggestions after selecting a company
    setCompanySuggestions([]);

    // If you are merging, update the input field with the selected company name
    setInputValues({
      ...inputValues,
      [showInputIndex]: company.companyName, // Assuming `showInputIndex` is being used to track the input field index
    });
  };


  const handleMergeCompany = async (index, companyId, inputValue) => {
    console.log(`Merging company ID: ${companyId} with new name: ${inputValue}`);
    try {
      const response = await axios.put(`${BASE_API_URL}/mergeCompany?mergeWithCompanyName=${companyName}&companyId=${companyId}`);
      // Check if the merge was successful
      if (response.data) {
        console.log('Company merged successfully:', response.data.company);
        swal.fire({
          icon: "success",
          title: "Merge Successful!",
          text: "Company Merge.",
        });
        fetchCompanyData();
      } else {
        console.error('Failed to merge company:', response.data.message);
      }
      setShowInputIndex(null);
    } catch (error) {
      // Handle errors
      console.error('Error during merging company:', error);
    }

  };

  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;

  return (
    <div className='dashboard-container'>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
        <AdminleftSide onClose={toggleLeftSide} />
      </div>

      <div className="right-side">
        <div
          style={{
            overflowY: 'auto',
            maxHeight: isSmallScreen ? '600px' : '1000px',
            paddingBottom: '20px',
          }}
        >
          {companyData.length > 0 ? (
            <>
              <h2 style={{ textAlign: 'center' }}>Details of Company Validation</h2>
              <div className='table-details-list table-wrapper'>
                <Table hover className='text-center'>
                  <thead className="table-light">
                    <tr>
                      <th onClick={() => handleSort('companyName')}>
                        Company Name {sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th>Actions</th>
                      <th>Merge with</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyData.map((company, index) => (
                      <tr key={company.companyId}>
                        <td>{company.companyName}</td>
                        <td>
                          <span className="icon-button select" onClick={() => approveCompany(company.companyId, company.companyName)}>
                            <BsCheckCircle />
                          </span>
                          <span className="icon-button reject" onClick={() => rejectCompany(company.companyId, company.companyName)}>
                            <BsXCircle />
                          </span>
                        </td>
                        <td>
                          {showInputIndex !== index ? (
                            <Button onClick={() => handleMergeClick(index)} className="btn-sm btn-primary">
                              Merge
                            </Button>
                          ) : (
                            <>
                              <div className="d-flex align-items-center">
                                <input
                                  type="text"
                                  value={inputValues[index] || ''}
                                  onChange={(e) => handleCompanySearch(index, e.target.value)}
                                  placeholder="Enter name"
                                  className="form-control form-control-sm me-2" // Adding margin-right for spacing between input and button
                                  style={{ width: '150px', height: '30px' }}
                                />
                                <Button
                                  onClick={() => handleMergeCompany(index, company.companyId, inputValues[index])}
                                  className="btn-sm btn-primary"
                                >
                                  Merge
                                </Button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>


              </div>
            </>
          ) : (
            <h4 className='text-center'>Loading...</h4>
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

        {/* Display company suggestions */}
        {companySuggestions.length > 0 && (
          <div className="suggestions-list">
            {companySuggestions.map((company) => (
              <div
                key={company.id}
                className="suggestion-item"
                onClick={() => handleSelectCompany(company)}
              >
                {company.companyName}
              </div>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default CompanyValidation;
