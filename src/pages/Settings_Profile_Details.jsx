import React, { useState } from 'react';
import { Button, Card, Col, Container, Form } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

const Settings_Profile_Details = () => {
    const [userName, setUserName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
   
    return (
        <div>
            <Container className='settings-account' style={{ padding: '20px' }}>
                <Col md={3} style={{ marginBottom: '20px' }}>
                    <h3 className='text-center'>Account</h3>
                    <h5 className='text-center'>Update Account Details</h5>
                </Col>
                <Col>
                    <Card style={{ width: '400px', marginLeft: '400px' }}>
                        <Form style={{ padding: '12px' }}>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formOldPassword">
                                <Form.Label>Old Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter old password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <br />
                            <Button type="submit">Update Details</Button>
                            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
                        </Form>
                    </Card>
                </Col>
            </Container>
        </div>
    );
};

export default Settings_Profile_Details;
