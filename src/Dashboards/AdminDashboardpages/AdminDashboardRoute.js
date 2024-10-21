import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddCompanyDetails from './AddCompanyDetails'
import AdminAction from './AdminAction'
import AdminDashboard from './AdminDashboard'
import AllowingAccess from './AllowingAccess'
import BlockAccount from './BlockAccount'
import CompanyDetailsByAdmin from './CompanyDetailsByAdmin'
import CompanyValidation from './CompanyValidation'
import Contacts from './Contacts'
import Myprofile from './Myprofile'
import UserValidation from './UserValidation'

const AdminDashboardRoute = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/user-validation" element={<UserValidation />} />
                <Route path="/admin-action" element={<AdminAction />} />
                <Route path='/company-validation' element={<CompanyValidation />} />
                <Route path='/block-account' element={<BlockAccount />} />
                <Route path='/add-company-details' element={<AddCompanyDetails />} />
                <Route path='/companyDetailsByAdmin' element={<CompanyDetailsByAdmin />} />
                <Route path='/my-profile' element={<Myprofile />} />
                <Route path='/contacts' element={<Contacts />} />
                <Route path='/allowing-access' element={<AllowingAccess/>}/>
        </Routes>
        </div>
    )



}
export default AdminDashboardRoute;
