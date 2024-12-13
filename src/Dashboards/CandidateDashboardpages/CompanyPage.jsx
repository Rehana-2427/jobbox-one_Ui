import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../apiClient";
import Pagination from "../../Pagination";
import './CandidateDashboard.css';
import DashboardLayout from "./DashboardLayout";
import ResumeSelectionPopup from "./ResumeSelectionPopup";

const CompamyPage = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const companyId = location.state?.companyId; // Access companyId from URL parameter
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [company, setCompany] = useState();
  const [countOfApplications, setCountOfApplications] = useState();
  const [countOfHR, setCountOfHR] = useState();
  const [countOfJobs, setCountOfJobs] = useState();
  const [activeTab, setActiveTab] = useState('overview'); // State to control the active tab
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");
  const [jobs, setJobs] = useState([]);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [hasUserApplied, setHasUserApplied] = useState({});
  const [applyjobs, setApplyJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [hasDreamApplied, setHasDreamApplied] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [countOfTotalJobs, setCountOfTotalJobs] = useState();
  const [countOfshortlistedApplications, setCountOfshortlistedApplications] = useState();
  const [companyInfo, setCompanyInfo] = useState({
    overView: '',
    websiteLink: '',
    industryService: '',
    companySize: '',
    headquaters: '',
    year: '',
    specialties: '',
  });
  const { companyName } = useParams();  // Get companyName from URL

  const [selectedJob, setSelectedJob] = useState(null);
  console.log(companyId)

  const fetchCompany = async (companyName) => {
    try {
      const response = await api.getCompanyByCompanyName(companyName);  // Fetch company data using API
      const companyData = response.data;
      setCompanyInfo(response.data)
      setCompany(companyData);
      setCompanyLogo(companyData.companyLogo);
      setCompanyBanner(companyData.companyBanner);
      fetchCompanyLogo(companyName);
      fetchCompanyBanner(companyName);
      fetchSocialMediaLinks(companyName);
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  console.log(companyInfo)
  useEffect(() => {
    if (companyName) {
      fetchData()
      fetchCompany(companyName);
      fetchCompanyLogo(companyName);
      fetchCompanyBanner(companyName);
      fetchSocialMediaLinks(companyName)
      fetchCountOfShortlistedCandidatesByCompany(userId, companyName)
      checkHasUserDreamApplied();
    }
  }, [companyName, userId]);


  const fetchCompanyLogo = async (companyName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/logo`, { params: { companyName }, responseType: 'arraybuffer' });
      const image = `data:image/jpeg;base64,${btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )}`;
      setCompanyLogo(image);
    } catch (error) {
      console.error('Error fetching company logo:', error);
    }
  };

  const fetchCompanyBanner = async (companyName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/banner`, { params: { companyName }, responseType: 'arraybuffer' });
      const image = `data:image/jpeg;base64,${btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )}`;
      setCompanyBanner(image);
    } catch (error) {
      console.error('Error fetching company banner:', error);
    }
  };

  const fetchData = async () => {
    try {
      const fetchCountOfApplicationByCompany = await api.getCountOfApplicationsByCompany(companyName);
      setCountOfApplications(fetchCountOfApplicationByCompany.data);

      const fetchCountOfHRByCompany = await api.getCountOfHRByCompany(companyName);
      setCountOfHR(fetchCountOfHRByCompany.data);

      const countOfJobsByCompany = await api.getCountOfActiveJobsByCompany(companyName);
      setCountOfJobs(countOfJobsByCompany.data);

      const fetchCountOfTotalJobsByCompany = await api.getCountOfTotalJobsByCompany(companyName);
      setCountOfTotalJobs(fetchCountOfTotalJobsByCompany.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCountOfShortlistedCandidatesByCompany = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/getCountOfTotalShortlistedApplicationCompany?userId=${userId}&companyName=${companyName}`
      );
      setCountOfshortlistedApplications(response.data);
    } catch (error) {
      console.error('Error fetching count of jobs:', error);
    }
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const handleViewSummary = (job) => {
    setSelectedJob(job);
  };
  const handleBackToList = () => {
    setSelectedJob(null); // Reset selectedJob to show the job list again
  };
  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };

  useEffect(() => {
    fetchJobsByCompany();
  }, [companyName, page, pageSize, sortedColumn, sortOrder]);

  async function fetchJobsByCompany() {
    try {
      const params = {
        companyName: companyName,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/getJobsPaginationByCompany`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const applyDreamCompanyJob = async (resumeId) => {
    const appliedOn = new Date(); // Get current date and time
    const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
    const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
    const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate); // Output: 2024-07-09 (example for today's date)
    try {
      const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${companyName}&formattedDate=${formattedDate}&resumeId=${resumeId}`);
      console.log(response.data);
      if (response.data) {
        Swal.close();

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Apply Successful!",
          text: "You have successfully applied for this job."
        });
        // setShowMessage(true);
        checkHasUserDreamApplied();
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const applyJob = async (jobId, resumeId) => {
    let loadingPopup;

    try {
      // Show loading message using SweetAlert
      loadingPopup = Swal.fire({
        title: 'Applying to the job...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const appliedOn = new Date(); // Get current date and time
      const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
      const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
      const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
      const formattedDate = `${year}-${month}-${day}`;
      const response = await axios.put(`${BASE_API_URL}/applyJob`, null, {
        params: { jobId, userId, formattedDate, resumeId },
      });
      if (response.data) {

        setApplyJobs((prevApplyJobs) => [...prevApplyJobs, { jobId, formattedDate }]);
        setHasUserApplied((prev) => ({ ...prev, [jobId]: true }));
        // Close the loading popup
        Swal.close();
        //Show Success 
        await Swal.fire({
          icon: "success",
          title: "Apply Successful!",
          text: "You have successfully applied for this job."
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      // Close loading popup on error
      if (loadingPopup) {
        Swal.close();
      }
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    } finally {
      // Ensure loading popup is closed if still open
      if (loadingPopup) {
        Swal.close();
      }
    }
  };

  useEffect(() => {
    axios.get(`${BASE_API_URL}/getResume`, { params: { userId } })
      .then(response => {
        setResumes(response.data);
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
      });
  }, [userId]);

  useEffect(() => {
    checkHasUserApplied();
  }, [jobs, userId]);

  const checkHasUserApplied = async () => {
    const applications = {};
    try {
      for (const job of jobs) {
        const response = await axios.get(`${BASE_API_URL}/applicationApplied`, {
          params: { jobId: job.jobId, userId }
        });
        applications[job.jobId] = response.data;
      }
      setHasUserApplied(applications);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };
  // useEffect(() => {
  //   checkHasUserDreamApplied();
  // }, [company?.companyName, userId]);
  const checkHasUserDreamApplied = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/applicationDreamAplied`, {
        params: { userId, companyName: companyName }
      });
      console.log("Has deam applied --> " + response.data)
      setHasDreamApplied(response.data);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };
  const handleApplyButtonClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowResumePopup(true);
  };

  const [resumeId, setResumeId] = useState(0);
  const [selectedResume, setSelectedResume] = useState(null); // Store selected resume details

  const handleResumeSelect = async (resume) => {
    const resumeId = resume.target.value
    setSelectedResume(resumeId);
    if (resumeId) {
      setResumeId(resumeId);
      setShowResumePopup(false);  // Close the resume selection popup
    }
  };
  const handleApplyCompany = () => {
    // if (companyName.trim() === '' ) {
    //    toast.error('Please enter the company name before selecting a resume.');
    //   return;
    // }
    if (!resumeId || !userId) {
      toast.error('Please select a resume.');
      return;
    }
    applyJob(selectedJobId, resumeId);
  };
  // const handleResumeSelect = async (resumeId) => {
  //   if (selectedJobId && resumeId) {
  //     await applyJob(selectedJobId, resumeId);
  //     setSelectedJobId(null);
  //   } else {
  //     await applyDreamCompanyJob(resumeId);
  //   }
  //   setShowResumePopup(false);
  // };

  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    linkedinLink: ''
  });

  const fetchSocialMediaLinks = async (companyName) => {
    try {
      const response = await api.getSocialMediaLinks(companyName);
      const { facebookLink, twitterLink, instagramLink, linkedinLink } = response.data;
      setSocialMediaLinks({
        facebookLink,
        twitterLink,
        instagramLink,
        linkedinLink,
      });
    } catch (error) {
      console.error('Error fetching social media links:', error);
    }
  };

  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;


  const customTabHeader = (title, icon) => (
    <div className="d-flex align-items-center">
      <span className="me-2">
        <i className={icon} />
      </span>
      <span>{title}</span>
    </div>
  );

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // useEffect should always be called unconditionally
  useEffect(() => {
    if (companyName) {
      const fetchDocuments = async () => {
        setLoading(true);
        try {
          const response = await api.getPolicyDocuments(companyName)
          if (response.data) {
            setDocuments(response.data); // Set documents data to state
          }
        } catch (err) {
          setError('Failed to fetch documents.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchDocuments();
    }
  }, [companyName]); // Effect will run whenever companyName changes

  const [reapplyMonths, setReapplyMonths] = useState(12); // Default to 12 months

  useEffect(() => {
    if (companyName) {
      // Fetch policy data when the component is mounted
        api.getHiringPolicy(companyName).then((response) => {
          if (response.data) {
            const months = response.data.allowReapply ? response.data.reapplyMonths : 12;
            setReapplyMonths(months || 12); // Fallback to default if no value is provided
          }
        })
        .catch((error) => {
          console.error('Error fetching policy data:', error);
        });
    }
  }, [companyName]);
  return (
    <DashboardLayout>
      {showResumePopup && (
        <ResumeSelectionPopup
          resumes={resumes}
          onSelectResume={handleResumeSelect}
          show={true}
          onClose={() => setShowResumePopup(false)}
        />
      )}
      <div
        className="small-screen-hr"
        style={{
          overflowY: 'auto',
          paddingBottom: '20px',
        }}
      >
        <Card style={{ width: '100%', height: '60%' }}>
          <Card.Body style={{ padding: 0, position: 'relative' }}>
            <div style={{ position: 'relative', height: '55%' }}>
              <img
                src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                alt="Company Banner"
                className="banner-image"
                onClick={() => ('banner')}
                style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
            </div>

            <div style={{ position: 'absolute', top: '90%', left: '50px', transform: 'translateY(-50%)' }}>
              <img
                src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                alt="Company Logo"
                className="logo-image"
                style={{
                  width: '200px',
                  height: '120px',
                  cursor: 'pointer',
                  clipPath: 'ellipse(50% 50% at 50% 50%)',
                  objectFit: 'cover',
                }}
              />
            </div>
          </Card.Body>
        </Card>

        <Row style={{ marginTop: '50px', alignItems: 'center' }}>
          <Col md={3} style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', padding: '5px' }}>
            <h2 style={{ paddingRight: '14px' }}><b>{companyName.toUpperCase()}</b></h2>
          </Col>
          <Col md={9} style={{ display: 'flex', alignItems: 'start' }}>
            {socialMediaLinks.facebookLink && (
              <a href={socialMediaLinks.facebookLink} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={28} style={{ margin: '0 5px', color: '#3b5998' }} />
              </a>
            )}
            {socialMediaLinks.twitterLink && (
              <a href={socialMediaLinks.twitterLink} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={28} style={{ margin: '0 5px', color: '#1da1f2' }} />
              </a>
            )}
            {socialMediaLinks.instagramLink && (
              <a href={socialMediaLinks.instagramLink} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={28} style={{ margin: '0 5px', color: '#e4405f' }} />
              </a>
            )}
            {socialMediaLinks.linkedinLink && (
              <a href={socialMediaLinks.linkedinLink} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={28} style={{ margin: '0 5px', color: '#0077b5' }} />
              </a>
            )}
          </Col>
        </Row>
        <hr style={{ border: '1px solid black', margin: '30px 0' }} />
        <Row className="hr-company_page-row2" style={{ marginTop: '50px' }}>
          <Col md={2}>
            <Tabs
              defaultActiveKey="overview"
              id="uncontrolled-tab-example"
              onSelect={(key) => setActiveTab(key)} // This is the correct way to handle tab change
            >
              <Tab eventKey="overview" title={customTabHeader("About  ", "i-Atom")}>

              </Tab>
              <Tab eventKey="jobs" title={customTabHeader("Job  ", "i-Shutter")}>
              </Tab>
            </Tabs>
          </Col>
        </Row>


        <Row>
          <Col xs={12} md={8}>
            {activeTab === 'overview' && (
              <>
                <div className='company-overview'>
                  <Card className="job-details-text" style={{ width: '100%', height: "fit-content" }}>
                    <Card.Body>
                      <h3>About {companyName} </h3>
                      {companyInfo.overView && (
                        <p><strong>Overview:</strong> {companyInfo.overView}</p>
                      )}
                      {companyInfo.websiteLink && (
                        <p><strong>Website:</strong> <a href={companyInfo.websiteLink} target="_blank" rel="noopener noreferrer">{companyInfo.websiteLink}</a></p>
                      )}
                      {companyInfo.industryService && (
                        <p><strong>Industry Service:</strong> {companyInfo.industryService}</p>
                      )}
                      {companyInfo.companySize && companyInfo.companySize !== '0' && (
                        <p><strong>Company Size:</strong> {companyInfo.companySize}</p>
                      )}
                      {companyInfo.headquaters && (
                        <p><strong>Headquarters:</strong> {companyInfo.headquaters}</p>
                      )}
                      {companyInfo.year && companyInfo.year !== '0' && (
                        <p><strong>Year Founded:</strong> {companyInfo.year}</p>
                      )}
                      {companyInfo.specialties && (
                        <p><strong>Specialties:</strong> {companyInfo.specialties}</p>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </>
            )}
            {activeTab === 'jobs' && (
              <>
                <div className="company-job" style={{ marginTop: '20px', width: '100%', height: "fit-content" }}>
                  {!selectedJob ? (
                    <div className="jobs_list">
                      {jobs.length > 0 && (
                        <div>
                          <div className="table-details-list table-wrapper">
                            <Table hover className='text-center' style={{ marginLeft: '5px', marginRight: '12px' }}>
                              <thead className="table-light">
                                <tr>
                                  <th scope='col' onClick={() => handleSort('jobTitle')}>
                                    Job Profile   {sortedColumn === 'jobTitle' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}
                                  </th>
                                  <th scope='col' onClick={() => handleSort('applicationDeadline')}>
                                    Application Deadline   {sortedColumn === 'applicationDeadline' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}
                                  </th>
                                  <th scope='col' onClick={() => handleSort('skills')}>
                                    Skills   {sortedColumn === 'skills' ? (sortOrder === 'asc' ? '▲' : '▼') : '↑↓'}
                                  </th>
                                  <th scope='col'>Job Summary</th>
                                  <th scope='col'>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {jobs.map(job => (
                                  <tr key={job.id} id='job-table-list'>
                                    <td
                                      title={job.jobCategory === "evergreen" && !job.applicationDeadline ?
                                        "This position is always open for hiring, feel free to apply anytime!" :
                                        ""
                                      }
                                    >
                                      {job.jobTitle}
                                    </td>
                                    <td>
                                      {job.jobCategory === "evergreen" && !job.applicationDeadline ? (
                                        <span style={{ color: 'green', fontWeight: 'bold' }} title="This position is always open for hiring, feel free to apply anytime!">
                                          Evergreen Job - No Due Date
                                        </span>
                                      ) : (
                                        job.applicationDeadline || 'Not Specified'
                                      )}
                                    </td>

                                    <td>{job.skills}</td>
                                    <td>
                                      <Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job)}>View</Button>
                                    </td>                                <td>
                                      {hasUserApplied[job.jobId] === true || (applyjobs && applyjobs.jobId === job.jobId) ? (
                                        <p>Applied</p>
                                      ) : (
                                        <Button onClick={() => handleApplyButtonClick(job.jobId)}>Apply</Button>
                                      )}
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
                      {jobs.length === 0 && <h1>No jobs found.</h1>}
                    </div>
                  ) : (
                    <div className="selected-job-details">
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="primary"
                          onClick={handleBackToList}
                        >
                          Back to Jobs
                        </Button>
                      </div>
                      <h3>Job Details</h3>
                      <p><strong>Title:</strong> {selectedJob.jobTitle}</p>
                      <p><strong>Type:</strong> {selectedJob.jobType}</p>
                      <p><strong>Skills:</strong> {selectedJob.skills}</p>
                      <p><strong>Posting Date:</strong> {selectedJob.postingDate}</p>
                      <p><strong>Vacancy:</strong> {selectedJob.numberOfPosition}</p>
                      <p><strong>Salary:</strong> {selectedJob.salary}</p>
                      <p><strong>Location:</strong> {selectedJob.location}</p>
                      <strong>Job Summary:</strong>
                      <pre className="job-details-text">
                        {selectedJob.jobsummary}
                      </pre>
                      <p><strong>Application Deadline:</strong> {selectedJob.applicationDeadline}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </Col>
          <Col xs={12} md={4}>
            <Card className='key-stats' style={{ width: '80%', height: 'fit-content' }}>
              <Card.Body>
                <Row className="mb-3">
                  <Col>
                    {hasDreamApplied === true ? (
                      <p style={{
                        color: '#28a745', /* Green color for the text */
                        fontSize: '18px', /* Larger font size */
                        fontWeight: 'bold', /* Bold text */
                        backgroundColor: '#e9f5e9', /* Light green background color */
                        padding: '10px',
                        borderRadius: '5px', /* Rounded corners */
                        textAlign: 'left', /* Center-align the text */
                        margin: '10px 0', /* Margin above and below the paragraph */
                        boxShadow: 'rgba(0, 0, 0, 0.1)', /* Subtle shadow effect */
                        width: '100px'
                      }}>
                        Applied
                      </p>
                    ) : (
                      <>
                        <div className="resume-dropdown-container">
                          <h5 className="fw-bold">Select Resume</h5>
                          <select
                            id="resumeSelect"
                            value={selectedResume}
                            onChange={handleResumeSelect}
                            required
                            className="form-select"
                          >
                            <option value="">Select Resume</option>
                            {resumes.map((resume) => (
                              <option key={resume.id} value={resume.id}>
                                {resume.message}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button
                          variant="success"
                          onClick={handleApplyCompany}
                          disabled={!selectedResume} // This disables the button if selectedResume is empty
                        >
                          Apply
                        </Button>

                      </>
                    )}
                  </Col>
                </Row>
                <h3><b>Other Information</b></h3>
                <Row className="mb-2">
                  <Col>
                    <h5>Applicants: {countOfApplications}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Total HR's: {countOfHR}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Total Jobs:{countOfTotalJobs}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Key Stats:</h5>
                    <ul>
                      <li>Active Job Postings:{countOfJobs}</li> {/* Placeholder values */}
                      <li>Shortlisted Applications:{countOfshortlistedApplications} </li>
                      <li>Avg. Time to Fill a Job: 7 days</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="key-stats" style={{ width: '100%', height: 'fit-content' }}>
              <Card.Body>

                <h3><b>Company Policies</b></h3>
                <h4>Job Reapply Policy</h4>
                <p>
                  Candidates can reapply after <strong>{reapplyMonths}</strong> months.
                </p>
                {documents.length === 0 ? (
                  <p>No documents available for this company.</p>
                ) : (
                  <div>
                    {documents.map((document) => (
                      <div key={document.documentId} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong>{document.documentTitle}:</strong>
                          <a
                            href={`data:application/octet-stream;base64,${document.documentFile}`}
                            download={document.documentTitle}
                            className="btn btn-primary"
                            style={{ marginLeft: '10px' }}>
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </DashboardLayout>
  );
};
export default CompamyPage;


