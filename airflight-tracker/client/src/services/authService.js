const API_BASE_URL = 'http://localhost:3000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      console.error('Error data:', errorData);
      throw new Error(errorData.message || 'Failed to process request');
    } else {
      const errorText = await response.text();
      console.error('Error text:', errorText);
      throw new Error('Unexpected response format');
    }
  }
  return response.json();
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Registration error details:', error);
    throw error;
  }
};
