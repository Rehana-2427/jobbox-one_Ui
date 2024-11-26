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
  sendMessage: (messageData) => apiClient.post('/savemessage', messageData),
  // Add other API functions here
};

export default api;
