import React, { useState } from 'react';
import { Button, Col, Container, Modal } from 'react-bootstrap';

const Subscription = () => {
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    return (
        <div>
            <Container className='settings-Notifications'style={{ padding: '20px' }}>
                <Col md={6} style={{ marginBottom: '20px', position:'relative',left:'70px' }}>
                    <h3><b style={{ color: 'purple'}}>Job</b><b style={{ color: 'gray' }}>box.one</b></h3>
                    <h5>Manage subscription status.</h5>
                </Col>
                <Col style={{position:'relative',left:'150px'}}>
                    <Button onClick={handleShow}>Subscribe to Jobbox.one</Button>
                </Col>
            </Container>
            <Modal show={showModal} onHide={handleClose} style={{ width: '100%', overflow: 'auto',height:'100vh' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Subscribe to JobBox.one</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Supercharge Your Job Search with <b style={{ color: 'purple' }}>Job</b><b style={{ color: 'gray' }}>box.one</b></h3>
                    <p>Thank you for your interest in subscribing to JobBox.one! Would you like to proceed with the subscription?</p>
                    <h4><b style={{ color: 'purple' }}>Job</b><b style={{ color: 'gray' }}>box.one</b> users experience:</h4>
                    <ul>
                        <li>2x More Interviews</li>
                    </ul>
                    <p>Leverage our premium features to enhance your job search.</p>
                  
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                        // Handle the subscription logic here
                        console.log('Subscribed!');
                        handleClose();
                    }}>
                        Subscribe
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Subscription
