import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RegisterSuccessMsg from './RegisterSuccessMsg.jsx';
import Signup from './Signup.jsx';
import UserSignin from './UserSignin.jsx';

export default function UserRoute() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path='/hrSignup/registration-success-msg' element={<RegisterSuccessMsg />} />
                <Route path='/hrSignup/registration-success-msg/user-signin' element={<UserSignin />} />
                <Route path="/candiSignup/registration-success-msg/user-signin" element={<UserSignin />} />
            </Routes>
        </div>
    );
}
