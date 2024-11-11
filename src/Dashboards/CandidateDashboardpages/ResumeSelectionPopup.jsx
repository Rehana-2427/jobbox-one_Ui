import React, { useState } from 'react';

const ResumeSelectionPopup = ({ resumes, onSelectResume, onClose }) => {

    const [errMessage, setErrMessage] = useState();
    const handleOkClick = () => {
        const selectedResumeUrl = document.getElementById("resumeSelect").value;

        if (selectedResumeUrl) {
            // Call onSelectResume with the selected resume URL
            onSelectResume(selectedResumeUrl);

            // Close the popup
            onClose();
        } else {
            setErrMessage("please select  resume");
            console.log("Please select a resume.");
        }
    };


    return (
        <div className="resume-selection-popup">
            {/* <div className="popup-content"> */}
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Select Resume</h2>
                <select id="resumeSelect" required>
                    <option value="">Select Resume</option>
                    {resumes.map(resume => (
                        <option key={resume.id} value={resume.id} >{resume.message}</option>
                    ))}
                </select>
                {errMessage && <p className="error-message">{errMessage}</p>}
                <button className='ok' onClick={handleOkClick}>OK</button>

            {/* </div> */}
        </div>

    );
};

export default ResumeSelectionPopup;
