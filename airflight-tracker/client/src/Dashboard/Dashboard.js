import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [copilot, setCopilot] = useState(null);
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

  const handleMissionClick = async (acceptedMission) => {
    setSelectedMission(acceptedMission);
    try {
      const response = await fetch(`http://localhost:3000/api/user/copilot/${acceptedMission.mission._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      setCopilot(data);
    } catch (error) {
      console.error('Error fetching copilot data:', error);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedMission(null);
    setCopilot(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      {!selectedMission ? (
        <>
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
                  userData.acceptedMissions
                    .filter(acceptedMission => acceptedMission.mission && acceptedMission.mission.specific_mission) // Only render non-empty missions
                    .map((acceptedMission, index) => (
                      <div key={index} className="team-member card" onClick={() => handleMissionClick(acceptedMission)}>
                        <h3>Mission: {acceptedMission.mission.specific_mission}</h3>
                        <p>Aircraft: {acceptedMission.mission.aircraft}</p>
                        <button onClick={(e) => { e.stopPropagation(); deleteMission(acceptedMission.mission._id); }}>Delete Mission</button>
                        <button onClick={(e) => { e.stopPropagation(); completeMission(acceptedMission.mission._id); }}>Complete Mission</button>
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
                  userData.completedMissions.map((completedMission, index) => (
                    <div key={index} className="history-record card">
                      <h3>Mission: {completedMission.mission.specific_mission}</h3>
                      <p>Aircraft: {completedMission.mission.aircraft}</p>
                      <p>Completed Date: {new Date(completedMission.completed_date).toLocaleDateString()}</p>
                      <button onClick={() => clearCompletedMission(completedMission.mission._id)}>Clear Mission</button>
                    </div>
                  ))
                ) : (
                  <p>No completed missions yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mission-details-section">
          <div className="mission-details card">
            <h2>Mission Details</h2>
            <div className="mission-info">
              <h3>Mission: {selectedMission.mission.specific_mission}</h3>
              <p>Aircraft: {selectedMission.mission.aircraft}</p>
              <p>Type: {selectedMission.mission.mission_type}</p>
              <p>Destination: {selectedMission.mission.destination}</p>
              <p>Duration: {selectedMission.mission.duration_hours} hours</p>
            </div>
          </div>
          <div className="copilot-details card">
            <h2>Copilot Details</h2>
            {copilot ? (
              <div className="copilot-info">
                <p>Copilot: {copilot.username}</p>
                <p>Email: {copilot.email}</p>
              </div>
            ) : (
              <p>No copilot selected yet.</p>
            )}
          </div>
          <button className="back-button" onClick={handleBackToDashboard}>Back to Dashboard</button>
        </div>
      )}
    </div>
  );
};
//test
//test
export default Dashboard;
