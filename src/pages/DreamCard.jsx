import React from 'react';

const DreamCard = () => {
  return (
    <div className="jobbox-container">
      <div className="column">
        <img src="dreamCompany.jpg" alt="Image 1" style={{ width: '400px' }} className="img-fluid mx-2" />
      </div>
      <div className="steps-container column">
        <img src="dreamJob.jpeg" alt="Image 2" style={{ width: '400px' }} className="img-fluid mx-2" />
      </div>
    </div>
  );
};

export default DreamCard;

