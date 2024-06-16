import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User is not authenticated. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/user/profile/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigate(`/edit-profile/${localStorage.getItem("userId")}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Welcome, {userData.username}!</h1>
        <button onClick={handleEditProfile} className="edit-profile-button">
          Edit Profile
        </button>
      </div>
      <div className="dashboard-cards-section">
        <div className="user-detail-section card">
          <h2>User Details</h2>
          <p>Email: {userData.email}</p>
          <p>Rank: N/A</p>
          <p>Total Flight Hours: {userData.total_flight_hours}</p>
          <p>Night Hours: {userData.night_hours}</p>
          <p>NVG Hours: {userData.nvg_hours}</p>
          <p>Combat Hours: {userData.combat_hours}</p>
          <p>Combat Sorties: {userData.combat_sorties}</p>
          <p>Total Sorties: {userData.total_sorties}</p>
          <p>Instructor Time: {userData.instructor_time}</p>
          <p>Primary Time: {userData.primary_time}</p>
          <p>Secondary Time: {userData.secondary_time}</p>
        </div>
        <div className="team card">
          <h2>My Team</h2>
          <div className="team-members">
            <div className="team-member">
              <p>Name: John Doe</p>
              <p>Role: Pilot</p>
            </div>
            <div className="team-member">
              <p>Name: Jane Smith</p>
              <p>Role: Co-Pilot</p>
            </div>
          </div>
        </div>
        <div className="history card">
          <h2>History</h2>
          <div className="history-records">
            <div className="history-record">
              <p>Date: 2023-05-01</p>
              <p>Mission: Training Flight</p>
            </div>
            <div className="history-record">
              <p>Date: 2023-04-20</p>
              <p>Mission: Reconnaissance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
