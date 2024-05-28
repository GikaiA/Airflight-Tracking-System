import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Hook to navigate programmatically

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');  // Assume user ID is stored in local storage
      const token = localStorage.getItem('token');   // Retrieve the stored token

      try {
        const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Authorization header
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }
        setUserData(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');  // Navigate to EditProfile page
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div>
        <h2>Welcome, {userData.username}!</h2>
        <p>Email: {userData.email}</p>
        <p>Total Flight Hours: {userData.total_flight_hours}</p>
        <p>Night Hours: {userData.night_hours}</p>
        <p>NVG Hours: {userData.nvg_hours}</p>
        <p>Combat Hours: {userData.combat_hours}</p>
        <p>Combat Sorties: {userData.combat_sorties}</p>
        <p>Total Sorties: {userData.total_sorties}</p>
        <p>Instructor Time: {userData.instructor_time}</p>
        <p>Primary Time: {userData.primary_time}</p>
        <p>Secondary Time: {userData.secondary_time}</p>
        <button onClick={handleEditProfile}>Edit Profile</button>
      </div>
    </div>
  );
};

export default Dashboard;
