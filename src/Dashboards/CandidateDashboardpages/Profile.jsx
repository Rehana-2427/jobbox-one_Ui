import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import DashboardLayout from './DashboardLayout';

const Profile = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [showSkillsMessage, setShowSkillsMessage] = useState(false);
  const [newName, setNewName] = useState('');
  const [dropdowns, setDropdowns] = useState({
    skills: false,
    education: false,
    experience: false,
  });
  const [educationDetails, setEducationDetails] = useState({
    degree: '',
    branch: '',
    college: '',
    percentage: ''
  });
  const [experience, setExperience] = useState('');
  const [formData, setFormData] = useState({
    skills: '',
    educationDetails: {},
    experience: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/getCandidate?userId=${userId}`);
        console.log('API Response:', response.data); // Log the response to inspect it
        setUserData(response.data);
        setEducationDetails(response.data.educationDetails || {});
        setExperience(response.data.experience || '');

        const skillsArray = response.data.skills ? response.data.skills.split(',').map(skill => skill.trim()) : [];
        setSkills(skillsArray);

        setFormData({
          skills: skillsArray,
          educationDetails: response.data.educationDetails || {},
          experience: response.data.experience || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      skills,
      educationDetails,
      experience
    }));
  }, [skills, educationDetails, experience]);

  const toggleDropdown = (section) => {
    setDropdowns({ ...dropdowns, [section]: !dropdowns[section] });
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducationDetails({ ...educationDetails, [name]: value });
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill(''); // Clear the input field
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      if (skills.length < 5) {
        setShowSkillsMessage(true); // Show message if fewer than 5 skills
        return;
      }
      const skillsString = skills.join(', '); // Convert array to comma-separated string
      const updatedFormData = {
        ...formData,
        skills: skillsString
      };
      await axios.put(`${BASE_API_URL}/updateCandidateDetails`, updatedFormData, {
        params: { userId }
      });
      toast.success("Details updated successfully!");
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('Error updating details');
    }
  };

  const toggleSettings = () => {
    navigate('/');
  };
  // Example function to simulate updating user data
  const handleEditName = async () => {
    // Here you would typically make an API call to update the user data
    try {
      const response = await axios.put(`${BASE_API_URL}/updateCandidate?userId=${userId}&newName=${newName}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  return (

    <DashboardLayout>
      <h4>Personal details:</h4>
      <div className="profile-container">
        {userData && (
          <>
            <div className="profile-item">
              <span className="profile-label">Name:</span>
              <span className="profile-value">
                {userData.userName ? (
                  userData.userName
                ) : (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <button onClick={handleEditName}>Edit Name</button>
                  </>
                )}
              </span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{userData.userEmail}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Phone Number:</span>
              <span className="profile-value">{userData.phone}</span>
            </div>
          </>
        )}
      </div>

      {/* Skills Section */}
      <div className="candidate-profile-details">
        <h4
          onClick={() => toggleDropdown('skills')}
          className="d-flex align-items-center cursor-pointer"
        >
          Skills: {dropdowns.skills ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
        </h4>

        {dropdowns.skills && (
          <>
            <p className="text-danger mb-3">(Note: Add at least 5 skills)</p>
            <div className="mb-3 d-flex flex-wrap">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge bg-light text-dark me-2 mb-2 position-relative d-inline-flex align-items-center"
                  style={{
                    fontSize: '1.25rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  {skill}
                  <i
                    className="fas fa-times ms-2 text-danger"
                    onClick={() => handleRemoveSkill(index)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      position: 'absolute',
                      right: '3px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </i>
                </span>
              ))}
            </div>

            <div className="d-flex align-items-center">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill"
                className="form-control me-2"
                style={{ width: '300px' }}
              />
              <Button variant="primary" onClick={handleAddSkill}>Add Skill</Button>
            </div>
            {showSkillsMessage && (
              <p className="text-danger mt-3">Please add at least 5 skills.</p>
            )}
          </>
        )}
      </div>

      {/* Education Details Section */}
      <div className="candidate-profile-details">
        <h4
          onClick={() => toggleDropdown('education')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          Education Details: {dropdowns.education ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
        </h4>
        {dropdowns.education && (
          <div className="container mt-3">
            <div className="row mb-3">
              <div className="col-md-6 mb-2 mb-md-0">
                <div className="form-group">
                  <label htmlFor="degree"><b>Last Education Degree:</b></label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    className="form-control"
                    value={educationDetails.degree}
                    onChange={handleEducationChange}
                    placeholder="Enter your last education degree"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="branch"><b>Branch Name:</b></label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    className="form-control"
                    value={educationDetails.branch}
                    onChange={handleEducationChange}
                    placeholder="Enter branch name"
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-2 mb-md-0">
                <div className="form-group">
                  <label htmlFor="percentage"><b>Percentage/CGPA:</b></label>
                  <input
                    type="text"
                    id="percentage"
                    name="percentage"
                    className="form-control"
                    value={educationDetails.percentage}
                    onChange={handleEducationChange}
                    placeholder="Enter percentage or CGPA"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="college"><b>College/University:</b></label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    className="form-control"
                    value={educationDetails.college}
                    onChange={handleEducationChange}
                    placeholder="Enter college or university name"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="candidate-profile-details">
        <h4
          onClick={() => toggleDropdown('experience')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          Experience: {dropdowns.experience ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
        </h4>
        {dropdowns.experience && (
          <div>
            <p className="text-danger mb-3">Note: If you are a fresher, just enter 0</p>
            <div className="form-group">
              <label htmlFor="experience">
                <b>How many years of experience do you have?</b>
              </label>
              <div className="row">
                <div className="col-md-6 col-lg-4">
                  <input
                    id="experience"
                    type="text"
                    className="form-control form-control-sm"
                    name="experience"
                    value={experience}
                    onChange={handleExperienceChange}
                    placeholder="Your experience"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </DashboardLayout>
  );
};
export default Profile;
