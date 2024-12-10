import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const StatusGraph = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const userId = location.state?.userId;
    const [applicationsData, setApplicationsData] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchApplicationsData(userId);
        }
    }, [userId]);

    const fetchApplicationsData = async (userId) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/countByDate`, {
                params: { userId },
            });
            setApplicationsData(response.data);
        } catch (error) {
            console.error('Error fetching application data:', error);
        }
    };

    const options = {
        chart: {
            id: 'chart1',
            type: 'line',
            zoom: { enabled: true },
        },
        xaxis: {
            type: 'datetime',
            categories: applicationsData.map((data) => new Date(data.date).toISOString()),
        },
        yaxis: {
            min: 0,
            max: 50,
            tickAmount: 10,
            labels: {
                formatter: (val) => parseInt(val, 10),
            },
        },
        series: [
            {
                name: 'Applications',
                data: applicationsData.map((data) => data.count),
            },
        ],
    };

    return (
        <Row>
            <Col lg={6} style={{ paddingLeft: '25px' }}>
                <Card className="mb-4"> {/* Light purple */}
                    <Card.Header className="bg-light text-center" style={{ height: '30px', width: '100%' }}>
                        <Card.Title as="h4" className="mb-3">Applications per Day</Card.Title>
                    </Card.Header>
                    <Card.Body className="pb-0">
                        <div className="chart-card">
                            <Chart
                                options={options}
                                series={options.series}
                                type={options.chart.type}
                                height="200"
                                width="100%"
                            />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default StatusGraph;
