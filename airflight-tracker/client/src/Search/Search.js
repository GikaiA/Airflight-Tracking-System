import React, { useState } from 'react';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setLoading(true);
    setError('');

    console.log('Searching with given query value:', { query });

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
        console.log('Fetched Pilots:', data);
        setPilots(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pilot data:', error);
        setError('Error fetching pilot data');
        setLoading(false);
      });
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
            <p className='no-pilot-sentence'>No pilots found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
