import React, { useEffect, useState } from 'react';
import './Slider.css';

const Slider = ({ initialStatus, onChangeStatus }) => {
const [value, setValue] = useState(1); // Default position (middle)
  useEffect(() => {
    // Set the slider position based on initialStatus prop
    if (initialStatus === 'Shortlisted') {
      setValue(2); // Move slider to right (shortlisted)
    } else if (initialStatus === 'Not Shortlisted') {
      setValue(0); // Move slider to left (not shortlisted)
    } else {
      setValue(1); // Default position (middle)
    }
  }, [initialStatus]);

  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    if (newValue === 0) {
      onChangeStatus('Not Shortlisted');
    } else if (newValue === 2) {
      onChangeStatus('Shortlisted');
    } else {
      onChangeStatus('Not Seen'); 
    }
  };

  return (
    <div className={`slider-container ${value === 2 ? 'shortlisted' : value === 0 ? 'not-shortlisted' : ''}`}>
    <input
      type="range"
      min="0"
      max="2"
      value={value}
      onChange={handleChange}
      className="slider"
    />
  </div>
    
  );
};

export default Slider;
