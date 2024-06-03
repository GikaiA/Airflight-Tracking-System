// src/services/authService.js

const API_BASE_URL = 'http://localhost:3000/api'; // Adjusted to the correct port

export const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        const errorData = await response.json(); // to get detailed error message
        throw new Error(errorData.message || 'Failed to login');
    }
    return await response.json();
};

export const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        const errorData = await response.json(); // to get detailed error message
        throw new Error(errorData.message || 'Failed to register');
    }
    return await response.json();
};
