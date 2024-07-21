// src/services/authService.js
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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

export const register = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Register user in the backend
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    await handleResponse(response);

    return user;
  } catch (error) {
    console.error('Registration error details:', error);
    throw error;
  }
};

export const login = async (usernameOrEmail, password) => {
  try {
    // Determine if input is email or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);
    
    if (isEmail) {
      // Login using email
      const userCredential = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
      const user = userCredential.user;

      // Login user in the backend
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: usernameOrEmail, password }),
      });
      await handleResponse(response);

      return user;
    } else {
      // Login using username
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameOrEmail, password }),
      });
      const user = await handleResponse(response);
      
      // Simulate Firebase signIn to keep consistency
      await signInWithEmailAndPassword(auth, user.email, password);

      return user;
    }
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
};
