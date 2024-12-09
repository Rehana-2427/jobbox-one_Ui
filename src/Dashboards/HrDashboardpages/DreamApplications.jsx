import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { SiImessage } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";
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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setPage(selectedPage);

  };
  console.log("search  -----> " + search)
  const fetchResumeTypes = async (applications) => {
    const types = {};
    const fileNames = {};
    for (const application of applications) {
      try {
        const response = await axios.get(`${BASE_API_URL}/getResumeByApplicationId?resumeId=${application.resumeId}`);
        types[application.resumeId] = response.data.fileType;
        fileNames[application.resumeId] = response.data.fileName;
      } catch (error) {
        console.error('Error fetching resume type:', error);
      }
    }
    setResumeTypes(types);
    setfileNames(fileNames);
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

  const handleSelect = async (filterStatus, fromDate, toDate) => {
    try {
      const jobId = 0;
      const params = {
        jobId: jobId,
        filterStatus: filterStatus,
        userEmail: userEmail,
        page: page,
        size: pageSize
      };
      console.log(filterStatus)
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
    }
  };

  useEffect(() => {
    if (!search && filterStatus === 'all' && !(fromDate && toDate)) {
      fetchApplications();
    }
    else if (filterStatus || (fromDate && toDate)) {
      handleSelect(filterStatus, fromDate, toDate);
    } else if (search)
      fetchApplicationBysearch(search);
  }, [userEmail, page, pageSize, search, filterStatus, fromDate, toDate]);
  const fetchApplications = async () => {
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,

      };

      const response = await axios.get(`${BASE_API_URL}/getDreamApplicationsByCompany`, { params }); console.log(response.data);
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.log(error);
    }
  };
  const fetchApplicationBysearch = async (search) => {
    try {
      const params = {
        userEmail: userEmail,
        page,
        size: pageSize,
        search: search,
      };
      const response = await axios.get(`${BASE_API_URL}/getDreamApplicationsByCompanyBySkills`, { params }); console.log(response.data);
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.log(error);
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
    const candidateNames = {};
    const candidateEmails = {};
    const hrNames = {};
    const hrEmails = {};
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
    setCandidateName(candidateNames);
    setCandidateEmail(candidateEmails);
    setHrName(hrNames);
    setHrEmail(hrEmails);
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

  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [applicationId, setApplicationId] = useState(0);
  const [chats, setChats] = useState([]);
  const [chatWith, setChatWith] = useState('');
  const handleChatClick = async (applicationId, candidate) => {
    setApplicationId(applicationId);
    setChatWith(candidate);
    // const responce= await axios.get(`${BASE_API_URL}/fetchChatByApplicationId?applicationId=${applicationId}`);
    // setChats(responce.data);
    console.log('Chat icon clicked for:');
    // Show the modal
    setShowModal(true);
    setShowChat(true);
    try {
      await axios.put(`${BASE_API_URL}/markCandidateMessagesAsRead?applicationId=${applicationId}`);
      const response = await axios.get(`${BASE_API_URL}/fetchChatByApplicationId?applicationId=${applicationId}`);
      setChats(response.data);
      console.log("Chats === > " + chats)
      console.log("Chats === > " + response.data)
      setShowModal(true); // Show the modal once chats are fetched
      setShowChat(true); // Optionally manage showChat state separately
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowChat(false); // Optionally reset showChat state
    setInputValue(''); // Reset input value when closing modal
  };

  const handleSend = async () => {
    // Handle send logic here
    try {
      await axios.put(`${BASE_API_URL}/markCandidateMessagesAsRead?applicationId=${applicationId}`);
      const response = await axios.put(`${BASE_API_URL}/saveHRChatByApplicationId?applicationId=${applicationId}&hrchat=${inputValue}`);
      console.log('Sending message:', inputValue);
      // Close the modal or perform any other actions

      setShowModal(true);
      setInputValue('');
      handleChatClick(applicationId, chatWith)
      // Reset input value after sending
    } catch {
      console.log('error')
    }

  };
  // Function to format date with only day
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { weekday: 'long' }; // Show only the full day name
    return date.toLocaleDateString('en-US', options);
  }

  // Function to format time with AM/PM
  function formatMessageDateTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  // Function to check if two dates are different days
  function isDifferentDay(date1, date2) {
    const day1 = new Date(date1).getDate();
    const day2 = new Date(date2).getDate();
    return day1 !== day2;
  }

  const modalBodyRef = useRef(null);
  useEffect(() => {
    // Scroll to bottom of modal body when chats change (new message added)
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight;
    }
  }, [chats]);
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

  return (
    <DashboardLayout>
      <div className="main-content">
        <Row className="mb-4 m-3">
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
              className="form-select form-select-sm fs-5" // Adjust the fs-* class as needed
              style={{ borderColor: '#6c5b7b' }} // Purple border color
            >
              <option value="all">All</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Not Seen">Not Seen</option>
              <option value="Not Shortlisted">Not Shortlisted</option>
            </select>
          </Col>
          <Col
            xs={12} md={6} lg={4} >
            <label
              htmlFor="date"
              className="form-label"
              style={{ color: '#6c5b7b' }} // Purple color for the label
            >
              Filter by Date:
            </label>
            <div className="date-filter d-flex align-items-center gap-3">
              <div className="date-input-group d-flex flex-row align-items-center">
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
                    boxShadow: 'none',
                  }}
                />
              </div>
              <div className="date-input-group d-flex flex-row">
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
                    boxShadow: 'none',
                  }}
                />
              </div>
            </div>
          </Col>
          <Col xs={12} md={12} lg={4}>
            <div
              style={{ width: '100%', backgroundColor: '#f4f4f9' }}>
              <h4>Action:</h4>
              <p><b><span class="circle gray"></span> By default - Not Seen</b></p>
              <p><b><span class="circle red"></span> Slide Left Side - Not Shortlisted</b></p>
              <p><b><span class="circle green"></span> Slide Right Side - Shortlisted</b></p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <h2>
              {applications.length === 0 ? (
                <div style={{ color: 'red', textAlign: 'center' }}>
                  {search
                    ? `There is no Dream job application for "${search}"`
                    : 'Sorry, you haven’t received any applications yet.'}
                </div>
              ) : (
                <div className="left-text">Applicants of Dream Company Applications</div>
              )}
            </h2>

          </Col>
          <Col md={4} className="d-flex align-items-left">
            <div className="search-bar" style={{ flex: 1 }}>
              <input
                style={{ borderRadius: '6px', height: '35px', width: '70%', marginRight: '20px' }}
                type="text"
                name="search"
                placeholder="Search Candidate By Skills"
                value={search}
                onChange={handleSearchChange}
              />
            </div>

          </Col>
        </Row>
        {showBriefSettings && (
          <Modal show={showBriefSettings} onHide={() => setShowBriefSettings(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Brief Resume</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflowY: 'auto' }}>{showMessage}</Modal.Body>
          </Modal>
        )}

        <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Chat with {chatWith}</Modal.Title>
          </Modal.Header>
          <Modal.Body ref={modalBodyRef}>
            <div className="chat-messages">
              {chats ? (
                chats.map((chat, index) => (
                  <div key={chat.id} className="chat-message">
                    {index === 0 || isDifferentDay(chats[index - 1].createdAt, chat.createdAt) && (
                      <div className="d-flex justify-content-center align-items-center text-center font-weight-bold my-3">
                        {formatDate(chat.createdAt)}
                      </div>

                    )}
                    {chat.candidateMessage && (
                      <div className="message-right">
                        {chat.candidateMessage}
                        <div className="message-time">
                          {formatMessageDateTime(chat.createdAt)}
                        </div>
                      </div>
                    )}

                    {/* Render HR message if present */}
                    {chat.hrMessage && (
                      <div className="message-left">
                        {chat.hrMessage}
                        <div className="message-time">
                          {formatMessageDateTime(chat.createdAt)}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
            {/* Message input section */}

          </Modal.Body>
          <Modal.Footer>
            <Form.Group controlId="messageInput" className="mb-3">
              {/* <Form.Label>Message:</Form.Label> */}
              <Form.Control
                as='textarea'
                type="text"
                placeholder="Enter your message"
                value={inputValue}
                onChange={handleInputChange}
                style={{ width: '350px' }} // Custom styles to increase size
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSend}>
              <FontAwesomeIcon icon={faPaperPlane} /> {/* Send icon from Font Awesome */}
            </Button>
          </Modal.Footer>
        </Modal>
        {applications.length > 0 && (
          <div>
            <div className='table-details-list  table-wrapper '>
              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr style={{ textAlign: 'center' }}>
                    <th>Candidate Name</th>
                    <th>Candidate Email</th>
                    <th>Resume ID</th>
                    <th scope="col" onClick={() => handleSort('appliedOn')}> Date {sortedColumn === 'appliedOn' && sortOrder === 'asc' && '▲'}
                      {sortedColumn === 'appliedOn' && sortOrder === 'desc' && '▼'}</th>
                    <th>Action</th>
                    <th scope="col">Chat</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(application => (
                    <tr key={application.id}>
                      <td>{candidateName[application.candidateId]}</td>
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
                        {candidateEmail[application.candidateId]}
                      </td>

                      <td>{renderResumeComponent(application.resumeId)}</td>
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
      </div>
    </DashboardLayout >
  );
};
export default DreamApplication;