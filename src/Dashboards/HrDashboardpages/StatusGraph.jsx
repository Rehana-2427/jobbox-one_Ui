import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';

const StatusGraph = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState(null);
  
    useEffect(() => {
      // Get the userName and userId from location.state if available, otherwise from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));  // Assuming 'user' is stored in localStorage
  
      const userNameFromLocation = location.state?.userName || storedUser?.userName || '';
      const userEmailFromLocation = location.state?.userEmail || storedUser?.userEmail || null;
  
      setUserName(userNameFromLocation);
      setUserEmail(userEmailFromLocation);
    }, [location]);  // Re-run the effect when the location changes
    
    const [monthlyJobData, setMonthlyJobData] = useState({
        labels: [],
        datasets: [{
            data: []
        }]
    });

    const fetchMonthlyJobData = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}/monthlyJobPercentagesByCompany`, {
                params: { userEmail: userEmail }
            });

            const allMonths = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const jobData = allMonths.map((month, index) => response.data[index + 1] || 0);

            setMonthlyJobData({
                labels: allMonths,
                datasets: [{
                    label: 'Job %',
                    backgroundColor: 'skyblue',
                    borderColor: 'black',
                    borderWidth: 1,
                    hoverBackgroundColor: 'skyblue',
                    hoverBorderColor: 'black',
                    data: jobData
                }]
            });
        } catch (error) {
            console.error('Error fetching monthly job data:', error);
        }
    }, [userEmail]);

    useEffect(() => {
        if (userEmail) {
            fetchMonthlyJobData();
        }
    }, [userEmail,fetchMonthlyJobData]);
    return (
        <Row >
          <Col lg={6} style={{paddingLeft:'25px'}}> {/* Increased width */}
                <Card className="mb-4"> {/* Light purple */}
                    <Card.Header className="bg-light text-center" style={{ height: '30px', width: '100%' }}>
                        <Card.Title as="h4" className="mb-3">Monthly Job Percentages</Card.Title>
                    </Card.Header>
                    <Card.Body className="pb-0">
                        <Bar
                            data={monthlyJobData}
                            options={{
                                responsive: true,
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                        ticks: {
                                            color: '#888',
                                            font: {
                                                size: 12
                                            }
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            color: '#888',
                                            font: {
                                                size: 12
                                            },
                                            maxTicksLimit: 100,
                                            stepSize: 10
                                        }
                                    }
                                }
                            }}
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>

    )
}

export default StatusGraph
