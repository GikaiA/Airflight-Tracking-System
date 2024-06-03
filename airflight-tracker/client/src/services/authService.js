const API_BASE_URL = 'http://localhost:3000/api';

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // to get detailed error message
      console.error('Login fetch error:', errorData); // Log the detailed error message
      throw new Error(errorData.message || 'Failed to login');
    }

    const responseData = await response.json();
    console.log('Login successful:', responseData);
    return responseData;
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

    if (!response.ok) {
      const errorData = await response.json(); // to get detailed error message
      console.error('Registration fetch error:', errorData); // Log the detailed error message
      throw new Error(errorData.message || 'Failed to register');
    }

    const responseData = await response.json();
    console.log('Registration successful:', responseData);
    return responseData;
  } catch (error) {
    console.error('Registration error details:', error);
    throw error;
  }
};
