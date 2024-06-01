import React from "react";
import "./FindPilot.css";

function FindPilot() {
  return (
    <div className="findpilot">
      <h1 className="findpilot-title">Find a Pilot</h1>
      <div className="find-pilot-section">
        <div className="form-container">
          <form>
            <label htmlFor="dropdown1" className="dropdown-title">
              Rank{" "}
            </label>
            <select id="dropdown1" name="dropdown1">
              <option value="option1">Select a rank</option>
              <option value="option1">Airman basic (E-1)</option>
              <option value="option2">Airman (E-2)</option>
              <option value="option3"> Airman first class (E-3)</option>
              <option value="option4">Senior airman (E-4)</option>
              <option value="option5">Staff sergeant (E-5)</option>
              <option value="option6">Technical sergeant (E-6)</option>
              <option value="option7">Master sergeant (E-7)</option>
              <option value="option8">Senior master sergeant (E-8)</option>
            </select>

            <label htmlFor="dropdown2" className="dropdown-title">
              Total Flight Hours
            </label>
            <select id="dropdown2" name="dropdown2">
              <option value="option1">Select...</option>
              <option value="option2">300-500</option>
              <option value="option3">600-900</option>
              <option value="option4">1,000-2,000</option>
              <option value="option4">2,000-3,000+</option>
            </select>

            <label htmlFor="dropdown3" className="dropdown-title">
              NVG Hours
            </label>
            <select id="dropdown3" name="dropdown3">
              <option value="option1">Select...</option>
              <option value="option2">300-500</option>
              <option value="option3">600-900</option>
              <option value="option4">1,000-2,000</option>
              <option value="option4">2,000-3,000+</option>
            </select>

            <label htmlFor="dropdown4" className="dropdown-title">
              Flight Hours
            </label>
            <select id="dropdown4" name="dropdown3">
              <option value="option1">Select...</option>
              <option value="option2">300-500</option>
              <option value="option3">600-900</option>
              <option value="option4">1,000-2,000</option>
              <option value="option4">2,000-3,000+</option>
            </select>

            <button type="submit" className="findpilot-button">
              Find Pilot
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FindPilot;
