import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [profileImageError, setProfileImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User is not authenticated. Please log in.');
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const data = await response.json();
        setUserData(data);
        setProfileImageError(false);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();

    const query = new URLSearchParams(location.search);
    const message = query.get('message');
    if (message) {
      setUpdateMessage(message);
    }
  }, [location.search]);

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

  const completeMission = async (missionId) => {
    try {
      const response = await fetch('http://localhost:3000/api/user/completeMission', {
        method: 'POST',
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
      setUserData(updatedUser.user);
      setUpdateMessage('Mission completed successfully.');
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  };

  const clearCompletedMission = async (missionId) => {
    try {
      const response = await fetch('http://localhost:3000/api/user/clearCompletedMission', {
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
      setUpdateMessage('Completed mission cleared successfully.');
    } catch (error) {
      console.error('Error clearing completed mission:', error);
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
          {userData.profilePicture && !profileImageError ? (
            <img
              src={`http://localhost:3000/uploads/profileFiles/${userData.profilePicture.split('/').pop()}`}
              alt="Profile"
              onError={() => setProfileImageError(true)}
              className="profile-image"
            />
          ) : (
            <img src="/default-profile.png" alt="Default Profile" className="profile-image" />
          )}
        </div>
        <h1>Welcome, {userData.username}!</h1>
        <button
          onClick={() => navigate(`/edit-profile/${localStorage.getItem('userId')}`)}
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
            {userData.acceptedMissions && userData.acceptedMissions.length > 0 ? (
              userData.acceptedMissions.map((acceptedMission, index) => (
                <div key={index} className="team-member">
                  {acceptedMission.mission && (
                    <>
                      <h3>Mission: {acceptedMission.mission.specific_mission}</h3>
                      <p>Aircraft: {acceptedMission.aircraft}</p>
                      <button onClick={() => deleteMission(acceptedMission.mission._id)}>Delete Mission</button>
                      <button onClick={() => completeMission(acceptedMission.mission._id)}>Complete Mission</button>
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
            {userData.completedMissions && userData.completedMissions.length > 0 ? (
              userData.completedMissions.map((completedMission) => (
                <div key={completedMission.mission._id} className="history-record">
                  <p>Date: {new Date(completedMission.completedAt).toLocaleDateString()}</p>
                  <p>Mission: {completedMission.mission.specific_mission || 'N/A'}</p>
                  <p>Pilot: {userData.username || 'N/A'}</p>
                  <button onClick={() => clearCompletedMission(completedMission.mission._id)}>Clear Mission</button>
                </div>
              ))
            ) : (
              <p>No completed missions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
