import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, FormGroup } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import api from '../../apiClient';
import './HrDashboard.css';

const CompanyViewPage = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const [userData, setUserData] = useState({});
    const [companyTypes, setCompanyTypes] = useState([]);
    const [industryTypes, setIndustryTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [companyType, setCompanyType] = useState('');
    const location = useLocation();
    const userEmail = location.state?.userEmail || '';
    const companyName = userData.companyName || '';

    const [companyInfoEditMode, setCompanyInfoEditMode] = useState(false);
    const [companyInfo, setCompanyInfo] = useState({
        overView: '',
        websiteLink: '',
        companyType: '',
        industryService: '',
        companySize: '',
        headquaters: '',
        year: '',
        specialties: '',
    });

    const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyInfo((prev) => ({ ...prev, [name]: value }));

        if (name === 'companyType') {
            if (value === 'addOwn') {
                setShowCustomTypeInput(true);
                setCompanyType(''); // Reset custom input
                setCompanyInfo((prev) => ({ ...prev, companyType: '' })); // Reset companyType in companyInfo
            } else {
                setShowCustomTypeInput(false);
                setCompanyType(value); // Set selected company type
            }
        }
    };

    const handleCustomTypeChange = (e) => {
        setCompanyType(e.target.value); // Update the custom type input
    };


    const handleSave = async () => {
        // Check if custom type input should be used
        if (showCustomTypeInput && companyType) {
            console.log("Custom Company Type:", companyType);
            
            // Set the custom company type in companyInfo
            // setCompanyInfo((prev) => ({ ...prev, companyType })); 
            companyInfo.companyType=companyType;
        }
    
        // Log the companyInfo to check the current state before saving
        console.log("Company Info before saving:", companyInfo);
    
        try {
            const response = await axios.put(
                `${BASE_API_URL}/updateCompanyDetailsByHR?companyName=${companyName}`, 
                companyInfo
            );
            
            console.log("Response from API:", response.data);
            setCompanyInfo({...companyInfo})
            setCompanyInfoEditMode(false);
        } catch (error) {
            console.error('Error updating company details:', error);
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            if (userEmail) {
                try {
                    const userResponse = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
                    setUserData(userResponse.data);

                    const companyName = userResponse.data.companyName;
                    if (companyName) {
                        const companyResponse = await api.getCompanyByCompanyName(companyName)
                        setCompanyInfo(companyResponse.data);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [userEmail]);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [companyTypesResponse, industryTypesResponse, locationsResponse] = await Promise.all([
                    axios.get(`${BASE_API_URL}/companyTypes`),
                    axios.get(`${BASE_API_URL}/industryTypes`),
                    axios.get(`${BASE_API_URL}/locations`)
                ]);

                setCompanyTypes(companyTypesResponse.data);
                setIndustryTypes(industryTypesResponse.data);
                setLocations(locationsResponse.data);
            } catch (error) {
                console.error("Error fetching filter data:", error);
            }
        };
        fetchFilterData();
    }, []);

    return (
        <div className='company-overview'>
            <Card style={{ marginTop: '0px', width: '100%', height: "fit-content" }}>
                <Card.Body>
                    {companyInfoEditMode ? (
                        <Form>
                            <FormGroup controlId="overView">
                                <Form.Label><h3>About the Company</h3></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="overView"
                                    value={companyInfo.overView}
                                    onChange={handleInputChange}
                                    className="fullWidthTextarea"
                                    style={{ minHeight: '150px' }}
                                />
                            </FormGroup>
                            <FormGroup controlId="websiteLink">
                                <Form.Label><h4>Website</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="websiteLink"
                                    value={companyInfo.websiteLink}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="companyType">
                                <Form.Label><h4>Company Type</h4></Form.Label>
                                <Form.Select
                                    name="companyType"
                                    value={companyInfo.companyType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select a company type</option>
                                    {companyTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                    <option value="addOwn">Add Your Own</option>
                                </Form.Select>
                                {showCustomTypeInput && (
                                    <div>
                                        <Form.Label><p style={{ color: "red" }}> * Add Your Own Company Type *</p></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="customCompanyType"
                                            value={companyType}
                                            onChange={handleCustomTypeChange}
                                            placeholder="Enter your company type"
                                        />
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup controlId="industryService">
                                <Form.Label><h4>Industry Service</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="industryService"
                                    value={companyInfo.industryService}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="companySize">
                                <Form.Label><h4>Company Size</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="companySize"
                                    value={companyInfo.companySize}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="headquarters">
                                <Form.Label><h4>Headquarters</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="headquarters"
                                    value={companyInfo.headquaters}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="year">
                                <Form.Label><h4>Founded</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="year"
                                    value={companyInfo.year}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="specialties">
                                <Form.Label><h4>Specialties</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="specialties"
                                    value={companyInfo.specialties}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </Form>
                    ) : (
                        
                        <div className='job-details-text'>
                            <h4 className="company-header">
                                About {companyName} <FaEdit onClick={() => setCompanyInfoEditMode(true)}/>
                            </h4>
                            <p className="company-overview">{companyInfo.overView}</p>
                            <h4 className="company-subheader">Website</h4>
                            <p className="company-website">
                                <a href={companyInfo.websiteLink} target="_blank" rel="noopener noreferrer">
                                    {companyInfo.websiteLink}
                                </a>
                            </p>
                            <h4 className="company-subheader">Company Type</h4>
                            <p className="company-industry">{companyInfo.companyType}</p>
                            <h4 className="company-subheader">Industry</h4>
                            <p className="company-industry">{companyInfo.industryService}</p>
                            <h4 className="company-subheader">Company Size</h4>
                            <p className="company-size">{companyInfo.companySize || ''}</p>
                            <h4 className="company-subheader">Headquarters</h4>
                            <p className="company-headquarters">{companyInfo.headquaters}</p>
                            <h4 className="company-subheader">Founded</h4>
                            <p className="company-founded">{companyInfo.year || ''}</p>
                            <h4 className="company-subheader">Specialties</h4>
                            <p className="company-specialties">{companyInfo.specialties}</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default CompanyViewPage;
