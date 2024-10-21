import React from 'react'
import { Link } from 'react-router-dom'

const RegisterSuccessMsg = () => {
    return (

        <div className="sucess-msg-container" style={{ textAlign: 'center' }}>
            <h2>Registration Successful</h2>
            <p>please check Your Mail id</p>
            <p>You can login after approved</p>
            <Link to='/'>click here to Visit Home</Link>
        </div>
    )
}

export default RegisterSuccessMsg
