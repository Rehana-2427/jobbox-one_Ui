const ResumeDropdown = ({ resumes, onSelectResume,onClose }) => {
    const [selectedResume, setSelectedResume] = useState('');
  
    const handleResumeChange = (event) => {
      const resumeId = event.target.value;
      setSelectedResume(resumeId);
      onSelectResume(resumeId);
    };
  
    return (
        <div className="resume-dropdown-container">
        <h2>Select Resume</h2>
        <select
            id="resumeSelect"
            value={selectedResume}
            onChange={handleResumeChange}
            required
        >
            <option value="">Select Resume</option>
            {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                    {resume.message}
                </option>
            ))}
        </select>
        {errMessage && <p className="error-message">{errMessage}</p>}
        <button className="ok" onClick={handleOkClick}>OK</button>
    </div>
    );
  };