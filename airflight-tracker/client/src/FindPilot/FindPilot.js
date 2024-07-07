import React, { useState, useEffect } from 'react';
import './FindPilot.css';

function FindPilot() {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [pilots, setPilots] = useState([]);

  useEffect(() => {
    const fetchRecommendedMissions = async () => {
      console.log('Fetching recommended missions...');
      try {
        const response = await fetch('http://localhost:3000/api/user/recommendedMissions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure the auth token is set correctly
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        console.log('Missions fetched:', data);
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
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure the auth token is set correctly
        },
        body: JSON.stringify({ missionId: mission.mission_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      setPilots(data);
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
            <div key={mission.mission_id} className='mission-card' onClick={() => handleMissionClick(mission)}>
              <h3>{mission.aircraft}</h3>
              <p><strong>Duration:</strong> {mission.duration_hours} hours</p>
              <p><strong>Destination:</strong> {mission.destination}</p>
              <p><strong>Type:</strong> {mission.mission_type}</p>
              <p><strong>Specific Mission:</strong> {mission.specific_mission}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className='pilot-results'>
          {pilots.length > 0 ? (
            <div className='cards'>
              {pilots.map((pilot) => (
                <div className='card' key={pilot._id}>
                  <div className='card-body'>
                    <h3 className='card-title'>{pilot.username}</h3>
                    <p className='card-text'><strong>Email:</strong> {pilot.email}</p>
                    <p className='card-text'><strong>Rank:</strong> {pilot.rank || 'N/A'}</p>
                    <p className='card-text'><strong>NVG Hours:</strong> {pilot.nvg_hours || 'N/A'}</p>
                    <p className='card-text'><strong>Combat Hours:</strong> {pilot.combat_hours || 'N/A'}</p>
                    <p className='card-text'><strong>Total Flight Hours:</strong> {pilot.total_flight_hours || 'N/A'}</p>
                    <p className='card-text'><strong>Combat Sorties:</strong> {pilot.combat_sorties || 'N/A'}</p>
                    <p className='card-text'><strong>Total Sorties:</strong> {pilot.total_sorties || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No pilots found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FindPilot;

