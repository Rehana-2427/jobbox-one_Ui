import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./ApplicationDetails.css";
import HrLeftSide from "./HrLeftSide";

const ApplicationDetails = () => {
    // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
    

  const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const { userEmail, userName, applicationId,candidateId, currentApplicationPage, jobId, currentApplicationPageSize } = location.state || {};
    const [candidate, setCandidate] = useState(null);
    const [job, setJob] = useState(null);
    const [navigateBack, setNavigateBack] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (navigateBack) {
            navigate(-1);
        }
    }, [navigateBack, navigate]);

    useEffect(() => {
        
            const fetchCandidate = async () => {
                try {
                    const response = await axios.get(`${BASE_API_URL}/getUser?userId=${candidateId}`);
                    console.log("candidateId +++>" + candidateId)
                    setCandidate(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            const fetchJob = async () => {
                try {
                    const response = await axios.get(`${BASE_API_URL}/getJob?jobId=${jobId}`);
                    console.log("jobId +++>" + jobId)
                    setJob(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchCandidate();
            fetchJob();
        
    }, [candidateId,jobId,  BASE_API_URL]);

    const handleBack = () => {
        navigate('/hr-dashboard/hr-applications/view-applications', { state: { userEmail, applicationId, userName, currentApplicationPage, jobId, currentApplicationPageSize } });
    };
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
                <HrLeftSide user={{ userName, userEmail }} onClose={toggleLeftSide} />
            </div>
            <div className="right-side">
                <Button variant='primary' onClick={handleBack}>Back</Button>
                <div className="application-details-container" style={{overflowY:'scroll'}}>
                    {job && (
                        <div className="jobdetails">
                            <h2>Job Details</h2>
                            <p><b>Job Title:</b> {job.jobTitle}</p>
                            <p><b>Job Type:</b> {job.jobType}</p>
                            <p><b>Requirements:</b> {job.skills}</p>
                            <p><b>Position:</b> {job.numberOfPosition}</p>
                            <p><b>Skills:</b> {job.skills}</p>
                            <p><b>Location:</b> {job.location}</p>
                            <b>Job Description:</b><pre className="job-details-text"> {job.jobsummary}</pre>
                        </div>
                    )}
                    {candidate && (
                        <div className="candidatedetails">
                            {/* Log candidate details to console */}
                            {console.log("Candidate Details:", candidate)}

                            <h2>Candidate Details</h2>
                            <p><b>Name:</b> {candidate.userName}</p>
                            <p><b>Email:</b> {candidate.userEmail}</p>
                            <p><b>Phone:</b> {candidate.phone}</p>
                            <p><strong>Skills:</strong> {candidate.skills}</p>
                            <p><strong>Education:</strong> {candidate.education}</p>
                            <p><strong>Experience:</strong> {candidate.experience}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;
