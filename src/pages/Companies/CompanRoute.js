import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CompanyForm from './CompanyForm.jsx'
import FindCompany from './FindCompany.jsx'


export default function CompanRoute() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FindCompany />} />
        <Route path='/company-form' element={<CompanyForm />}/>
      </Routes>
    </div>
  )
}

