import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Modal, Spinner } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { default as swal } from 'sweetalert2';
import './CandidateDashboard.css';
import DashboardLayout from './DashboardLayout';

const Resume = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [showMessage, setShowMessage] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeDetails, setResumeDetails] = useState(null);
  // const [resumeDetails, setResumeDetails] = useState({}); // State to hold additional resume details (list of applications)
  const [viewResume, setViewResume] = useState(false);
  const [viewCount, setViewCount] = useState(false);
  const [resumeMessage, setresumeMessage] = useState(false);

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

  // // Fetch additional data (list of applications) based on resumeId
  // useEffect(() => {
  //   resumes.forEach(resume => {
  //     const resumeId = resume.id;
  //     console.log("resumeId" + resumeId)
  //     // Check if resumeId is a valid number (not undefined, null, or NaN)
  //     if (resumeId && !isNaN(resumeId)) {
  //       // Proceed with the API call only if resumeId is valid
  //       axios.get(`${BASE_API_URL}/getResumeDetails?resumeId=${resumeId}`)
  //         .then(response => {
  //           setResumeDetails(prevState => ({
  //             ...prevState,
  //             [resumeId]: response.data // Store list of applications for each resumeId
  //           }));
  //         })
  //         .catch(error => {
  //           console.error(`Error fetching details for resume ${resumeId}:`, error);
  //         });
  //     } else {
  //       console.error(`Invalid resumeId: ${resumeId}. Skipping API call.`);
  //     }
  //   });
  // }, [resumes]); // Trigger this when resumes change

  const detailsRef = useRef(null); // Ref for the details section
  const handleViewResumeDetails = async (resume) => {
    setViewResume(true); // Assuming this sets a loading state or triggers a view change.
    const resumeId = resume.id;
    setViewCount(resume.viewCount); //set viewCount
    setresumeMessage(resume.message); // set message
    console.log("resumeId: " + resumeId);

    // Check if resumeId is a valid number (not undefined, null, or NaN)
    if (resumeId && !isNaN(resumeId)) {
      // Proceed with the API call only if resumeId is valid
      try {
        const response = await axios.get(`${BASE_API_URL}/getResumeDetails?resumeId=${resumeId}`);
        setResumeDetails(response.data);  // Update resumeDetails state with the fetched data

          // Scroll to the details section
          if (detailsRef.current) {
            detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      } catch (error) {
        console.error(`Error fetching details for resume ${resumeId}:`, error);
      }
    } else {
      console.error(`Invalid resumeId: ${resumeId}. Skipping API call.`);
    }
  };


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
        <Link to="/candidate-dashboard/resume/resumeAdd" state={{ userName: userName, userId: userId }}>
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
      <p>(If you want to view your resume details please click on <strong style={{color:'red'}}>Preview </strong>)</p>

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
                    <h5 className="text-muted text-center" style={{marginTop:'10px'}} onClick={() => handleViewResumeDetails(resume)}>
                     <FaEye /> Preview
                    </h5>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <div ref={detailsRef} className="container mt-5">
        {viewResume && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-primary">{resumeMessage}</h4>
              <h5 className="text-muted">Total Views: {viewCount}</h5>
            </div>

            {/* Separator line */}
            <hr style={{ borderTop: '1px solid purple', marginTop: '15px', marginBottom: '15px' }} />

            {/* Render resume details if available */}
            {resumeDetails && resumeDetails.length > 0 ? (
              resumeDetails.map((application, appIndex) => (
                <div key={appIndex} className="application">
                  <p><strong>Company:</strong> {application.companyName}</p>
                  <p><strong>Job Title:</strong> {application.jobRole ? application.jobRole : 'Dream application'}</p>

                  {/* Separator line for each application */}
                  <hr style={{ borderTop: '1px solid purple', marginTop: '10px', marginBottom: '10px' }} />
                </div>
              ))
            ) : (
              <p>No applications found.</p> // Display message if no applications are found
            )}
          </>
        )}
      </div>

    </DashboardLayout>
  );
};

export default Resume;
