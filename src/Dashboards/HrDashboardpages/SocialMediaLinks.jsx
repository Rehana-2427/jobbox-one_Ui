import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const SocialMediaLinks = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;
    const [companyName, setCompanyName] = useState('');
    const [userData, setUserData] = useState({});
    const location = useLocation();
    const userEmail = location.state?.userEmail || '';
    // Get active tab from localStorage or default to 'social-media-links'
    const savedTab = localStorage.getItem('activeTab') || 'social-media-links';
    const [activeTab, setActiveTab] = useState(savedTab);
    useEffect(() => {
        // Save active tab to localStorage whenever it changes
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    console.log(userEmail)
    console.log(companyName)

    useEffect(() => {
        if (userEmail) {
            getUser(userEmail);
        }
    }, [userEmail]);
    useEffect(() => {
        if (userData.companyName) {
            fetchSocialMediaLinks(userData.companyName)
        }
    }, [userData.companyName]);

    const getUser = async (userEmail) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
            setUserData(response.data);
            setCompanyName(response.data.companyName);
        } catch (error) {
            console.log(error);
        }
    };
    const [socialMediaLinks, setSocialMediaLinks] = useState({
        facebookLink: '',
        twitterLink: '',
        instagramLink: '',
        linkedinLink: ''
    });

    const handleSocialInputChange = (e) => {
        const { name, value } = e.target;
        setSocialMediaLinks((prevLinks) => ({
            ...prevLinks,
            [name]: value,
        }));
    };
    const handleSaveLinks = async () => {
        try {
            await axios.put(`${BASE_API_URL}/updateSocialMediaLinks?companyName=${userData.companyName}`, {
                facebookLink: socialMediaLinks.facebookLink,
                twitterLink: socialMediaLinks.twitterLink,
                instagramLink: socialMediaLinks.instagramLink,
                linkedinLink: socialMediaLinks.linkedinLink
            });
            setSocialMediaLinks({
                facebookLink: socialMediaLinks.facebookLink,
                twitterLink: socialMediaLinks.twitterLink,
                instagramLink: socialMediaLinks.instagramLink,
                linkedinLink: socialMediaLinks.linkedinLink
            });
            fetchSocialMediaLinks(userData.companyName)
          //  window.location.reload(savedTab);
        } catch (error) {
            console.error('Error updating social media links:', error.response ? error.response.data : error.message);
        }
    };
    const fetchSocialMediaLinks = async (companyName) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getSocialMediaLinks`, {
                params: { companyName },
            });
            const { facebookLink, twitterLink, instagramLink, linkedinLink } = response.data;
            setSocialMediaLinks({
                facebookLink,
                twitterLink,
                instagramLink,
                linkedinLink,
            });
        } catch (error) {
            console.error('Error fetching social media links:', error);
        }
    };
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    return (
        <div style={{ padding: '10px' ,marginTop: '20px'}}>
            <Form>
                <Form.Group controlId="facebookLink">
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                        type="text"
                        name="facebookLink"
                        value={socialMediaLinks.facebookLink}
                        onChange={handleSocialInputChange}
                        placeholder="Enter Facebook link"
                    />
                </Form.Group>
                <Form.Group controlId="twitterLink">
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control
                        type="text"
                        name="twitterLink"
                        value={socialMediaLinks.twitterLink}
                        onChange={handleSocialInputChange}
                        placeholder="Enter Twitter link"
                    />
                </Form.Group>
                <Form.Group controlId="instagramLink">
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control
                        type="text"
                        name="instagramLink"
                        value={socialMediaLinks.instagramLink}
                        onChange={handleSocialInputChange}
                        placeholder="Enter Instagram link"
                    />
                </Form.Group>
                <Form.Group controlId="linkedinLink">
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                        type="text"
                        name="linkedinLink"
                        value={socialMediaLinks.linkedinLink}
                        onChange={handleSocialInputChange}
                        placeholder="Enter LinkedIn link"
                    />
                </Form.Group>
            </Form>
            <br></br>
            <Button
                style={{
                    display: 'block',          // Makes the button a block-level element
                    margin: '0 auto',          // Centers the button horizontally
                    width: '120px',            // Adjusts the button's width
                    padding: '8px 12px',       // Adds padding inside the button
                    color: 'white',            // Sets the text color
                    border: 'none',            // Removes the border
                    borderRadius: '4px',       // Adds rounded corners
                    cursor: 'pointer',         
                    textAlign: 'center',       
                }}
                onClick={handleSaveLinks}
            >
                Save Changes
            </Button>
        </div>
    )
}

export default SocialMediaLinks
