import React, { useState, useEffect } from 'react';
import './FindPilot.css';

function FindPilot() {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [recommendedPilot, setRecommendedPilot] = useState(null);

  useEffect(() => {
    const fetchRecommendedMissions = async () => {
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(`http://localhost:3000/api/user/recommendedMissions/${userId}`, {
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
        setMissions(data);
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    };

    fetchRecommendedMissions();
  }, []);

  const handleMissionClick = async (mission) => {
    setSelectedMission(mission);
    try {
      const response = await fetch('http://localhost:3000/api/user/findPilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ missionId: mission._id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      if (data.pilots.length > 0) {
        setRecommendedPilot(data.pilots[0]); // Assuming you want the first pilot
      } else {
        setRecommendedPilot(null); // No pilots found for the mission
      }
    } catch (error) {
      console.error('Error fetching pilot data:', error);
    }
  };

  return (
    <div className='findpilot'>
      <h1 className='findpilot-title'>Find a Pilot</h1>
      {!selectedMission ? (
        <div className='missions'>
          {missions.map((mission) => (
            <div key={mission._id} className='mission-card' onClick={() => handleMissionClick(mission)}>
              <h3>{mission.aircraft}</h3>
              <p><strong>Duration:</strong> {mission.duration_hours} hours</p>
              <p><strong>Destination:</strong> {mission.destination}</p>
              <p><strong>Type:</strong> {mission.mission_type}</p>
              <p><strong>Specific Mission:</strong> {mission.specific_mission}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className='selected-mission'>
          <h2>Mission Details</h2>
          <p><strong>Aircraft:</strong> {selectedMission.aircraft}</p>
          <p><strong>Duration:</strong> {selectedMission.duration_hours} hours</p>
          <p><strong>Destination:</strong> {selectedMission.destination}</p>
          <p><strong>Type:</strong> {selectedMission.mission_type}</p>
          <p><strong>Specific Mission:</strong> {selectedMission.specific_mission}</p>

          <h2>Recommended Pilot</h2>
          {recommendedPilot ? (
            <div className='card'>
              <div className='card-body'>
                <h3 className='card-title'>{recommendedPilot.username}</h3>
                <p className='card-text'><strong>Email:</strong> {recommendedPilot.email}</p>
                <p className='card-text'><strong>Rank:</strong> {recommendedPilot.rank || 'N/A'}</p>
                <p className='card-text'><strong>NVG Hours:</strong> {recommendedPilot.nvg_hours || 'N/A'}</p>
                <p className='card-text'><strong>Total Flight Hours:</strong> {recommendedPilot.total_flight_hours || 'N/A'}</p>
                {/* Add more fields as needed */}
              </div>
            </div>
          ) : (
            <p>No pilot found</p>
          )}

          <button onClick={() => setSelectedMission(null)} className='back-button'>Back to Missions</button>
        </div>
      )}
    </div>
  );
}

export default FindPilot;
