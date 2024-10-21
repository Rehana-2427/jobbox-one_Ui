import React from 'react';
import { Button } from 'react-bootstrap';
import './Jobboxcard.css';

const Jobboxcard = () => {
    return (
        <div className="jobbox-container">
            <div className="column">
                {/* <h1>Unlock Your Career Potential with JobBox</h1> */}
                <img src="/jbcard.png.jpg" style={{width:'100%',height:'70%'}}/>
                <p>
                    <b>
                        At JobBox, we believe that every job seeker deserves the chance to shine. Our platform provides you with access to a wide range of job opportunities tailored to your skills and interests. With advanced search features and personalized job recommendations, you can easily find positions that align with your career aspirations. Join JobBox today and take the first step toward a brighter future!
                    </b>
                </p>
                {/* <img src="https://cutshort.io/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fimages%2Fafter_image.png&w=1920&q=75" alt="rightjob" /> */}

                <Button>More Action</Button>
            </div>
            <div className="steps-container column ">
                <div className="steps-container3 thq-card step1" >
                    <h2 className="thq-heading-2">Create Your Profile</h2>
                    <span className="steps-text01 thq-body-small">
                        Sign up and create a detailed profile showcasing your skills and experience.
                    </span>
                </div>
                <div className="steps-container3 thq-card step2">
                    <h2 className="thq-heading-2">Search for Jobs</h2>
                    <span className="steps-text01 thq-body-small">
                        Browse through a wide range of job listings and filter based on your preferences.
                    </span>
                </div>
                <div className="steps-container3 thq-card step3">
                    <h2 className="thq-heading-2">Apply for Jobs</h2>
                    <span className="steps-text01 thq-body-small">
                        Submit your applications to the jobs that interest you and align with your qualifications.
                    </span>
                </div>
                <div className="steps-container3 thq-card step4">
                    <h2 className="thq-heading-2">Get Hired</h2>
                    <span className="steps-text01 thq-body-small">
                        Receive interview requests and job offers from potential employers.
                    </span>
                </div>
            </div>
        </div >
    );
};

export default Jobboxcard;
