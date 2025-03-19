import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

const apiCall = async (url, config) => {
  try {
    const response = await axios.put(url, config);
    return response.data;
  } catch (error) {
    console.error(`Failed to save configuration for ${config.pageNumber}:`, error);
    throw error;
  }
};


export const getOnboardingConfig = async () => {
  try {
    const response = await axios.get(`${API_URL}/page2and3`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching onboarding configuration:', error);
    throw error;
  }
};


export const saveOnboardingConfig = async (page2Components, page3Components) => {
  const configurations = [
    { pageNumber: 2, componentName: JSON.stringify(page2Components) },
    { pageNumber: 3, componentName: JSON.stringify(page3Components) }
  ];


  try {
    const savePromises = configurations.map(config =>
      apiCall(`${API_URL}/${config.pageNumber}`, config)
    );

    const [page2Response, page3Response] = await Promise.all(savePromises);
    console.log('Configuration saved successfully for Page 2 and Page 3:', page2Response, page3Response);
    return { page2Config: page2Response, page3Config: page3Response };
  } catch (error) {
    console.error('Failed to save configurations:', error);
    throw error;
  }
};


const API_URL_USER = 'http://localhost:8080/api/users';

export const fetchUserData = async () => {
  try {
    const response = await axios.get(API_URL_USER);
    return response.data;  // Return the fetched data
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];  // Return an empty array if the request fails
  }
};

export const submitUserData = async (userData) => {
  try {
    const response = await axios.post(API_URL_USER, userData);
    console.log(userData);
    if (response.status === 200) {
      return { success: true, message: response.data };
    } else {
      return { success: false, message: response.data };
    }
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        message: error.response.data
      };
    } else {
      return { success: false, message: 'No response from server. Please try again.' };
    }
  }
};
