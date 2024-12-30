import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';


const cardData = [
    {
        imgSrc: '/testmonial-1.jpg',
        title: 'Mahesh',
        subtitle: 'Software Engineer',
        text: '"The job search process has never been smoother. I landed my dream job thanks to jobbox.one offerings."',
    },
    {
        imgSrc: '/testmonial-2.avif',
        title: 'Arjun',
        subtitle: 'Marketing Specialist',
        text: '"Thanks to jobbox.one, I connected with amazing companies that truly value my skills and experience."',
    },
    {
        imgSrc: '/Testmonial - 3.jpg',
        title: 'Swetha',
        subtitle: 'Project Manager', // Replace with the desired job role
        text: '"I received excellent support throughout my job search, leading me to an amazing opportunity that aligns perfectly with my career goals."',
    }
];
const Testimonials = () => {
    return (
        <Container>
            <Row className='text-center mb-4'>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ borderBottom: '2px solid purple', display: 'inline-block' }}>
                        Read our success stories
                    </h1>
                </div>

            </Row>
            <Row>
                {cardData.map((card, index) => (
                    <Col md={4} key={index} className='mb-4'>
                        <Card className='card-profile-1 text-center mb-4 hover-effect'>
                            <Card.Img
                                variant="top"
                                src={card.imgSrc}
                                alt={card.title}
                                className='rounded-circle mx-auto d-block'
                                style={{ width: '140px', height: '140px' }}
                            />
                            <Card.Body>
                                <Card.Text>{card.text}</Card.Text>
                                <Card.Title className='text-center'><b>{card.title}</b></Card.Title>
                                <Card.Subtitle className='text-center'><b>{card.subtitle}</b></Card.Subtitle>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Testimonials
