import React from 'react';
import { Link } from 'react-router-dom';
const AppliedSucessmsg = () => {
  return (
    <div className='applied-msg'>
        <h1>Congratulations!</h1>
        <p>You have successfully applied to our company. We appreciate your interest and look forward to reviewing your application.</p>
        <p>To access your dashboard, <Link to="/candidate-companies">click here</Link>.</p>
    </div>
  )
}

export default AppliedSucessmsg
