import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { MdDelete } from 'react-icons/md';
import { SiImessage } from 'react-icons/si';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Pagination from '../../Pagination';
import ChatComponent from '../ChatComponent';
import './CandidateDashboard.css';
import DashboardLayout from './DashboardLayout';

const MyApplication = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [applicationStatus, setApplicationStatus] = useState(location.state?.applicationStatus);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // Filter state
  const [resumeNames, setResumeNames] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumeNames();
  }, [applications]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setApplicationStatus('');
    setPage(0);
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0); // Reset to the first page
  };
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)

  useEffect(() => {
    if (search) {
      fetchApplicationBySearch(search);
    } else if (applicationStatus) {
      fetchApplicationBySearch(applicationStatus);
    } else {
      fetchApplications();
    }
  }, [applicationStatus, page, pageSize, search, sortOrder, sortedColumn, userId, filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {
        userId: userId,
        page: page,
        pageSize: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
        filter: filter === 'All' ? undefined : filter, // Add filter to params
      };

      const response = await axios.get(`${BASE_API_URL}/applicationsPagination`, { params });

      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }

      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }

  };

  // const fetchApplicationsByStatus = async (applicationStatus) => {
  //   try {
  //     const params = {
  //       searchStatus: applicationStatus,
  //       userId: userId,
  //       page: page,
  //       pageSize: pageSize,
  //     };

  //     if (sortedColumn) {
  //       params.sortBy = sortedColumn;
  //       params.sortOrder = sortOrder;
  //     }

  //     const response = await axios.get(`${BASE_API_URL}/applicationsBySearch`, { params });
  //     setApplications(response.data.content);
  //     setTotalPages(response.data.totalPages);
  //   } catch (error) {
  //     console.error('Error fetching applications by status:', error);
  //   }
  // };

  const fetchApplicationBySearch = async (search) => {
    try {
      setLoading(true);
      const params = {
        searchStatus: search,
        userId: userId,
        page: page,
        pageSize: pageSize,
        filter: filter === 'All' ? undefined : filter, // Add filter to params
      };

      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }

      const response = await axios.get(`${BASE_API_URL}/applicationsBySearch`, { params });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications by search:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumeNames = async () => {
    const names = {};
    try {
      for (const application of applications) {
        const name = await getResumeName(application.resumeId);
        names[application.resumeId] = name;
      }
      setResumeNames(names);
    } catch (error) {
      console.error('Error fetching resume names:', error);
    }
  };

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const getResumeName = async (resumeId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getResumeMessageById?resumeId=${resumeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resume name:', error);
      return 'Unknown';
    }
  };



  const [chats, setChats] = useState([]); // Initialize chats as an empty array
  const [jobStatuses, setJobStatuses] = useState({});
  const [unreadMessages, setUnreadMessages] = useState([]); // State to track unread messages

  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = {};
      const chats = []; // Initialize chats as an array
      const unread = {}; // Initialize unread messages state

      for (const application of applications) {
        try {
          const status = await getJobStatus(application.jobId);
          const chat = await fetchChat(application.applicationId);
          const countUnread = await fetchCountUnreadMessage(application.applicationId);
          statuses[application.applicationId] = status;
          chats.push(chat); // Push chat into the array
          unread[application.applicationId] = countUnread;

        } catch (error) {
          console.error('Error fetching job status:', error);
          statuses[application.id] = 'Unknown';
        }
      }
      setJobStatuses(statuses);
      setChats(chats); // Set chats as the array of fetched chats
      setUnreadMessages(unread); // Set unread messages state
    };
    fetchStatuses();
  }, [applications]);

  const getJobStatus = async (jobId) => {
    if (jobId === 0) {
      return 'Job not available';
    } else {
      try {
        const response = await axios.get(`${BASE_API_URL}/getJob?jobId=${jobId}`);

        if (response.data.jobCategory === "evergreen") {
          return "Evergreen";
        } else {
          return response.data.jobStatus ? 'Active' : 'Not Active';
        }
      } catch (error) {
        console.error("Error fetching job status:", error);
        throw error;
      }
    }
  };

  const renderJobStatus = (applicationId) => {
    return jobStatuses[applicationId] || 'Loading...';
  };


  const fetchCountUnreadMessage = async (applicationId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/fetchCountUnreadMessageForCandidateByApplicationId?applicationId=${applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }

  const fetchChat = async (applicationId) => {

    try {
      const response = await axios.get(`${BASE_API_URL}/fetchChatByApplicationId?applicationId=${applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };



  const handleDelete = async (applicationId) => {

    try {
      const confirmDelete = await axios.delete(`${BASE_API_URL}/deleteApplicationByApplicationId?applicationId=${applicationId}`);
      if (confirmDelete.data) {
        fetchApplications();
      }
    } catch {
      console.log("Unable to delete appliction")
    } // Show a confirmation dialog before deletion

  };


  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;


  // State to track if the ChatComponent is open
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [chatData, setChatData] = useState({
    applicationId: null,
    candidateId: null,
    hrId: null,
  });

  // Function to handle chat icon click
  const toggleChat = (application) => {
    // Mark messages as read
    axios.put(`${BASE_API_URL}/markHRMessagesAsRead?applicationId=${application.applicationId}`);

    const unread = {}; // Initialize unread messages state
    try {

      const countUnread = fetchCountUnreadMessage(application.applicationId);

      unread[application.applicationId] = countUnread;

    } catch (error) {
      console.error('Error fetching job status:', error);
    }
    setUnreadMessages(unread); // Set unread messages state

    // Set the chat data for the clicked application
    setChatData({
      applicationId: application.applicationId,
      candidateId: application.candidateId,
      hrId: application.hrId,
    });
    // Toggle the visibility of the ChatComponent
    setIsChatOpen(!isChatOpen);
  };

  return (
    <DashboardLayout>
      <div className="main-content">
        <Row>
          <Col md={4} style={{ paddingTop: '10px' }}>
            <label htmlFor="status" className="form-label"
              style={{ color: '#6c5b7b' }}>Filter by Actions:</label>
            <select id="status" className="form-select form-select-sm fs-6" // Adjust the fs-* class as needed
              style={{ borderColor: '#6c5b7b' }} onChange={handleFilterChange} value={filter}>
              <option value="all">All</option>
              <option value="Regular Jobs">Regular Jobs</option>
              <option value="Dream Applications">Dream Application</option>
              <option value="EverGreen Jobs">EverGreen Jobs</option>
            </select>
          </Col>
          <Col md={3} className="d-flex align-items-left" style={{ paddingTop: '30px' }}>
            {/* Search Bar */}
            <div className="search-bar" style={{ flex: 1 }}>
              <input
                style={{ borderRadius: '6px', height: '40px', width: '100%' }}
                type="text"
                name="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </Col>

        </Row>
        <Col md={4}>
          <h2 className='text-start'> My Applications</h2>
        </Col>

        <div>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-bubble spinner-bubble-primary m-5" />
              <span>Loading...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center">
              <span>No applications yet</span>
            </div>
          ) : (
            <>
              <div className="table-details-list table-wrapper">
                <Table hover className="text-center">
                  <thead className="table-light">
                    <tr>
                      <th
                        scope="col"
                        onClick={() => handleSort("companyName")}
                        style={{ cursor: "pointer" }}
                      >
                        Company Name{" "}
                        <span>
                          <span
                            style={{
                              color:
                                sortedColumn === "companyName" && sortOrder === "asc"
                                  ? "black"
                                  : "gray",
                            }}
                          >
                            ↑
                          </span>{" "}
                          <span
                            style={{
                              color:
                                sortedColumn === "companyName" && sortOrder === "desc"
                                  ? "black"
                                  : "gray",
                            }}
                          >
                            ↓
                          </span>
                        </span>
                      </th>
                      <th
                        scope="col"
                        onClick={() => handleSort("jobRole")}
                        style={{ cursor: "pointer" }}
                      >
                        Job Title{" "}
                        <span>
                          <span
                            style={{
                              color:
                                sortedColumn === "jobRole" && sortOrder === "asc"
                                  ? "black"
                                  : "gray",
                            }}
                          >
                            ↑
                          </span>{" "}
                          <span
                            style={{
                              color:
                                sortedColumn === "jobRole" && sortOrder === "desc"
                                  ? "black"
                                  : "gray",
                            }}
                          >
                            ↓
                          </span>
                        </span>
                      </th>
                      <th
                        scope="col"
                        onClick={() => handleSort("appliedOn")}
                        style={{ cursor: "pointer" }}
                      >
                        Applied On{" "}
                        <span>
                          <span
                            style={{
                              color:
                                sortedColumn === "appliedOn" && sortOrder === "asc"
                                  ? "black"
                                  : "gray",
                            }}
                          >
                            ↑
                          </span>{" "}
                          <span
                            style={{
                              color:
                                sortedColumn === "appliedOn" && sortOrder === "desc"
                                  ? "black"
                                  : "gray",
                            }}
                          >
                            ↓
                          </span>
                        </span>
                      </th>
                      <th scope="col">Resume Profile</th>
                      <th scope="col">Job Status</th>
                      <th
                        scope="col"
                        onClick={() => handleSort("applicationStatus")}
                        style={{ cursor: "pointer" }}
                      >
                        Action{" "}
                        <span>
                          <span
                            style={{
                              color:
                                sortedColumn === "applicationStatus" && sortOrder === "asc"
                                  ? "black"
                                  : "gray",
                            }}
                          >
                            ↑
                          </span>{" "}
                          <span
                            style={{
                              color:
                                sortedColumn === "applicationStatus" && sortOrder === "desc"
                                  ? "black"
                                  : "gray",
                            }}
                          >
                            ↓
                          </span>
                        </span>
                      </th>
                      <th scope="col">Chat</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map((application, index) => (
                      <tr key={index}>
                        <td>{application.companyName}</td>
                        <td>{application.jobRole || "Dream application"}</td>
                        <td>{application.appliedOn}</td>
                        <td>{resumeNames[application.resumeId]}</td>
                        <td
                          style={{
                            color:
                              renderJobStatus(application.applicationId) === "Evergreen"
                                ? "green"
                                : "black",
                          }}
                        >
                          {renderJobStatus(application.applicationId)}
                        </td>

                        <td>{application.applicationStatus}</td>

                        <td>
                          {chats[index] && chats[index].length > 0 ? (
                            <div style={{ position: "relative", display: "inline-block" }}>
                              {unreadMessages[application.applicationId] > 0 && (
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-15px",
                                    backgroundColor: "red",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    zIndex: 1, // Ensure notification badge is above SiImessage icon
                                  }}
                                >
                                  {unreadMessages[application.applicationId]}
                                </span>
                              )}

                              <SiImessage
                                size={25}
                                onClick={() => toggleChat(application)}
                                style={{ color: "green", cursor: "pointer" }}
                              />
                            </div>
                          ) : (
                            <SiImessage
                              size={25}
                              style={{ color: "grey", cursor: "not-allowed" }}
                            />
                          )}
                        </td>
                        <td>
                          <span
                            className="delete cursor-pointer text-danger me-2"
                            onClick={() => {
                              Swal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleDelete(application.applicationId);
                                }
                              });
                            }}
                          >
                            <MdDelete className="text-danger" size={18} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

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
        </div>


        {isChatOpen && (
          <ChatComponent
            applicationId={chatData.applicationId}
            candidateId={chatData.candidateId}
            hrId={chatData.hrId}
            userType='Candidate'
            setIsChatOpen={setIsChatOpen}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplication;