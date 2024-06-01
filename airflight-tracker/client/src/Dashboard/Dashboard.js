import React, { useState, useEffect } from "react";  // Uncomment this as useState and useEffect are used
import { useNavigate } from "react-router-dom";  // Remove Link if it's not used
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Ensure useNavigate is used if navigation is needed

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');  // Ensure userId is stored in localStorage
      const token = localStorage.getItem('token');  // Ensure token is stored in localStorage

      try {
        const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
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
    navigate('/edit-profile');  // Ensure this route is configured in your router
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  // Uncommented and revised user display data
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome, {userData.username}!</h1>
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
  );
};

export default Dashboard;
