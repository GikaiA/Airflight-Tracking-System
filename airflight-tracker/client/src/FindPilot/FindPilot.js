import React, { useState } from "react";
import "./FindPilot.css";

function FindPilot() {
  const [rank, setRank] = useState("");
  const [totalFlightHours, setTotalFlightHours] = useState("");
  const [nvgHours, setNvgHours] = useState("");
  const [flightHours, setFlightHours] = useState("");
  const [pilots, setPilots] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/user/findPilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rank,
          totalFlightHours,
          nvgHours,
          flightHours,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPilots(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching pilots:", err);
    }
  };

  return (
    <div className="findpilot">
      <h1 className="findpilot-title">Find a Pilot</h1>
      <div className="find-pilot-section">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="dropdown1" className="dropdown-title">
              Rank
            </label>
            <select id="dropdown1" name="rank" value={rank} onChange={(e) => setRank(e.target.value)}>
              <option value="">Select a rank</option>
              <option value="Airman basic (E-1)">Airman basic (E-1)</option>
              <option value="Airman (E-2)">Airman (E-2)</option>
              <option value="Airman first class (E-3)">Airman first class (E-3)</option>
              <option value="Senior airman (E-4)">Senior airman (E-4)</option>
              <option value="Staff sergeant (E-5)">Staff sergeant (E-5)</option>
              <option value="Technical sergeant (E-6)">Technical sergeant (E-6)</option>
              <option value="Master sergeant (E-7)">Master sergeant (E-7)</option>
              <option value="Senior master sergeant (E-8)">Senior master sergeant (E-8)</option>
            </select>

            <label htmlFor="dropdown2" className="dropdown-title">
              Total Flight Hours
            </label>
            <select id="dropdown2" name="totalFlightHours" value={totalFlightHours} onChange={(e) => setTotalFlightHours(e.target.value)}>
              <option value="">Select...</option>
              <option value="300-500">300-500</option>
              <option value="600-900">600-900</option>
              <option value="1000-2000">1,000-2,000</option>
              <option value="2000-3000+">2,000-3,000+</option>
            </select>

            <label htmlFor="dropdown3" className="dropdown-title">
              NVG Hours
            </label>
            <select id="dropdown3" name="nvgHours" value={nvgHours} onChange={(e) => setNvgHours(e.target.value)}>
              <option value="">Select...</option>
              <option value="300-500">300-500</option>
              <option value="600-900">600-900</option>
              <option value="1000-2000">1,000-2,000</option>
              <option value="2000-3000+">2,000-3,000+</option>
            </select>

            <label htmlFor="dropdown4" className="dropdown-title">
              Flight Hours
            </label>
            <select id="dropdown4" name="flightHours" value={flightHours} onChange={(e) => setFlightHours(e.target.value)}>
              <option value="">Select...</option>
              <option value="300-500">300-500</option>
              <option value="600-900">600-900</option>
              <option value="1000-2000">1,000-2,000</option>
              <option value="2000-3000+">2,000-3,000+</option>
            </select>

            <button type="submit" className="findpilot-button">
              Find Pilot
            </button>
          </form>
        </div>
      </div>
      {error && <div>Error: {error}</div>}
      {pilots.length > 0 && (
        <div className="results">
           <h2 className="results-heading">Matched Pilots</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Rank</th>
                <th>Total Flight Hours</th>
                <th>NVG Hours</th>
                <th>Flight Hours</th>
              </tr>
            </thead>
            <tbody>
              {pilots.map((pilot) => (
                <tr key={pilot._id}>
                  <td>{pilot.username}</td>
                  <td>{pilot.email}</td>
                  <td>{pilot.rank}</td>
                  <td>{pilot.total_flight_hours}</td>
                  <td>{pilot.nvg_hours}</td>
                  <td>{pilot.flight_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FindPilot;
