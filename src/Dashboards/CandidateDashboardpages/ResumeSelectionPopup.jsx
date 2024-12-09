import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ResumeSelectionPopup = ({ resumes, onSelectResume, show, onClose }) => {
    const [selectedResume, setSelectedResume] = useState(''); // Track selected resume
    const [errMessage, setErrMessage] = useState('');

    // Handle resume selection change
    const handleSelectChange = (event) => {
        setSelectedResume(event.target.value);
    };

    // Handle Apply button click
    const handleApplyClick = () => {
        if (selectedResume) {
            // Call onSelectResume with the selected resume ID
            onSelectResume(selectedResume);
            // Close the modal
            onClose();
        } else {
            // Set error message if no resume is selected
            setErrMessage("Please select a resume.");
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Resume</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <select
                    id="resumeSelect"
                    value={selectedResume}
                    onChange={handleSelectChange}
                    required
                    className="form-select"
                >
                    <option value="">Select Resume</option>
                    {resumes.map(resume => (
                        <option key={resume.id} value={resume.id}>
                            {resume.message}
                        </option>
                    ))}
                </select>

                {errMessage && <p className="error-message text-danger mt-2">{errMessage}</p>}
            </Modal.Body>

            <Modal.Footer>
                {/* <Button variant="secondary" onClick={onClose}>
                    Close
                </Button> */}
                <Button variant="primary" onClick={handleApplyClick}>
                    Apply
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ResumeSelectionPopup;
