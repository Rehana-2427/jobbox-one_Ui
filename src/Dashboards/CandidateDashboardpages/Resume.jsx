import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { default as swal, default as Swal } from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import DashboardLayout from './DashboardLayout';

const Resume = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [showMessage, setShowMessage] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeDetails, setResumeDetails] = useState({}); // State to hold additional resume details (list of applications)

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

  // Fetch additional data (list of applications) based on resumeId
  useEffect(() => {
    resumes.forEach(resume => {
      const resumeId = resume.id;
      console.log("resumeId" + resumeId)
      // Check if resumeId is a valid number (not undefined, null, or NaN)
      if (resumeId && !isNaN(resumeId)) {
        // Proceed with the API call only if resumeId is valid
        axios.get(`${BASE_API_URL}/getResumeDetails?resumeId=${resumeId}`)
          .then(response => {
            setResumeDetails(prevState => ({
              ...prevState,
              [resumeId]: response.data // Store list of applications for each resumeId
            }));
          })
          .catch(error => {
            console.error(`Error fetching details for resume ${resumeId}:`, error);
          });
      } else {
        console.error(`Invalid resumeId: ${resumeId}. Skipping API call.`);
      }
    });
  }, [resumes]); // Trigger this when resumes change


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

  return (
    <DashboardLayout>
      <div className='adding-resumes' style={{ position: 'relative', marginTop: '10px' }}>
        <Link to="/candidate-dashboard/resumeAdd" state={{ userName: userName, userId: userId }}>
          <Button style={{ position: 'absolute', top: 0, right: 0 }}>ADD NEW RESUME</Button>
        </Link>
      </div>

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

      <h3 className='text-start'>MY RESUMES</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h4>Please wait... Fetching your resumes...</h4>
        </div>
      ) : (
        <>
          {resumes.length === 0 ? (
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

      <div className="container mt-5">
        {resumes.length > 0 && (
          <div className="row">
            {resumes.map((resume, index) => (
              <div key={index} className="col-md-6 mb-4">
                <div className="p-4 border rounded shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-primary">{resume.message}</h4>
                    <h5 className="text-muted">Views: {resume.viewCount}</h5>
                  </div>
                  {/* Optionally, you can use <hr> to separate applications visually */}
                  <hr style={{ borderTop: '1px solid purple', marginTop: '15px', marginBottom: '15px' }} />

                  {resumeDetails[resume.id] && resumeDetails[resume.id].length > 0 && (
                    <div>
                      <h5 className="text-muted mb-3">This resume is used as: </h5>
                      {/* Optionally, you can use <hr> to separate applications visually */}
                      <hr style={{ borderTop: '1px solid purple', marginTop: '15px', marginBottom: '15px' }} />
                      {resumeDetails[resume.id].map((application, appIndex) => (
                        <div key={appIndex} className="application">
                          <p><strong>Company:</strong> {application.companyName}</p>
                          <p><strong>Job Title:</strong> {application.jobRole ? application.jobRole : 'Dream application'}</p>

                          {/* Optionally, you can use <hr> to separate applications visually */}
                          <hr style={{ borderTop: '1px solid purple', marginTop: '10px', marginBottom: '10px' }} />

                        </div>
                      ))}
                    </div>

                  )}
                  {resumeDetails[resume.id] && resumeDetails[resume.id].length === 0 && (
                    // <p>No applications found for this resume.</p>
                    <p>You are not using this resume yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Resume;
