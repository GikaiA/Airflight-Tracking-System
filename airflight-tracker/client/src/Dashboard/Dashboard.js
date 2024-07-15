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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    const message = localStorage.getItem("updateMessage");
    if (message) {
      setUpdateMessage(message);
      localStorage.removeItem("updateMessage");
    }
  }, []);

  const deleteMission = async (missionId) => {
    try {
      const response = await fetch('http://localhost:3000/api/user/deleteMission', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: localStorage.getItem('userId'), missionId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setUpdateMessage('Mission deleted successfully.');
    } catch (error) {
      console.error('Error deleting mission:', error);
    }
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
        <div className="profile-picture">
          <img src={userData.profilePicture || '/default-profile.png'} alt="Profile" />
        </div>
        <h1>Welcome, {userData.username}!</h1>
        <button
          onClick={() =>
            navigate(`/edit-profile/${localStorage.getItem("userId")}`)
          }
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
                {userData.aircraft_qualification &&
                  userData.aircraft_qualification.map((item, index) => (
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
                {userData.training_completed &&
                  userData.training_completed.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </p>
          </div>
          <div className="detail-group">
            <h3>Language Proficiency</h3>
            <p>
              <ul>
                {userData.language_proficiency &&
                  userData.language_proficiency.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </p>
          </div>
        </div>
        <div className="team card">
          <h2>My Team</h2>
          <div className="team-members">
            {/* Display accepted missions and their associated pilots */}
            {userData.acceptedMissions &&
              userData.acceptedMissions.length > 0 ? (
                userData.acceptedMissions.map((acceptedMission, index) => (
                  <div key={index} className="team-member">
                    {acceptedMission.mission && (
                      <>
                        <h3>Mission: {acceptedMission.mission.specific_mission}</h3>
                        <p>Aircraft: {acceptedMission.aircraft}</p>
                        {/* Add more fields as needed */}
                        <button onClick={() => deleteMission(acceptedMission.mission._id)}>Delete Mission</button>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No accepted missions yet.</p>
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
                  {/* Check if specific_mission exists before displaying */}
                  <p>Mission: {mission.specific_mission || "N/A"}</p>
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
