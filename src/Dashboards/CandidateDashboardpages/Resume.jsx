import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { default as swal } from 'sweetalert2';
import Footer from '../../pages/Footer';
import Pagination from '../../Pagination';
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
  const [viewResume, setViewResume] = useState(false);
  const [viewCount, setViewCount] = useState(false);
  const [resumeMessage, setresumeMessage] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0);
  };
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

  const detailsRef = useRef(null); // Ref for the details section
  const resumesRef = useRef(null); // Ref for the resumes cards section


  const [resumeId, setResumeId] = useState(null);

  const handleViewResumeDetailsWithPagination = async (resume) => {
    setViewResume(true);
    const resumeId = resume.id;
    setViewCount(resume.viewCount);
    setresumeMessage(resume.message);
    setResumeId(resumeId); // Store the resumeId in a state variable
    setPage(0); // Reset to the first page
      // Scroll to the resume details section
  if (detailsRef.current) {
    detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  };
  
  useEffect(() => {
    const fetchResumeDetails = async () => {
      if (resumeId && !isNaN(resumeId)) {
        try {
          const response = await axios.get(`${BASE_API_URL}/getResumeDetailsWithPagination`, {
            params: {
              resumeId: resumeId,
              page: page,
              pageSize: pageSize,
            },
          });
  
          const { content, totalPages } = response.data;
          setResumeDetails(content);
          setTotalPages(totalPages);
        } catch (error) {
          console.error(`Error fetching details for resume ${resumeId}:`, error);
        }
      }
    };
  
    fetchResumeDetails();
  }, [page, pageSize, resumeId]); // Add page and pageSize as dependencies

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
  const handleClose = () => {
    setViewResume(false); // Hide the resume details
    setResumeDetails([]); // Clear the resume details

   // Scroll to the top of the page
   if (resumesRef.current) {
    resumesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  };
  return (
    <DashboardLayout >
      <div ref={resumesRef}  className="main-content">
        <div className='adding-resumes' style={{ position: 'relative', marginTop: '10px', marginRight: '15px' }}>
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
        <p className='text-start'>(If you want to view your resume details please click on <strong style={{ color: 'red' }}>Preview </strong>)</p>

        {loading ? (
          <div className="text-center">
            <div className="d-flex justify-content-center">
              <div className="spinner-bubble spinner-bubble-primary m-5" />
            </div>
            <h4>Please wait... Fetching your resumes...</h4>
          </div>
        ) : (
          <>
            {resumes.length === 0 ? (
              <div className="text-center">No resumes found</div>
            ) : (
              <div  className="cards d-flex flex-wrap justify-content-start" style={{ minHeight: 'fit-content' }}>
                {resumes.map((resume, index) => (
                  <Card className='resume-card' style={{ width: '200px', margin: '12px' }} key={resume.id}>
                    <Card.Body>
                      <Card.Title>Resume : {index + 1}</Card.Title>
                      <Card.Text>{resume.message}</Card.Text>
                      {resume.fileType === 'file' && (
                        <Button size="sm" className="download" variant="primary" onClick={() => handleDownload(resume.id, resume.fileName)}>
                          Download
                        </Button>
                      )}
                      {resume.fileType === 'link' && (
                        <Card.Link href={resume.fileName} target="_blank">Open Link</Card.Link>
                      )}
                      {resume.fileType === 'brief' && (
                        <Button variant="secondary" size="sm" className="open-brief-modal" onClick={() => handleBrief(resume.id, resume.fileType)}>
                          Open Brief
                        </Button>
                      )}
                      <Button variant="danger" size="sm" className="delete" style={{ marginLeft: '10px' }} onClick={() => handleDelete(resume.id, resume.message)}>
                        Delete
                      </Button>
                      {/* <h5 className="text-muted text-center" style={{ marginTop: '10px' }} onClick={() => handleViewResumeDetails(resume)}>
                    <FaEye /> Preview
                  </h5> */}
                      <h5 className="text-muted text-center" style={{ marginTop: '10px' }} onClick={() => handleViewResumeDetailsWithPagination(resume)}>
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
                <Button onClick={handleClose}>Close</Button>
              </div>

              {/* Separator line */}
              <hr style={{ borderTop: '1px solid purple', marginTop: '15px', marginBottom: '15px' }} />

              {/* Render resume details if available */}
              {resumeDetails && resumeDetails.length > 0 ? (
                <>
                  {resumeDetails.map((application, appIndex) => (
                    <div key={appIndex} className="application">
                      <p><strong>Company:</strong> {application.companyName}</p>
                      <p><strong>Job Title:</strong> {application.jobRole ? application.jobRole : 'Dream application'}</p>

                      {/* Separator line for each application */}
                      <hr style={{ borderTop: '1px solid purple', marginTop: '10px', marginBottom: '10px' }} />
                    </div>
                  ))}

                  {/* Pagination component */}
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
                <p>No applications found.</p> // Display message if no applications are found
              )}
            </>
          )}
        </div>

      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default Resume;
