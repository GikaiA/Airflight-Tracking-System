/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // Add other fields as necessary
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();  // Access the id parameter from the URL

  useEffect(() => {
    // Fetch the current user data to populate the form
    const token = localStorage.getItem('token');

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/profile/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile data');
        }
        setFormData(data);  // Assuming the data keys match the formData structure
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Submit updated data to the backend
    try {
      const response = await fetch(`http://localhost:3000/api/user/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Profile updated successfully');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (err) {
      setError(err.message);
      console.error('Update error:', err);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleFormChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleFormChange} />
        </label>
        {/* Add more fields as needed */}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
