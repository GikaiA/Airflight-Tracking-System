import React, { useState } from 'react';
import './FindPilot.css';

function FindPilot() {
  const [rank, setRank] = useState('');
  const [totalFlightHours, setTotalFlightHours] = useState('');
  const [nvgHours, setNvgHours] = useState('');
  const [flightHours, setFlightHours] = useState('');
  const [combatHours, setCombatHours] = useState('');
  const [combatSorties, setCombatSorties] = useState('');
  const [totalSorties, setTotalSorties] = useState('');
  const [pilots, setPilots] = useState([]);


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Submitting form with values:', { rank, totalFlightHours, nvgHours, flightHours, combatHours, totalSorties, combatSorties });

    fetch('http://localhost:3000/api/user/findPilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rank,
        totalFlightHours,
        nvgHours,
        flightHours,
        combatHours,
        totalSorties,
        combatSorties,
      }),
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
      })
      .catch((error) => console.error('Error fetching pilot data:', error));
  };

  return (
    <div className='findpilot'>
      <h1 className='findpilot-title'>Find a Pilot</h1>
      <div className='find-pilot-section'>
        <div className='form-container'>
          <form onSubmit={handleSubmit}>
            <label htmlFor='dropdown1' className='dropdown-title'>
              Rank
            </label>
            <select id='dropdown1' name='dropdown1' value={rank} onChange={(e) => setRank(e.target.value)}>
              <option value=''>Select a rank</option>
              <option value='Airman basic (O-1)'>(O-1)</option>
              <option value='Airman (O-2)'>(O-2)</option>
              <option value='Airman first class (O-3)'>(O-3)</option>
              <option value='Senior airman (O-4)'>(O-4)</option>
              <option value='Staff sergeant (O-5)'>(O-5)</option>
              <option value='Technical sergeant (O-6)'>(O-6)</option>
              <option value='Master sergeant (O-7)'>(O-7)</option>
              <option value='Senior master sergeant (O-8)'>(O-8)</option>
            </select>

            <label htmlFor='dropdown2' className='dropdown-title'>
              Total Flight Hours
            </label>
            <select id='dropdown2' name='dropdown2' value={totalFlightHours} onChange={(e) => setTotalFlightHours(e.target.value)}>
              <option value=''>Select...</option>
              <option value='0-300'>0-300</option>
              <option value='300-500'>300-500</option>
              <option value='600-900'>600-900</option>
              <option value='1000-2000'>1,000-2,000</option>
              <option value='2000-3000'>2,000-3,000</option>
              <option value='3001+'>3001+</option>
            </select>

            <label htmlFor='dropdown3' className='dropdown-title'>
              NVG Hours
            </label>
            <select id='dropdown3' name='dropdown3' value={nvgHours} onChange={(e) => setNvgHours(e.target.value)}>
              <option value=''>Select...</option>
              <option value='0-300'>0-300</option>
              <option value='300-500'>300-500</option>
              <option value='600-900'>600-900</option>
              <option value='1000-2000'>1,000-2,000</option>
              <option value='2000-3000'>2,000-3,000</option>
              <option value='3001+'>3001+</option>
            </select>

            <label htmlFor='dropdown4' className='dropdown-title'>
              Combat Hours
            </label>
            <select id='dropdown4' name='dropdown4' value={combatHours} onChange={(e) => setCombatHours(e.target.value)}>
              <option value=''>Select...</option>
              <option value='0-300'>0-300</option>
              <option value='300-500'>300-500</option>
              <option value='600-900'>600-900</option>
              <option value='1000-2000'>1,000-2,000</option>
              <option value='2000-3000'>2,000-3,000</option>
              <option value='3001+'>3001+</option>
            </select>

            <label htmlFor='dropdown5' className='dropdown-title'>
              Total Sorties
            </label>
            <select id='dropdown5' name='dropdown5' value={totalSorties} onChange={(e) => setTotalSorties(e.target.value)}>
              <option value=''>Select...</option>
              <option value='0-300'>0-300</option>
              <option value='300-500'>300-500</option>
              <option value='600-900'>600-900</option>
              <option value='1000-2000'>1,000-2,000</option>
              <option value='2000-3000'>2,000-3,000</option>
              <option value='3001+'>3001+</option>
            </select>

            <label htmlFor='dropdown6' className='dropdown-title'>
              Combat Sorties
            </label>
            <select id='dropdown6' name='dropdown6' value={combatSorties} onChange={(e) => setCombatSorties(e.target.value)}>
              <option value=''>Select...</option>
              <option value='0-300'>0-300</option>
              <option value='300-500'>300-500</option>
              <option value='600-900'>600-900</option>
              <option value='1000-2000'>1,000-2,000</option>
              <option value='2000-3000'>2,000-3,000</option>
              <option value='3001+'>3001+</option>
            </select>

            <button type='submit' className='findpilot-button'>
              Find Pilot
            </button>
          </form>
        </div>
      </div>
      <div className='pilot-results'>
        {pilots.length > 0 ? (
          <div className='cards'>
            {pilots.map((pilot) => (
              <div className='card' key={pilot._id}>
                <div className='card-body'>
                  <h3 className='card-title'>{pilot.username}</h3>
                  <p className='card-text'><strong>Email:</strong> {pilot.email}</p>
                  <p className='card-text'><strong>Rank:</strong> {pilot.rank ? pilot.rank : 'N/A'}</p>
                  <p className='card-text'><strong>NVG Hours:</strong> {pilot.nvg_hours ? pilot.nvg_hours : 'N/A'}</p>
                  <p className='card-text'><strong>Combat Hours:</strong> {pilot.combat_hours ? pilot.combat_hours : 'N/A'}</p>
                  <p className='card-text'><strong>Total Flight Hours:</strong> {pilot.total_flight_hours ? pilot.total_flight_hours : 'N/A'}</p>
                  <p className='card-text'><strong>Comabt Sorties:</strong> {pilot.combat_sorties ? pilot.combat_sorties : 'N/A'}</p>
                  <p className='card-text'><strong>Total Sorties:</strong> {pilot.total_sorties ? pilot.total_sorties : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='no-pilot-sentence'>No pilots found</p>
        )}
      </div>
    </div>
  );
}

export default FindPilot;

