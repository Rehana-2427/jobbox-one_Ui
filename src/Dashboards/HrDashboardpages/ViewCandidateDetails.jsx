import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

const ViewCandidateDetails = () => {
    // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const navigate = useNavigate(); // Hook to programmatically navigate
    // const userName = location.state?.userName;
    // const userEmail = location.state?.userEmail;
    // const candidateId = location.state?.candidateId;
    const { userEmail, userName, candidateId, currentDreamAppPage, currentDreamAppPageSize,dreamAppStatus ,dreamAppFromDate,dreamAppToDate,dreamAppSearch} = location.state || {};

    const [candidateDetails, setCandidateDetails] = useState(null);

    // Fetch candidate details when candidateId changes
    useEffect(() => {
        const fetchDetails = async () => {
            if (!candidateId) return; // Use falsy check instead of null

            try {
                const response = await axios.get(`${BASE_API_URL}/fetchCandidateDetails`, {
                    params: { candidateId },
                });
                setCandidateDetails(response.data);
            } catch (error) {
                console.error('Error fetching candidate details:', error);
                setCandidateDetails(null);
            }
        };

        fetchDetails();
    }, [candidateId]);

    const handleBack = () => {
        navigate('/hr-dashboard/dream-applications',{state :{ userEmail,userName,candidateId,currentDreamAppPage,currentDreamAppPageSize,dreamAppStatus,dreamAppFromDate,dreamAppToDate,dreamAppSearch}} );
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
            <div className='right-side'>
                <Button variant='primary' onClick={handleBack}>Back</Button>

                {candidateDetails ? (
                    <div className='candidate-details'>
                        <h2>Candidate Details</h2>
                        <p><strong>Email:</strong> {candidateDetails.userEmail}</p>
                        <p><strong>Name:</strong> {candidateDetails.userName}</p>
                        <p><strong>Skills:</strong> {candidateDetails.skills}</p>
                        <p><strong>Education:</strong> 
                            {candidateDetails.educationDetails ? (
                                `${candidateDetails.educationDetails.degree} (${candidateDetails.educationDetails.branch.toUpperCase()}) - from  ${candidateDetails.educationDetails.college.toUpperCase()} - ${candidateDetails.educationDetails.percentage}%`
                            ) : (
                                "N/A"
                            )}
                        </p>
                        <p><strong>Experience:</strong> {candidateDetails.experience}</p>
                        <p><strong>Phone:</strong> {candidateDetails.phone}</p>
                        {/* Add more details as needed */}
                    </div>
                ) : (
                    <p>Loading candidate details...</p>
                )}
            </div>
        </div>
    );
};

export default ViewCandidateDetails;
