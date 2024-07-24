import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PilotDetails.css';

function PilotDetails() {
  const { id } = useParams();
  const [pilot, setPilot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/api/user/profile/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPilot(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pilot details:', error);
        setError('Error fetching pilot details');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className='pilot-details'>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='error-message'>{error}</p>
      ) : (
        pilot && (
          <div className='details-card'>
            <img src={`http://localhost:3000/${pilot.profilePicture}`} alt='Profile' className='details-profile-picture'/>
            <h2>{pilot.username}</h2>
            <p><strong>Email:</strong> {pilot.email}</p>
            <p><strong>Rank:</strong> {pilot.rank}</p>
            <p><strong>NVG Hours:</strong> {pilot.nvg_hours}</p>
            <p><strong>Total Flight Hours:</strong> {pilot.total_flight_hours}</p>
            <p><strong>Aircraft Qualifications:</strong> {pilot.aircraft_qualification.join(', ')}</p>
            <p><strong>Training Completed:</strong> {pilot.training_completed.join(', ')}</p>
            <p><strong>Language Proficiency:</strong> {pilot.language_proficiency.join(', ')}</p>
          </div>
        )
      )}
    </div>
  );
}

export default PilotDetails;
