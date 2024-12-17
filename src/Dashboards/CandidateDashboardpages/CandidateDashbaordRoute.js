import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CandidateDashboard from './CandidateDashboard'
import CandidateJobs from './CandidateJobs'
import CandidatesCompanies from './CandidatesCompanies'
import CompamyPage from './CompanyPage'
import DreamCompany from './DreamCompany'
import DreamJob from './DreamJob'
import JobDescription from './JobDescription'
import MyApplication from './MyApplication'
import Payment from './Payment'
import Profile from './Profile'
import Resume from './Resume'
import ResumeAdd from './ResumeAdd'
import ResumeSelectionPopup from './ResumeSelectionPopup'
import ViewMoreJobs from './ViewMoreJobs'


const CandidateDashbaordRoute = () => {
  return (

    <Routes>
      <Route path="/" element={<CandidateDashboard />} />
      <Route path='/jobs' element={<CandidateJobs />} />
      <Route path='/companies' element={<CandidatesCompanies />} />
      <Route path='/resume' element={<Resume />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/payment' element={<Payment />} />
      <Route path='/my-application' element={<MyApplication />} />
      <Route path='/resume/resumeAdd' element={<ResumeAdd />} />
      <Route path='companies/companyPage/companyName/:companyName' element={<CompamyPage />} />
      <Route path='/resumePopUp' element={<ResumeSelectionPopup />} />
      <Route path='/jobs/dream-company' element={<DreamCompany/>}/>
      <Route path='/jobs/dream-job' element={<DreamJob/>}/>
      <Route path='/job-description' element={<JobDescription />}/>
      <Route path='/jobs/job-description/view-more' element={<ViewMoreJobs />}/>
    </Routes>

  )
}

export default CandidateDashbaordRoute
