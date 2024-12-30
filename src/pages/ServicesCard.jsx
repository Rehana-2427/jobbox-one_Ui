import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import './PagesStyle/Pages.css';

const cardData = [
    {
        imgSrc: '/Job_listings.jpg',
        title: 'Job Listings',
        text: 'Explore a variety of job listings tailored to your skills and interests. Discover opportunities that align with your career goals.',
        link: "#"
    },
    {
        imgSrc: '/jobs.jpg',
        title: 'Dream Jobs',
        text: 'Discover exciting career opportunities in the heart of the city and take the next step in your professional journey.',
        link: '#',
    },
    {
        imgSrc: '/Resume.jpg',
        title: 'Resume Building',
        text: 'Prepare your resume and unlock new career opportunities. Take the first step towards your dream job. **Build your future today!**',
        link: '#',
    },
    {
        imgSrc: '/Career.jpg',
        title: 'Career',
        text: 'Discover a variety of career paths and find the perfect job that aligns with your passions and goals. **Explore your career options!**',
        link: '#',
    }
];

const ServicesCard = () => {
    return (
        <Container>
            <Row className='text-center mb-4'>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ borderBottom: '2px solid purple', display: 'inline-block' }}>
                        Our Services
                    </h1>
                </div>

            </Row>
            <Row style={{paddingTop:'10px'}}>
                {cardData.map((card, index) => (
                    <Col md={3} key={index} className='mb-4'>

                        <Card className="card-profile-1 text-center mb-4 hover-effect" >
                            <Card.Img
                                variant="top"
                                src={card.imgSrc}
                                alt={card.title}
                                className='rounded-circle mx-auto d-block'
                                style={{ width: '120px', height: '120px' }}
                            />
                            <Card.Body>
                                <Card.Title><b>{card.title}</b></Card.Title>
                                <Card.Text>{card.text}</Card.Text>
                                <Button variant="primary" href={card.link}>Learn More</Button>
                            </Card.Body>
                        </Card>

                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ServicesCard;
