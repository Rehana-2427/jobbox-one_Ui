import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Dropdown, Modal, Spinner } from 'react-bootstrap'; // Import Spinner component
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { default as swal, default as Swal } from 'sweetalert2'; // Import SweetAlert2
import { useAuth } from '../../AuthProvider';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import DashboardLayout from './DashboardLayout';

const Resume = () => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [showMessage, setShowMessage] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch resumes data from the backend
    axios.get(`${BASE_API_URL}/getResume?userId=${userId}`)
      .then(response => {
        setResumes(response.data);
        setLoading(false); // Stop loading when resumes are fetched
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, [userId]);

  // Function to handle resume download
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

  const [showBriefSettings, setShowBriefSettings] = useState(false);
  const handleBrief = async (resumeId, fileType) => {
    const response = await axios.get(`${BASE_API_URL}/getBriefResume?resumeId=${resumeId}`);
    if (response) {
      setShowMessage(response.data);
      setShowBriefSettings(!showBriefSettings);
    }
  };

  const navigate = useNavigate();
  const toggleSettings = () => {
    navigate('/');
  };

  const handleDelete = async (resumeId, message) => {
    const result = await swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${BASE_API_URL}/deleteResume?resumeId=${resumeId}`);
        setResumes(prevResumes => prevResumes.filter(resume => resume.id !== resumeId));
        swal.fire('Deleted!', `${message} has been deleted.`, 'success');

      } catch {
        swal.fire('Failed', 'Error deleting resume', 'error');
      }
    } else {
      swal.fire('Cancelled', 'Your resume is safe', 'error');
    }
  };

  console.log(userName, userId)

  return (

<DashboardLayout>
          {/* Brief Modal */}
          {showBriefSettings && (
            <Modal show={showBriefSettings} onHide={() => setShowBriefSettings(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Brief Resume</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ overflowY: 'auto' }}>
                {showMessage}
              </Modal.Body>
            </Modal>
          )}

          {/* Resumes Section */}
          <h1 className='text-center'>MY RESUMES</h1>

          {loading ? (
            // Show spinner while loading
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <h4>Please wait... Fetching your resumes...</h4>
            </div>
          ) : (
            <>
              {resumes.length === 0 ? (
                // Show message if no resumes are found
                <div className="text-center">No resumes found</div>
              ) : (
                <div className="cards d-flex flex-wrap justify-content-start" style={{ minHeight: 'fit-content' }}>
                  {resumes.map((resume, index) => (
                    <Card className='resume-card' style={{ width: '200px', margin: '12px' }} key={resume.id}>
                      <Card.Body>
                        <Card.Title>Resume : {index + 1}</Card.Title>
                        <Card.Text>{resume.message}</Card.Text>
                        {resume.fileType === 'file' && (
                          <Button size="sm" className='download' variant="primary" onClick={() => handleDownload(resume.id, resume.fileName)}>
                            Download
                          </Button>
                        )}
                        {resume.fileType === 'link' && (
                          <Card.Link href={resume.fileName} target="_blank">Open Link</Card.Link>
                        )}
                        {resume.fileType === 'brief' && (
                          <Button variant="secondary" size="sm" className='open-brief-modal' onClick={() => handleBrief(resume.id, resume.fileType)}>
                            Open Brief
                          </Button>
                        )}
                        <Button variant="danger" size="sm" className='delete' style={{ marginLeft: '10px' }} onClick={() => handleDelete(resume.id, resume.message)}>
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Add Resume Section */}
          <div className='adding-resumes' style={{ marginTop: '50px' }}>
            <Link to="/candidate-dashboard/resumeAdd" state={{ userName: userName, userId: userId }}>
              <Button>ADD NEW RESUME</Button>
            </Link>
          </div>
          </DashboardLayout>
  );
};

export default Resume;
