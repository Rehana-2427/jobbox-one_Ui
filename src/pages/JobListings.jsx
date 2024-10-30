import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { FaLightbulb, FaLocationArrow, FaMailBulk } from 'react-icons/fa';
import { MdSettings } from "react-icons/md";


const JobListings = () => {
    return (
        <Container >
            <Row>
                <Col md={3} >
                    <h1 style={{ borderBottom: '2px solid purple', display: 'inline-block' }}>Job Listings</h1>
                    <b>
                        <p>→ Opportunities Await at JobPortalHub</p>
                        <p>→ Job Alerts Tailored for You</p>
                        <p>→ Easy Job Application Process</p>
                    </b>
                    <Button>Explore Careers</Button>
                </Col>

                <Col md={3} className="mb-4">
                    <Card className='hover-effect' style={{ marginBottom: '20px', width: '350px' }}>
                        <Card.Body>
                            <Card.Title><MdSettings size={40} /><h2>Join Our Team</h2></Card.Title>
                            <Card.Text>
                                <p>Discover a variety of job postings suited for your skills and interests!</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className='hover-effect' style={{ width: '350px' }}> {/* Bottom Card */}
                        <Card.Body>
                            <Card.Title><FaLightbulb size={40} /><h2>Resume Building Assistance</h2></Card.Title>
                            <Card.Text>
                                <p>Get expert help to create a standout resume and enhance your job prospects!</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className='hover-effect' style={{ marginBottom: '40px', marginTop: '40px', width: '350px' }}> {/* Top Card */}
                        <Card.Body>
                            <Card.Title><FaMailBulk size={40} /><h2>Career Development </h2></Card.Title>
                            <Card.Text>
                                <p>Explore diverse roles that match your skills and aspirations, with great benefits and growth potential!</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className='hover-effect' style={{ width: '350px' }}> {/* Bottom Card */}
                        <Card.Body>
                            <Card.Title><FaLocationArrow size={40} /><h2>Interview Preparation Support </h2></Card.Title>
                            <Card.Text>
                                <p>Join our community and gain the confidence to ace your interviews!</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default JobListings
