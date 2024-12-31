import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FaLightbulb, FaLocationArrow, FaMailBulk } from 'react-icons/fa';
import { MdSettings } from "react-icons/md";


const JobListings = () => {
    return (
        <div>
            <Row>
                <Col md={3} style={{ marginLeft: '40px' }}>
                    <h1 style={{ borderBottom: '2px solid purple', display: 'inline-block' }}>Job Listings</h1>
                    <b>
                        <p>→ Opportunities Await at JobPortalHub</p>
                        <p>→ Job Alerts Tailored for You</p>
                        <p>→ Easy Job Application Process</p>
                    </b>
                    <Button>Explore Careers</Button>
                </Col>

                <Col md={4} className="mb-4 job-listings-cols" >
                    <Card className="hover-effect" style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
                        <Card.Body>
                            <Card.Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MdSettings size={40} />
                                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Join Our Team</h2>
                            </Card.Title>
                            <Card.Text>
                                <p style={{ wordWrap: 'break-word', margin: 0 }}>
                                    Discover a variety of job postings suited for your skills and interests!
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>


                    <Card className='hover-effect' style={{width: '100%', maxWidth: '400px'}}> {/* Bottom Card */}
                        <Card.Body>
                            <Card.Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaLightbulb size={40} />
                                <h2>Resume Building Assistance</h2>
                            </Card.Title>
                            <Card.Text>
                                <p style={{ wordWrap: 'break-word', margin: 0 }}>
                                    Get expert help to create a standout resume and enhance your job prospects!
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4 job-listings-cols" >
                    <Card className='hover-effect' style={{ marginBottom: '40px', marginTop: '40px', width: '100%', maxWidth: '400px' }}> {/* Top Card */}
                        <Card.Body>
                            <Card.Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaMailBulk size={40} />
                                <h2>Career Development </h2>
                            </Card.Title>
                            <Card.Text>
                                <p style={{ wordWrap: 'break-word', margin: 0 }}>
                                    Explore diverse roles that match your skills and aspirations, with great benefits and growth potential!
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className='hover-effect' style={{ width: '100%', maxWidth: '400px' }}> {/* Bottom Card */}
                        <Card.Body>
                            <Card.Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaLocationArrow size={40} />
                                <h2>Interview Preparation Support </h2>
                            </Card.Title>
                            <Card.Text>
                                <p style={{ wordWrap: 'break-word', margin: 0 }}>
                                    Join our community and gain the confidence to ace your interviews!
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default JobListings
