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

const DreamApplication = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;
  const currentDreamAppPage = location.state?.currentDreamAppPage || 0;
  const currentDreamAppPageSize = location.state?.currentDreamAppPageSize || 5;
  const dreamAppStatus = location.state?.dreamAppStatus || 'all';
  const dreamAppFromDate = location.state?.dreamAppFromDate || '';
  const dreamAppToDate = location.state?.dreamAppToDate || '';
  const dreamAppSearch = location.state?.dreamAppSearch || '';

  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState(dreamAppStatus);
  const [resumeTypes, setResumeTypes] = useState({});
  const [fileNames, setfileNames] = useState({});
  const [fromDate, setFromDate] = useState(dreamAppFromDate);
  const [toDate, setToDate] = useState(dreamAppToDate);
  const [page, setPage] = useState(currentDreamAppPage);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(currentDreamAppPageSize);
  const [search, setSearch] = useState(dreamAppSearch);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [isLoading, setIsLoading] = useState(true);
  const [isGetUserData, setGetUserData] = useState(true);
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setPage(selectedPage);

  };
  console.log("search  -----> " + search)
  const fetchResumeTypes = async (applications) => {
    setIsLoading(true);
    const types = {};
    const fileNames = {};
    for (const application of applications) {
      try {
        // setLoading(true); // Start loading
        const response = await axios.get(`${BASE_API_URL}/getResumeByApplicationId?resumeId=${application.resumeId}`);
        types[application.resumeId] = response.data.fileType;
        fileNames[application.resumeId] = response.data.fileName;
      } catch (error) {
        console.error('Error fetching resume type:', error);
      } finally {
        setLoading(false); // Start loading
      }
    }
    setResumeTypes(types);
    setfileNames(fileNames);
    setIsLoading(false);
  };

  const renderResumeComponent = (resumeId) => {
    const fileType = resumeTypes[resumeId];
    const fileName = fileNames[resumeId];
    if (fileType === 'file') {
      return (
        <Button onClick={() => handleDownload(resumeId, fileName)}>Download</Button>

      );
    } else if (fileType === 'link') {
      return (
        <a href={fileName} target="_blank" rel="noopener noreferrer">Click here</a>
      );
    } else if (fileType === 'brief') {
      return (
        <Button onClick={() => openPopup(fileName)}>Open Brief</Button>
      );
    } else {
      return null; // Handle other file types as needed
    }
  };
  const state1 = location.state || {};
  console.log(state1)
  console.log("current page from Application details", currentDreamAppPage)
  useEffect(() => {
    if (location.state?.currentDreamAppPage === undefined && location.state?.currentDreamAppPageSize) {
      setPage(0);
      setPageSize(5);
    }
  }, [location.state?.currentDreamAppPage, location.state?.currentDreamAppPageSize]);

  const [showMessage, setShowMessage] = useState(false);
  const [showBriefSettings, setShowBriefSettings] = useState(false);
  const openPopup = (fileName) => {
    setShowMessage(fileName);
    setShowBriefSettings(!showBriefSettings);
  };

  const handleFilterChange = async (e) => {
    setFilterStatus(e.target.value);
    handleSelect(e.target.value);

  };

  useEffect(() => {
    if (!search && filterStatus === 'all' && !(fromDate && toDate)) {
      fetchApplications();
    } else if (filterStatus || (fromDate && toDate)) {
      handleSelect(filterStatus, fromDate, toDate);
    } else if (search) {
      fetchApplicationBysearch(search);
    }
  }, [userEmail, page, pageSize, search, filterStatus, fromDate, toDate]);

  const handleSelect = async (filterStatus, fromDate, toDate) => {
    try {
      setLoading(true); // Start loading
      const jobId = 0;
      const params = {
        jobId: jobId,
        filterStatus: filterStatus,
        userEmail: userEmail,
        page: page,
        size: pageSize
      };
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }
      if (search) {
        params.search = search;
      }
      const endpoint = fromDate && toDate
        ? `${BASE_API_URL}/getFilterDreamApplicationsWithDateByCompany`
        : `${BASE_API_URL}/getFilterDreamApplicationsByCompany`;

      const response = await axios.get(endpoint, { params });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true); // Start loading
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
      };

      const response = await axios.get(`${BASE_API_URL}/getDreamApplicationsByCompany`, { params });
      console.log(response.data);
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchApplicationBysearch = async (search) => {
    try {
      // setLoading(true); // Start loading
      const params = {
        userEmail: userEmail,
        page,
        size: pageSize,
        search: search,
      };
      const response = await axios.get(`${BASE_API_URL}/getDreamApplicationsByCompanyBySkills`, { params });
      console.log(response.data);
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  const updateStatus = async (applicationId, newStatus, hrId) => {
    console.log(applicationId);
    console.log(newStatus);
    try {
      const response = await axios.put(`${BASE_API_URL}/updateApplicationStatus?applicationId=${applicationId}&newStatus=${newStatus}&hrEmail=${userEmail}`);
      console.log(response.data);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFromDateChange = (date) => {
    setFromDate(date);
    handleSelect(filterStatus, date, toDate);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    handleSelect(filterStatus, fromDate, date);
  };

  const [candidateName, setCandidateName] = useState();
  const [candidateEmail, setCandidateEmail] = useState();
  const [hrName, setHrName] = useState();
  const [hrEmail, setHrEmail] = useState();
  const fetchCandidateDetails = async () => {
    setGetUserData(true);
    const candidateNames = {};
    const candidateEmails = {};
    const hrNames = {};
    const hrEmails = {};
    try {
      // setLoading(true); // Start loading
      for (const application of applications) {
        const res = await axios.get(`${BASE_API_URL}/getUserName`, {
          params: {
            userId: application.candidateId
          }


        });
        candidateNames[application.candidateId] = res.data.userName;
        candidateEmails[application.candidateId] = res.data.userEmail;


        const response = await axios.get(`${BASE_API_URL}/getUserName`, {
          params: {
            userId: application.hrId
          }
        });
        hrNames[application.hrId] = response.data.userName;
        hrEmails[application.hrId] = response.data.userEmail;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }


    setCandidateName(candidateNames);
    setCandidateEmail(candidateEmails);
    setHrName(hrNames);
    setHrEmail(hrEmails);
    setGetUserData(false);
  }
  useEffect(() => {
    fetchCandidateDetails();
    fetchResumeTypes(applications);
  }, [applications]);
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

  const fetchCountUnreadMessage = async (applicationId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/fetchCountUnreadMessageForHRByApplicationId?applicationId=${applicationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }


  const handleDownload = async (resumeId, fileName) => {
    try {
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
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const user = {
    userName: userName,
    userEmail: userEmail,
  };
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };


  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  const navigate = useNavigate();
  const handleClick = async (candidateId) => {
    navigate('/hr-dashboard/dream-applications/viewCandidateDetails', {
      state: {
        candidateId: candidateId,
        userName: userName,
        userEmail: userEmail,
        currentDreamAppPage: page,
        currentDreamAppPageSize: pageSize,
        dreamAppStatus: filterStatus,
        dreamAppFromDate: fromDate,
        dreamAppToDate: toDate,
        dreamAppSearch: search
      },
    });
  };

  console.log(filterStatus)

  // State to track if the ChatComponent is open
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatData, setChatData] = useState({
    applicationId: null,
    candidateId: null,
    hrId: null,
  });

  // Function to handle chat icon click
  const toggleChat = (application) => {
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
    setIsChatOpen(!isChatOpen);
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <DashboardLayout>
      <div className="main-content" >
        <Row className="mb-4 m-3">
          {/* Filter by Status */}
          <Col xs={12} md={6} lg={4}>
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
              className="form-select form-select-sm fs-5"
              style={{ borderColor: '#6c5b7b' }} // Purple border color
            >
              <option value="all">All</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Not Seen">Not Seen</option>
              <option value="Not Shortlisted">Not Shortlisted</option>
            </select>
          </Col>

          {/* Filter by Date */}
          <Col xs={12} md={6} lg={4}>
            <label
              htmlFor="date"
              className="form-label"
              style={{ color: '#6c5b7b' }} // Purple color for the label
            >
              Filter by Date:
            </label>
            <div className="date-filter d-flex flex-column flex-md-row gap-3">
              <div className="date-input-group d-flex flex-row gap-2">
                <div className="d-flex flex-column flex-md-row">
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
                      borderColor: '#6c5b7b',
                      boxShadow: 'none',
                      width: '100%', // Full width on mobile
                    }}
                  />
                </div>
                <div className="d-flex flex-column flex-md-row">
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
                      borderColor: '#6c5b7b',
                      boxShadow: 'none',
                      width: '100%', // Full width on mobile
                    }}
                  />
                </div>
              </div>
            </div>
          </Col>

          {/* Action Section */}
          <Col xs={12} md={12} lg={4}>
            <div style={{ width: '100%', backgroundColor: '#f4f4f9', padding: '15px' }}>
              <h4>Action:</h4>
              <p><b><span className="circle gray"></span> By default - Not Seen</b></p>
              <p><b><span className="circle red"></span> Slide Left Side - Not Shortlisted</b></p>
              <p><b><span className="circle green"></span> Slide Right Side - Shortlisted</b></p>
            </div>
          </Col>
        </Row>



        <Row className="mb-4 m-3">
          {/* Header Section */}
          <Col xs={12} md={6}>
            <h2 style={{ textAlign: 'center' }}>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-bubble spinner-bubble-primary m-5" />
                </div>
              ) : applications.length === 0 ? (
                <div style={{ color: 'red', textAlign: 'center' }}>
                  {search
                    ? `There is no Dream job application for "${search}"`
                    : 'Sorry, you haven’t received any applications yet.'}
                </div>
              ) : (
                <div className="left-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Applicants of Dream Company Applications
                </div>
              )}
            </h2>
          </Col>

          {/* Search Bar Section */}
          <Col xs={12} md={6} className="d-flex justify-content-center">
            <div className="search-bar" style={{ width: '100%', maxWidth: '400px' }}>
              <input
                style={{
                  borderRadius: '6px',
                  height: '35px',
                  width: '100%', // Full width on mobile
                  padding: '0 15px', // Added padding for better input space
                  fontSize: '1rem', // Increased font size for better readability
                }}
                type="text"
                name="search"
                placeholder="Search Candidate By Skills"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </Col>
        </Row>




        {!loading && applications.length > 0 && (
          <div>
            <div className='table-details-list  table-wrapper '>
              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr style={{ textAlign: 'center' }}>
                    <th>Candidate Name</th>
                    <th>Candidate Email</th>
                    <th>Resume ID</th>
                    <th>Date</th>
                    <th>Action</th>
                    <th scope="col">Chat</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map(application => (
                    <tr key={application.id}>
                      <td> {isGetUserData ? 'Loading...' : candidateName[application.candidateId]}</td>
                      <td
                        onClick={() => handleClick(application.candidateId)}
                        style={{
                          color: 'purple',              // Dark grey text color
                          padding: '10px',            // Adding some padding
                          borderRadius: '5px',        // Rounded corners
                          cursor: 'pointer',           // Changing cursor to pointer on hover
                          textDecoration: 'underline'
                        }}
                      >
                        {isGetUserData ? 'Loading...' : candidateEmail[application.candidateId]}
                      </td>

                      <td>
                        {isLoading ? 'Loading...' : renderResumeComponent(application.resumeId)}
                      </td>
                      <td>{application.appliedOn}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        {application.applicationStatus === "Shortlisted" && hrEmail[application.hrId] !== userEmail ? (
                          <div>
                            Shortlisted by {hrName[application.hrId] || 'Unknown HR'} of {application.companyName}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Slider
                              initialStatus={application.applicationStatus}
                              onChangeStatus={(newStatus) => updateStatus(application.applicationId, newStatus, application.hrId)}
                            />
                          </div>
                        )}
                      </td>
                      <td >
                        {hrEmail[application.hrId] === userEmail ? (
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
                            <SiImessage
                              size={25}
                              onClick={() => toggleChat(application)}
                              style={{ color: 'green', cursor: 'pointer' }}
                            />
                          </div>
                        ) : (
                          <SiImessage
                            size={25}
                            style={{ color: 'grey', cursor: 'not-allowed' }}
                          />
                        )
                        }
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
          </div>
        )}
        {/* Conditionally render the ChatComponent */}
        {
          isChatOpen && (
            <ChatComponent
              applicationId={chatData.applicationId}
              candidateId={chatData.candidateId}
              hrId={chatData.hrId}
              userType='HR'
              setIsChatOpen={setIsChatOpen}
            />
          )
        }

        {showBriefSettings && (
          <Modal show={showBriefSettings} onHide={() => setShowBriefSettings(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Brief Resume</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflowY: 'auto' }}>{showMessage}</Modal.Body>
          </Modal>
        )}
        <Button variant='primary' onClick={handleBack} style={{ width: '100px', marginLeft: '12px' }}>Back</Button>

      </div>
      <Footer />

    </DashboardLayout >
  );
};
export default DreamApplication;