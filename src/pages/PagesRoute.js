import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom'; // Use HashRouter
import AdminDashboardRoute from '../Dashboards/AdminDashboardpages/AdminDashboardRoute';
import CandidateDashbaordRoute from '../Dashboards/CandidateDashboardpages/CandidateDashbaordRoute';
import JobDescription from '../Dashboards/CandidateDashboardpages/JobDescription';
import ChatComponent from '../Dashboards/ChatComponent';
import HrDashbaordRoute from '../Dashboards/HrDashboardpages/HrDashbaordRoute';
import About from './About';
import AboutJobbox from './AboutJobbox';
import BrowseJobs from './BrowseJobs';
import CompanRoute from './Companies/CompanRoute';
import CompanyOverView from './Companies/CompanyOverView';
import EachCompanyPage from './Companies/EachCompanyPage';
import JobboxCompanyPage from './Companies/JobboxCompanyPage';
import PublicJobDetailsPage from './Companies/PublicJobDetailsPage';
import Contact from './Contact';
import CustomNavbar from './CustomNavbar';
import DataDeletionPolicy from './DataDeletionPolicy';
import FAQ from './FAQ';
import Home from './Home';
import Jobdetails from './Jobdetails';
import PrivacyPolicy from './PrivacyPolicy';
import ScrollToTop from './ScrollToTop';
import AdminRegister from './Session/AdminRegister';
import CandiSignup from './Session/CandiSignup';
import ForgetPassword from './Session/ForgetPassword';
import HrSignin from './Session/HrSignin';
import HRSignup from './Session/HRSignup';
import UserRoute from './Session/UserRoute';
import UserSignin from './Session/UserSignin';
import Settings from './Settings';
import TermsAndConditions from './TermsAndConditions';





const PagesRoute = () => {
  return (
    <div>
      <Router>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/custom-navbar" element={<CustomNavbar />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/about-jobbox" element={<AboutJobbox />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/data-deletion-policy" element={<DataDeletionPolicy />} />
          <Route path='/userRoute/*' element={<UserRoute />} />
          <Route path="/signup/*" element={<UserRoute />} />
          <Route path="/candidate-signup" element={<CandiSignup />} />
          <Route path="/hr-signup" element={<HRSignup />} />
          <Route path="/findcompany/*" element={<CompanRoute />} />
          <Route path="/signin" element={<UserSignin />} />
          <Route path="/hr-sign-in" element={<HrSignin />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path='/browse-jobs' element={<BrowseJobs />} />

          <Route path='/browse-jobs/job-details' element={<Jobdetails />} />
          <Route path='/jobboxcompanies' element={<JobboxCompanyPage />} />
          <Route path="/companyPage/companyName/:companyName" element={<EachCompanyPage />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
          <Route path='/privacy-and-policy' element={<PrivacyPolicy />} />
          <Route path='/faqs' element={<FAQ />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/hr-dashboard/*' element={<HrDashbaordRoute />} />
          <Route path='/candidate-dashboard/*' element={< CandidateDashbaordRoute />} />
          <Route path='/admin-register/*' element={<AdminRegister />} />
          <Route path='/admin-dashboard/*' element={<AdminDashboardRoute />} />
          <Route path="/candidate-dashboard/jobs/job-description/" element={<JobDescription />} />
          <Route path='/jobboxCompanyPage/eachCompanyPage/publicJobDetailsPage' element={<PublicJobDetailsPage />} />
          <Route path='/chatComponent' element={<ChatComponent />} />
          <Route path='/companyOverView' element={<CompanyOverView />} />
         
        </Routes>
      </Router>
    </div>
  );
}

export default PagesRoute;