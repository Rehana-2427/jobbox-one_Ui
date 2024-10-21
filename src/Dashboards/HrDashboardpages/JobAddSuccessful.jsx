import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';
// import "./JobAddSuccessful.css";
const JobAddSuccessful = () => {

  const location = useLocation();
  const { userName, userEmail } = location.state || {};

  const navigate = useNavigate();
  console.log(userEmail);

  return (
   
    <div className='dashboard-container'>
      <div className='left-side'>
          <HrLeftSide user={{ userName, userEmail }} />
        </div>

        <div className="right-side">
          <Card className='d-flex justify-content-center align-items-center' style={{margin:'80px',padding:'24px'}}>
            <h2>Job Successfully Added!</h2>
            <br></br>
            <h4>Thank you <strong>{userName}</strong> for adding the job.</h4>
            <h4>You can go back to the dashboard or add another job:</h4>
         
                <Link to="#" onClick={(e) => {
                  e.preventDefault();
                  navigate('/hr-dashboard/my-jobs', { state: { userName, userEmail } });
                }}>
                  <Button>Go to Jobs</Button>
                </Link>
                <br></br>
                <Link to="#" onClick={(e) => {
                  e.preventDefault();
                  navigate('/hr-dashboard/my-jobs/addJob', { state: { userName, userEmail } });
                }}>
                  <Button>Add Job</Button>
                </Link>
      
          </Card>
   </div>
   </div>
  );
};

export default JobAddSuccessful;
