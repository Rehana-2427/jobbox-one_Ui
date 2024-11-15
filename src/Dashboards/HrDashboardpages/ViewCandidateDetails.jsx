import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

const ViewCandidateDetails = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const { userEmail, userName, candidateId, currentDreamAppPage, currentDreamAppPageSize, dreamAppStatus, dreamAppFromDate, dreamAppToDate, dreamAppSearch } = location.state || {};
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
        navigate('/hr-dashboard/dream-applications', { state: { userEmail, userName, candidateId, currentDreamAppPage, currentDreamAppPageSize, dreamAppStatus, dreamAppFromDate, dreamAppToDate, dreamAppSearch } });
    };

    const [isLeftSideVisible, setIsLeftSideVisible] = useState(true);

    const toggleLeftSide = () => {
        console.log("Toggling left side visibility");
        setIsLeftSideVisible(!isLeftSideVisible);
    };
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 767);

    useEffect(() => {
        // Update the `isSmallScreen` state based on screen resizing
        const handleResize = () => setIsSmallScreen(window.innerWidth <= 767);

        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className='dashboard-container'>

            <div className={`left-side ${isLeftSideVisible ? 'visible' : ''}`}>
                <HrLeftSide user={{ userName, userEmail }} onClose={toggleLeftSide} />
            </div>
            <div className='right-side'>
                <div
                    className="small-screen-hr"
                    style={{
                        overflowY: 'auto',
                        maxHeight: isSmallScreen ? '600px' : '1000px',
                        paddingBottom: '20px'
                    }}
                >
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
                        </div>
                    ) : (
                        <p>Loading candidate details...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewCandidateDetails;
