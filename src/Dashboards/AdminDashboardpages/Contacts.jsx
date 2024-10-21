import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import Pagination from '../../Pagination';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const Contacts = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactId, setContactId] = useState();
  const [contactmessage, setContactMessage] = useState('');


  useEffect(() => {
    fetchContacts();
  }, [page, pageSize]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getContactMessages?page=${page}&size=${pageSize}`);
      setContacts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.put(`${BASE_API_URL}/sendReplyMessages?message=${message}&replyTo=${selectedEmail}&contactId=${contactId}`);
      setShowModal(false);
      if (response.status === 200) {
        alert("Reply sent successfully");
        fetchContacts();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const openModal = (email, contactID, contactmessage) => {
    setSelectedEmail(email);
    setContactId(contactID);
    setContactMessage(contactmessage);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmail('');
    setMessage('');
  };
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;
  const [isLeftSideVisible, setIsLeftSideVisible] = useState(false);

  const toggleLeftSide = () => {
    console.log("Toggling left side visibility");
    setIsLeftSideVisible(!isLeftSideVisible);
  };
  return (
    <div className='dashboard-container'>
      <div>
        <button className="hamburger-icon" onClick={toggleLeftSide} >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
      <AdminleftSide onClose={toggleLeftSide} />
      </div>

      <div className="right-side">
        <h2 style={{ textAlign: 'center' }}>Request from the Users</h2>
        <div className="help">
          <div className='table-details-list table-wrapper'>
            <Table hover className='text-center' style={{ marginLeft: '12px' }}>
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Replying To Users</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td>{contact.message}</td>
                    <td>
                      {contact.replyMsg === null ? (
                        <Button onClick={() => openModal(contact.email, contact.contactID, contact.message)}>Reply</Button>
                      ) : (
                        <h3>Replied</h3>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Compose Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>To: {selectedEmail}</p>
              <p>Query:{contactmessage}</p>
              <Form.Control
                as="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={4}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </Modal.Footer>
          </Modal>
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
    </div>
  )
}

export default Contacts;
