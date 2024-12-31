import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../apiClient';

const CompanyOverView = () => {
  const [overviewData, setOverviewData] = useState(null);
  const { companyName } = useParams();  // Get companyName from URL
  console.log(companyName)
  useEffect(() => {
    // Fetch data using companyName
    if (companyName) {
      fetchCompanyOverview(companyName);
    }
  }, [companyName]);

  const fetchCompanyOverview = async (companyName) => {
    try {
      const response = await api.getCompanyByCompanyName(companyName); // Call the new API function
      setOverviewData(response.data); // Assuming the response data contains the company overview
    } catch (error) {
      console.error('Error fetching company overview:', error);
    }
  };

  if (!overviewData) {
    return <p>Loading company overview...</p>; // Handle loading state
  }

  return (
    <Card style={{ width: '100%', height: "fit-content", marginLeft: '10px' }}>
      <Card.Body>
        <>
          <h3>About {overviewData.companyName}</h3>
          {overviewData.overView && <p className="company-Overview">{overviewData.overView}</p>}

          {overviewData.websiteLink && (
            <>
              <h4>Website</h4>
              <p className="company-website">
                <a href={overviewData.websiteLink} target="_blank" rel="noopener noreferrer">
                  {overviewData.websiteLink}
                </a>
              </p>
            </>
          )}
          {overviewData.companyType && (
            <>
              <h4 className="company-subheader">Company Type</h4>
              <p className="company-industry">{overviewData.companyType}</p>
            </>
          )}
          {overviewData.industryService && (
            <>
              <h4>Industry</h4>
              <p className="company-industry">{overviewData.industryService}</p>
            </>
          )}

          {overviewData.companySize && overviewData.companySize !== '0' && (
            <>
              <h4>Company Size</h4>
              <p className="company-industry">{overviewData.companySize}</p>
            </>
          )}

          {overviewData.headquaters && (
            <>
              <h4>Headquarters</h4>
              <p className="company-headquarters">{overviewData.headquaters}</p>
            </>
          )}

          {overviewData.year && overviewData.year !== '0' && (
            <>
              <h4>Founded</h4>
              <p className="company-founded">{overviewData.year || ''}</p>
            </>
          )}

          {overviewData.specialties && (
            <>
              <h4>Specialties</h4>
              <p className="company-specialties">{overviewData.specialties}</p>
            </>
          )}
        </>
      </Card.Body>
    </Card>
  );
};

export default CompanyOverView;
