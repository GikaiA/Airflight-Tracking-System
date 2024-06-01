/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    total_flight_hours: '',
    night_hours: '',
    nvg_hours: '',
    combat_hours: '',
    combat_sorties: '',
    total_sorties: '',
    instructor_time: '',
    primary_time: '',
    secondary_time: ''
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
    const token = localStorage.getItem('token');
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
        <label>
          Total Flight Hours:
          <input type="number" name="total_flight_hours" value={formData.total_flight_hours} onChange={handleFormChange} />
        </label>
        <label>
          Night Hours:
          <input type="number" name="night_hours" value={formData.night_hours} onChange={handleFormChange} />
        </label>
        <label>
          NVG Hours:
          <input type="number" name="nvg_hours" value={formData.nvg_hours} onChange={handleFormChange} />
        </label>
        <label>
          Combat Hours:
          <input type="number" name="combat_hours" value={formData.combat_hours} onChange={handleFormChange} />
        </label>
        <label>
          Combat Sorties:
          <input type="number" name="combat_sorties" value={formData.combat_sorties} onChange={handleFormChange} />
        </label>
        <label>
          Total Sorties:
          <input type="number" name="total_sorties" value={formData.total_sorties} onChange={handleFormChange} />
        </label>
        <label>
          Instructor Time:
          <input type="number" name="instructor_time" value={formData.instructor_time} onChange={handleFormChange} />
        </label>
        <label>
          Primary Time:
          <input type="number" name="primary_time" value={formData.primary_time} onChange={handleFormChange} />
        </label>
        <label>
          Secondary Time:
          <input type="number" name="secondary_time" value={formData.secondary_time} onChange={handleFormChange} />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
