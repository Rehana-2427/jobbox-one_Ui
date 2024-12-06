import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define API functions
//contact send message API
const api = {

  //contact - home footer 
  sendMessage: (messageData) => apiClient.post('/savemessage', messageData),
  // Add other API functions here


  //save user 
  saveUser: (userData) => apiClient.post('/saveUser', userData),


  //valdiate userEmail
  validateUserEmail: (userEmail) =>
    apiClient.get('/validateUserEmail', {
      params: { userEmail }
    }),


  // User login
  userLogin: (userEmail, password) =>
    apiClient.get('/login', {
      params: { userEmail, password },
    }),

  // Check if the user is already logged in
  checkUser: (userEmail) =>
    apiClient.get('/checkUser', {
      params: { userEmail },
    }),

  //otp generate
  otpGenerate: (userEmail) =>
    apiClient.get('/generateOTP', {
      params: { userEmail }
    }),


  // Update user data
  updateUserData: (userData) => apiClient.put('/updateUserData', userData),

  //update password
  updatePassword: (userEmail, password) => apiClient.put('/updatePassword', userEmail, password),

  //get list of company logos
  getCompanyLogos: () => {
    return apiClient.get('/companylogos');
  },
  //get logo
  getLogo: (companyName) =>
    apiClient.get('/logo', {
      params: { companyName },
      responseType: 'arraybuffer', // Handle binary response (image)
    }),

  //get banner
  getBanner: (companyName) =>
    apiClient.get('/banner', {
      params: { companyName },
      responseType: 'arraybuffer', // Handle binary response (image)
    }),


  //get social media links of a company 
  //get banner
  getSocialMediaLinks: (companyName) =>
    apiClient.get('/getSocialMediaLinks', {
      params: { companyName }
    }),


  //company types
  getCompanyTypes: () => {
    return apiClient.get('/companyTypes');
  },

  //industry types
  getIndustryTypes: () => {
    return apiClient.get('/industryTypes');
  },

  //location based companies types
  getLocationBasedCompanies: () => {
    return apiClient.get('/locations');
  },

  //fetch companies by filtering options 
  fetchCompanies: async ({ search, page, pageSize, companyType, industryType, location }) => {
    let url;
    if (search) {
      url = '/searchCompany';
    } else if (companyType || industryType || location) {
      url = '/companiesByType';
    } else {
      url = '/companiesList';
    }

    const params = {
      search,
      page,
      size: pageSize,
      companyType,
      industryType,
      location,
    };

    return await apiClient.get(url, { params });
  },


  //company Details by company Id
  getDisplayCompanyDetailsById: (companyId) => {
    return apiClient.get('/displayCompanyById', {
      params: { companyId }
    })
  },


  //count of applicants in a company
  getCountOfApplicationsByCompany: (companyId) => {
    return apiClient.get('/countOfApplicationsByCompany', {
      params: { companyId }
    })
  },

  //count of hrs  in a company
  getCountOfHRByCompany: (companyId) => {
    return apiClient.get('/countOfHRByCompany', {
      params: { companyId }
    })
  },

  //count of Jobs active in a company
  getCountOfActiveJobsByCompany: (companyId) => {
    return apiClient.get('/countOfJobsByCompany', {
      params: { companyId }
    })
  },


  //count of Toatl Jobs posted by the company
  getCountOfTotalJobsByCompany: (companyId) => {
    return apiClient.get('/countOfTotalJobsByCompany', {
      params: { companyId }
    })
  },


  //get Job
  getJob: (jobId) =>
    apiClient.get('/getJob', {
      params: { jobId },
    }),

  //latest 5 jobs in company
  getLatest5JobsByCompany: (companyName) => {
    apiClient.get('/getLatest5JobsByCompany', {
      params: { companyName }
    })
  },

  // Define the API method for getting jobs posted by a company
  getJobsPostedByCompany: (companyId, page, pageSize, sortedColumn, sortOrder) => {
    return apiClient.get('/jobsPostedCompany', {
      params: { companyId, page, pageSize, sortedColumn, sortOrder },
    });
  },


  //apply dream company
  applyDreamCompany: (userId, companyName, formattedDate, resumeId) => {
    return apiClient.put('/applyDreamCompany', {
      params: { userId, companyName, formattedDate, resumeId }
    })
  },

  //checking dream company applied or not 
  checkDreamCompanyAppliedOrNot: (userId, companyName) => {
    return apiClient.get('/applicationDreamAplied', {
      params: { userId, companyName }
    })
  },

  //apply job
  applyJob: (jobId, userId, formattedDate, resumeId) => apiClient.put('/applyJob', null, {
    params: { jobId, userId, formattedDate, resumeId }
  }),


  //get resume
  getResume: (userId) => {
    return apiClient.get('/getResume', {
      params: { userId }
    });
  },


  // check job application applied or not
  checkJobAppliedOrNot: (jobId, userId) => {
    apiClient.get('/applicationApplied', {
      params: { jobId, userId }
    })
  },


  //search jobs
  searchJobs: (search, page, pageSize, sortedColumn, sortedOrder) => {
    return apiClient.get('/searchJobs', {
      params: { search, page, pageSize, sortedColumn, sortedOrder }
    });
  },


  //latest jobs
  latestJobs: (params) => {
    return apiClient.get('/latestJobs', { params });
  },


};

export default api;
