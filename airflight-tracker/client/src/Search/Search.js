import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleSearch = () => {
    setLoading(true);
    setError('');

    fetch('http://localhost:3000/api/user/findPilotByName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPilots(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pilot data:', error);
        setError('Error fetching pilot data');
        setLoading(false);
      });
  };

  const handleCardClick = (pilotId) => {
    navigate(`/pilot/${pilotId}`);
  };

  return (
    <div className='search'>
      <div className='search-field-section'>
        <input
          type='text'
          className='search-field'
          placeholder='Search for a Pilot...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className='search-button-section'>
          <button className='search-button' onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='error-message'>{error}</p>
      ) : (
        <div className='pilot-results'>
          {pilots.length > 0 ? (
            <div className='cards'>
              {pilots.map((pilot) => (
                <div className='card' key={pilot._id} onClick={() => handleCardClick(pilot._id)}>
                  <div className='card-body'>
                    <img src={`http://localhost:3000/${pilot.profilePicture}`} alt='Profile' className='profile-picture'/>
                    <h3 className='card-title'>{pilot.username}</h3>
                    <p className='card-text'><strong>Email:</strong> {pilot.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='no-pilot-sentence'>No pilots found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
