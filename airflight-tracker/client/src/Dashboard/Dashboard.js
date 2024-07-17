import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
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
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
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

    const message = localStorage.getItem("updateMessage");
    if (message) {
      setUpdateMessage(message);
      localStorage.removeItem("updateMessage");
    }
  }, []);

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
        <button
          onClick={() => navigate(`/edit-profile/${localStorage.getItem("userId")}`)}
          className="edit-profile-button"
        >
          Edit Profile
        </button>
      </div>
      {updateMessage && <div className="update-message">{updateMessage}</div>}
      <div className="dashboard-cards-section">
        <div className="user-detail-section card">
          <h2>User Details</h2>
          <div className="detail-group">
            <h3>Basic Information</h3>
            <p>Email: {userData.email}</p>
            <p>Rank: {userData.rank}</p>
          </div>
          <div className="detail-group">
            <h3>Flight Hours</h3>
            <p>Total Flight Hours: {userData.total_flight_hours}</p>
            <p>NVG Hours: {userData.nvg_hours}</p>
          </div>
          <div className="detail-group">
            <h3>Qualifications</h3>
            <p>
              Aircraft Qualification:
              <ul>
                {userData.aircraft_qualification && userData.aircraft_qualification.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </p>
          </div>
          <div className="detail-group">
            <h3>Mission Experience</h3>
            <p>{userData.mission_experience}</p>
          </div>
          <div className="detail-group">
            <h3>Training Completed</h3>
            <p>
              <ul>
                {userData.training_completed && userData.training_completed.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </p>
          </div>
          <div className="detail-group">
            <h3>Language Proficiency</h3>
            <p>
              <ul>
                {userData.language_proficiency && userData.language_proficiency.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </p>
          </div>
          <div className="detail-group">
            <h3>Profile Image</h3>
            {userData.profile_image && (
              <img src={userData.profile_image} alt="Profile" className="profile-image" />
            )}
          </div>
        </div>
        <div className="team card">
          <h2>My Team</h2>
          <div className="team-members">
            {userData.team && userData.team.length > 0 ? (
              userData.team.map((pilot) => (
                <div key={pilot._id} className="team-member">
                  <p>Name: {pilot.username}</p>
                  <p>Email: {pilot.email}</p>
                </div>
              ))
            ) : (
              <p>No team members found</p>
            )}
          </div>
        </div>
        <div className="history card">
          <h2>History</h2>
          <div className="history-records">
            {userData.history && userData.history.length > 0 ? (
              userData.history.map((mission) => (
                <div key={mission._id} className="history-record">
                  <p>Date: {new Date(mission.date).toLocaleDateString()}</p>
                  <p>Mission: {mission.specific_mission}</p>
                </div>
              ))
            ) : (
              <p>No missions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
