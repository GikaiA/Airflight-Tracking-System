import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // Add other fields as necessary
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data to populate the form (similar fetch as in Dashboard)
    // Assume user ID is stored in local storage or passed some other secure way
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFormData(data);  // Assuming the data keys match the formData structure
        } else {
          throw new Error(data.message || 'Failed to fetch profile data');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchUserData();
  }, []);

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
      const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`, {
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
        throw new Error('Profile update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert(err.message);
    }
  };

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
