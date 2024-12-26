import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../apiClient';

const CompanyPolicies = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;

    const [documents, setDocuments] = useState([]);
    const [newDoc, setNewDoc] = useState({ title: '', file: null });
    const [allowReapply, setAllowReapply] = useState(false);
    const [reapplyMonths, setReapplyMonths] = useState(12); // Default value
    const [companyName, setCompanyName] = useState('');
    const [userData, setUserData] = useState({});
    const location = useLocation();
    const userEmail = location.state?.userEmail || '';
    const [policy, setPolicy] = useState(null); // To hold policy data
    const fileInputRef = useRef(null); // Create a ref for the file input

    useEffect(() => {
        if (userEmail) {
            getUser(userEmail);
        }
    }, [userEmail]);

    const getUser = async (userEmail) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
            console.log(response.data);  // Check the API response structure
            setUserData(response.data);
            setCompanyName(response.data.companyName);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(companyName)


    useEffect(() => {
        // Fetch policy data when the component is mounted
        api.getHiringPolicy(companyName).then((response) => {
            if (response.data) {
                setPolicy(response.data);
                setAllowReapply(response.data.allowReapply);
                setReapplyMonths(response.data.allowReapply ? response.data.reapplyMonths : 12);
            }
        })
            .catch((error) => {
                console.error('Error fetching policy data:', error);
            });
    }, [companyName]);

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setAllowReapply(checked);

        // If the checkbox is unchecked, reset reapplyMonths
        if (!checked) {
            setReapplyMonths(12); // Default back to 12 months if unchecked
        }
    };

    const handleMonthChange = (e) => {
        setReapplyMonths(e.target.value);
    };

    const handleSavePolicy = () => {
        // Prepare the payload for the backend
        const policyData = {
            companyName: userData.companyName, // Correctly assign the companyName field
            allowReapply,
            reapplyMonths: allowReapply ? reapplyMonths : 12, // Only send reapplyMonths if reapply is allowed
        };

        // Send the data to the backend
        axios.put(`${BASE_API_URL}/updateHiringPolicy?companyName=${companyName}`, policyData)
            .then((response) => {
                toast.success('Policy saved successfully!', {
                    position: 'top-right',
                });
                console.log('Policy saved successfully:', response.data);
            })
            .catch((error) => {
                toast.error('Error saving policy. Please try again.', {
                    position: 'top-right',
                });
                console.error('Error saving policy:', error);
            });
    };

    const getDocuments = async () => {
        try {
            const response = await api.getPolicyDocuments(companyName)
            setDocuments(response.data); // Update the documents state
        } catch (error) {
            toast.error('Failed to fetch documents', { position: 'top-right' });
        }
    };



    // Handle adding a new document
    const handleAddDocument = async () => {
        if (!newDoc.title || !newDoc.file || !userData.companyName) {
            toast.error('Please provide a document title, and file.', {
                position: 'top-right',
            });
            return;
        }

        const formData = new FormData();
        formData.append('companyName', userData.companyName);
        formData.append('title', newDoc.title);
        formData.append('file', newDoc.file);

        try {
            const response = await axios.post(`${BASE_API_URL}/addPolicyDocuments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data || 'Document saved successfully!', {
                position: 'top-right',
            });

            // Update document list and reset form state
            setDocuments([...documents, { ...newDoc }]);
            setNewDoc({ title: '', file: null });

            // Clear the file input field
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // Refresh the document list
            // Refresh the page
            //  window.location.reload();

        } catch (error) {
            toast.error(error.response?.data || 'An error occurred.', {
                position: 'top-right',
            });
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <Card style={{ padding: '20px', marginBottom: '20px', width: '100%' }}>
                <h3>Hiring Policy</h3>
                <p>Policy: "Once applied, candidates can reapply again in {reapplyMonths || '12'} months."</p>
                <Form>
                    <Form.Group controlId="reapplyPolicy">
                        <Form.Check
                            type="checkbox"
                            label="Allow candidates to reapply for positions in your company"
                            checked={allowReapply}
                            onChange={handleCheckboxChange}
                        />
                        {allowReapply && (
                            <Form.Group controlId="reapplyMonths" style={{ marginTop: '10px' }}>
                                <Form.Label>Reapply After (Months)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={reapplyMonths}
                                    onChange={handleMonthChange}
                                    placeholder="Enter number of months"
                                    style={{ color: 'black' }}
                                />
                            </Form.Group>
                        )}
                    </Form.Group>
                    <br></br>
                    <Button onClick={handleSavePolicy}>Save Policy</Button>
                </Form>
            </Card>
            <Card className="documents-card" style={{ padding: '20px' }}>
                <h3 className="documents-title">Documents</h3>
                <p className="documents-description">
                    Add documents for other policies like Holiday Policy, Summer Internships, and others that can provide valuable information to employees and candidates.
                    Ensure these documents are easily accessible and kept up-to-date for better communication within the organization.
                </p>

                <Form className="documents-form">
                    <Form.Group controlId="docTitle" className="form-group">
                        <Form.Label className="form-label">Document Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={newDoc.title}
                            onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                            placeholder="Enter document title"
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="docFile" className="form-group">
                        <Form.Label className="form-label">Upload Document</Form.Label>
                        <Form.Control
                            type="file"
                            ref={fileInputRef} // Attach ref to the file input
                            onChange={(e) => setNewDoc({ ...newDoc, file: e.target.files[0] })}
                            className="form-control-file"
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleAddDocument} className="add-doc-button">
                        Add Document
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default CompanyPolicies;
