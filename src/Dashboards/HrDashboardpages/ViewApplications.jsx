import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { SiImessage } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../pages/Footer";
import Pagination from "../../Pagination";
import ChatComponent from "../ChatComponent";
import DashboardLayout from "./DashboardLayout ";
import Slider from "./Slider";

const ViewApplications = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const { userEmail, userName, jobId, currentJobApplicationPage, currentJobApplicationPageSize } = location.state || {};
  const [applications, setApplications] = useState([]);
  const [resumeTypes, setResumeTypes] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [fileNames, setfileNames] = useState({});
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const [loading, setLoading] = useState(true);
  const currentApplicationPage = location.state?.currentApplicationPage || 0;
  const [page, setPage] = useState(currentApplicationPage);
  const currentApplicationPageSize = location.state?.currentApplicationPageSize || 6;
  const [pageSize, setPageSize] = useState(currentApplicationPageSize);
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;

  useEffect(() => {
    fetchApplications();

  }, [jobId, page, pageSize, sortedColumn, sortOrder]);

  useEffect(() => {

    const storedPage = localStorage.getItem('currentViewPage');
    if (storedPage !== null) {
      const parsedPage = Number(storedPage);
      if (parsedPage < totalPages) {
        setPage(parsedPage);

        console.log(page);
        console.log(parsedPage)
      }
    }


  }, [totalPages]);


  const state1 = location.state || {};
  console.log(state1)
  console.log("current page from Application details", currentApplicationPage)

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };

  const handleFilterChange = async (e) => {
    setFilterStatus(e.target.value);
    handleSelect(e.target.value);
  };
  useEffect(() => {
    if (location.state?.currentApplicationPage === undefined && location.state?.currentApplicationPageSize) {
      setPage(0);
      setPageSize(6);
    }
  }, [location.state?.currentApplicationPage, location.state?.currentApplicationPageSize]);

  const handleSelect = async (filterStatus, fromDate, toDate) => {
    setLoading(true);
    try {
      const params = {
        jobId: jobId,
        filterStatus: filterStatus,
        page: page,
        size: pageSize
      }
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }
      const endpoint = fromDate && toDate
        ? `${BASE_API_URL}/getFilterApplicationsWithDateByJobIdWithpagination`
        : `${BASE_API_URL}/getFilterApplicationsByJobIdWithpagination`;

      const response = await axios.get(endpoint, { params });
      console.log(response.data);

      setApplications(response.data.content || []);
      fetchResumeTypes(response.data.content || []);
      fetchCandidateDetails(response.data.content || []);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePageClick = (data) => {
    const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1)); // Ensure selectedPage is within range
    setPage(selectedPage);
    localStorage.setItem('currentViewPage', selectedPage);
    // Store the page number in localStorage
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        jobId: jobId,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder
      };

      const response = await axios.get(`${BASE_API_URL}/getApplicationsByJobIdWithPagination`, { params });
      setApplications(response.data.content || []);
      fetchResumeTypes(response.data.content || []);
      fetchCandidateDetails(response.data.content || []);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    handleSelect(filterStatus, date, toDate);
  };
  console.log(page)

  const handleToDateChange = (date) => {
    setToDate(date);
    handleSelect(filterStatus, fromDate, date);
  };
  useEffect(() => {
    fetchApplications();
  }, [jobId, page, pageSize, sortedColumn, sortOrder]);

  useEffect(() => {
    console.log('currentViewPage', page)
    localStorage.removeItem('currentViewPage', page);
  }, [page]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);

  };

  const updateStatus = async (applicationId, newStatus) => {
    console.log(applicationId);
    console.log(newStatus);
    try {
      await axios.put(`${BASE_API_URL}/updateApplicationStatus?applicationId=${applicationId}&newStatus=${newStatus}&hrEmail=${userEmail}`);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };
  const [unreadMessages, setUnreadMessages] = useState([]); // State to track unread messages

  useEffect(() => {
    const fetchStatuses = async () => {

      const unread = {}; // Initialize unread messages state

      for (const application of applications) {
        try {

          const countUnread = await fetchCountUnreadMessage(application.applicationId);

          unread[application.applicationId] = countUnread;

        } catch (error) {
          console.error('Error fetching job status:', error);
        }
      }
      setUnreadMessages(unread); // Set unread messages state
    };
    fetchStatuses();
  }, [applications]);

  const fetchResumeTypes = async (applications) => {
    const types = {};
    const fileNames = {};
    for (const application of applications) {
      try {
        const response = await axios.get(`${BASE_API_URL}/getResumeByApplicationId?resumeId=${application.resumeId}`);
        types[application.resumeId] = response.data.fileType;
        fileNames[application.resumeId] = response.data.fileName;

        ///console.log(`Resume ID: ${application.resumeId}, File Type: ${response.data.fileType}, File Name: ${response.data.fileName}`);
      } catch (error) {
        console.error('Error fetching resume type:', error);
      }
    }

    setResumeTypes(types);
    setfileNames(fileNames);

  };

  const fetchCountUnreadMessage = async (applicationId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/fetchCountUnreadMessageForHRByApplicationId?applicationId=${applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }
  const renderResumeComponent = (resumeId) => {
    const fileType = resumeTypes[resumeId];
    const fileName = fileNames[resumeId];
    if (fileType === 'file') {
      return (
        <Button className="btn-sm" variant="primary" onClick={() => handleDownload(resumeId, fileName)}>Download</Button>
      );
    } else if (fileType === 'link') {
      return (
        <a href={fileName} target="_blank" rel="noopener noreferrer" onClick={() => updateViewCount(resumeId, "link")}>Click here</a>
      );
    } else if (fileType === 'brief') {
      return (
        <Button className="btn-sm" variant="primary" onClick={() => {
          updateViewCount(resumeId, "brief");
          openPopup(fileName);
        }}>Open Brief</Button>
      );
    } else {
      return null; // Handle other file types as needed
    }
  };


  const updateViewCount = async (resumeId, action) => {
    console.log(resumeId, action);
    try {
      await axios.post(`${BASE_API_URL}/resume-increment-view`, null, {
        params: {
          resumeId: resumeId,
          action: action,
        },
      });
    } catch (error) {
      console.error('Error updating resume view count:', error);
    }
  };


  const [showMessage, setShowMessage] = useState(false);
  const [showBriefSettings, setShowBriefSettings] = useState(false);
  const openPopup = (fileName) => {
    setShowMessage(fileName);
    setShowBriefSettings(!showBriefSettings);
  };

  const handleDownload = async (resumeId, fileName) => {
    const action = "download"
    console.log(resumeId, action)
    try {
      // Increment view count
      await axios.post(`${BASE_API_URL}/resume-increment-view`, null, {
        params: {
          resumeId: resumeId,
          action: action, // Action type
        },
      });

      const response = await axios.get(`${BASE_API_URL}/downloadResume?resumeId=${resumeId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const [candidateName, setCandidateName] = useState({});
  const [candidateEmail, setCandidateEmail] = useState({});

  const fetchCandidateDetails = async (applications) => {
    const candidateNames = {};
    const candidateEmails = {};
    for (const application of applications) {
      try {
        const res = await axios.get(`${BASE_API_URL}/getUserName`, {
          params: { userId: application.candidateId }
        });
        candidateNames[application.candidateId] = res.data.userName;
        candidateEmails[application.candidateId] = res.data.userEmail;
      } catch (error) {
        console.error('Error fetching candidate details:', error);
      }
    }
    setCandidateName(candidateNames);
    setCandidateEmail(candidateEmails);
  }

  const navigate = useNavigate();

  const handleBack = () => {
    const state1 = location.state || {};
    console.log(state1)

    navigate('/hr-dashboard/hr-applications', { state: { userEmail, userName, jobId, currentJobApplicationPage, currentJobApplicationPageSize } })
    console.log("sending current page", currentJobApplicationPage)

  };




  // State to track if the ChatComponent is open
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [chatData, setChatData] = useState({
    applicationId: null,
    candidateId: null,
    hrId: null,
  });

  // Function to handle chat icon click
  const toggleChat = (application) => {
    // Set the chat data for the clicked application
    // Mark messages as read
    axios.put(`${BASE_API_URL}/markCandidateMessagesAsRead?applicationId=${application.applicationId}`);
    const unread = {}; // Initialize unread messages state
    try {

      const countUnread = fetchCountUnreadMessage(application.applicationId);

      unread[application.applicationId] = countUnread;

    } catch (error) {
      console.error('Error fetching job status:', error);
    }

    setUnreadMessages(unread); // Set unread messages state
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
        <Row >
          <Col>
            <label
              htmlFor="status"
              className="form-label"
              style={{ color: '#6c5b7b' }} // Purple color for the label
            >
              Filter by Status:
            </label>
            <select
              id="status"
              onChange={handleFilterChange}
              value={filterStatus}
              className="form-select form-select-sm fs-5" // Adjust the fs-* class as needed
              style={{ borderColor: '#6c5b7b' }} // Purple border color
            >
              <option value="all">All</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Not Seen">Not Seen</option>
              <option value="Not Shortlisted">Not Shortlisted</option>
            </select>
          </Col>
          <Col>
            <label
              htmlFor="date"
              className="form-label"
              style={{ color: '#6c5b7b' }} // Purple color for the label
            >
              Filter by Date:
            </label>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex flex-row ">
                <label
                  htmlFor="fromDate"
                  className="form-label mb-1"
                  style={{ color: '#6c5b7b' }} // Purple color for the label
                >
                  From:
                </label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  className="form-control form-control-sm fs-7"
                  style={{
                    maxWidth: '150px',
                    borderColor: '#6c5b7b', // Purple border color
                    boxShadow: 'none'
                  }}
                />
              </div>
              <div className="d-flex flex-row ">
                <label
                  htmlFor="toDate"
                  className="form-label mb-1"
                  style={{ color: '#6c5b7b' }} // Purple color for the label
                >
                  To:
                </label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  className="form-control form-control-sm fs-7"
                  style={{
                    maxWidth: '150px',
                    borderColor: '#6c5b7b', // Purple border color
                    boxShadow: 'none'
                  }}
                />
              </div>
            </div>
          </Col >
          <Col className="align-items-left">
            <h4>Action:</h4>
            <p><b><span class="circle gray"></span> By default - Not Seen</b></p>
            <p><b><span class="circle red"></span> Slide Left - Not Shortlisted</b></p>
            <p><b><span class="circle green"></span> Slide Right - Shortlisted</b></p>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <h2>
              {applications.length === 0 ? (
                <div style={{ textAlign: 'center' }}>There are no applicants for this job application</div>
              ) : (
                <div className="left-text">Applicants of applications</div>
              )}
            </h2>

          </Col>
        </Row>

        <div>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-bubble spinner-bubble-primary m-5" />
              <span>Loading...</span>
            </div>
          ) : applications.length > 0 ? (
            <>
              <div>
                <div className='table-details-list  table-wrapper '>
                  <Table hover className='text-center'>
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Job Title</th>
                        <th scope="col">Candidate Name</th>
                        <th scope="col">Candidate Email</th>
                        <th scope="col">Resume ID</th>
                        <th
                          scope="col"
                          onClick={() => handleSort('appliedOn')}
                          style={{ cursor: 'pointer' }}
                        >
                          Date{' '}
                          <span>
                            <span
                              style={{
                                color: sortedColumn === 'appliedOn' && sortOrder === 'asc' ? 'black' : 'gray',
                              }}
                            >
                              ↑
                            </span>{' '}
                            <span
                              style={{
                                color: sortedColumn === 'appliedOn' && sortOrder === 'desc' ? 'black' : 'gray',
                              }}
                            >
                              ↓
                            </span>
                          </span>
                        </th>
                        <th scope="col">View Details</th>
                        <th scope="col">Action</th>
                        <th scope="col">Chat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application) => (
                        <tr key={application.applicationId}>
                          <td>{application.jobRole}</td>
                          <td>{candidateName[application.candidateId]}</td>
                          <td>{candidateEmail[application.candidateId]}</td>
                          <td>{renderResumeComponent(application.resumeId)}</td>
                          <td>{application.appliedOn}</td>
                          <td>
                            <FontAwesomeIcon onClick={(e) => {
                              e.preventDefault();
                              navigate('/hr-dashboard/hr-applications/view-applications/applicationDetails', {
                                state: { userEmail, applicationId: application.applicationId, candidateId: application.candidateId, userName, currentApplicationPage: page, jobId, currentApplicationPageSize: pageSize },
                              });
                            }}
                              icon={faEye}
                              style={{ cursor: 'pointer', fontSize: '20px', color: 'black' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Slider
                                initialStatus={application.applicationStatus}
                                onChangeStatus={(newStatus) => updateStatus(application.applicationId, newStatus)}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              {unreadMessages[application.applicationId] > 0 && (
                                <span
                                  style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-15px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    zIndex: 1, // Ensure notification badge is above SiImessage icon
                                  }}
                                >
                                  {unreadMessages[application.applicationId]}
                                </span>
                              )}

                              {/* Chat icon, click to toggle the ChatComponent */}
                              <SiImessage
                                size={25}
                                onClick={() => toggleChat(application)}
                                style={{ color: 'green', cursor: 'pointer' }}
                              />

                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </Table>

                </div>
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
            </>
          ) : (
            <section className="no-jobs-message">

            </section>
          )}
          <Button variant='primary' onClick={handleBack}>Back</Button>
        </div>

        {showBriefSettings && (
          <Modal show={showBriefSettings} onHide={() => setShowBriefSettings(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Brief Resume</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflowY: 'auto' }}>{showMessage}</Modal.Body>
          </Modal>
        )}


        {/* Conditionally render the ChatComponent */}
        {isChatOpen && (
          <ChatComponent
            applicationId={chatData.applicationId}
            candidateId={chatData.candidateId}
            hrId={chatData.hrId}
            userType='HR'
            setIsChatOpen={setIsChatOpen}
          />
        )}
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default ViewApplications;

