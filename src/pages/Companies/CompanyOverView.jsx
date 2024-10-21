import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const CompanyOverView = ({ companyId }) => {
  // const BASE_API_URL = "http://51.79.18.21:8082/api/jobbox";
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    // Fetch data using companyId
    fetchCompanyOverview(companyId);
  }, [companyId]);

  const fetchCompanyOverview = async (companyId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/displayCompanyById?companyId=${companyId}`);
      setOverviewData(response.data);
    } catch (error) {
      console.error('Error fetching company overview:', error);
    }
  };
  if (!overviewData) {
    return <p>Loading company overview...</p>; // Handle loading state
  }

  return (
    <div>
      <Card style={{ marginTop: '20px', width: '100%', height:"fit-content" ,marginLeft:'10px'}}>
        <Card.Body>
          <>
          <h3>About {overviewData.companyName}</h3>
      {overviewData.overView && <p>{overviewData.overView}</p>}

      {overviewData.websiteLink && (
        <>
          <h4>Website</h4>
          <p>
            <a href={overviewData.websiteLink} target="_blank" rel="noopener noreferrer">
              {overviewData.websiteLink}
            </a>
          </p>
        </>
      )}

      {overviewData.industryService && (
        <>
          <h4>Industry</h4>
          <p>{overviewData.industryService}</p>
        </>
      )}

      {overviewData.companySize && overviewData.companySize !== '0' && (
        <>
          <h4>Company Size</h4>
          <p>{overviewData.companySize}</p>
        </>
      )}

      {overviewData.headquaters && (
        <>
          <h4>Headquarters</h4>
          <p>{overviewData.headquaters}</p>
        </>
      )}

      {overviewData.year && overviewData.year !== '0' && (
        <>
          <h4>Founded</h4>
          <p>{overviewData.year}</p>
        </>
      )}

      {overviewData.specialties && (
        <>
          <h4>Specialties</h4>
          <p>{overviewData.specialties}</p>
        </>
      )}
          </>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CompanyOverView;
