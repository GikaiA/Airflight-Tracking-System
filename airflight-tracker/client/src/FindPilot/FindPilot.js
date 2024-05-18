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
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
              <option value="option4">Option 4</option>
              <option value="option5">Option 5</option>
              <option value="option6">Option 6</option>
              <option value="option7">Option 7</option>
              <option value="option8">Option 8</option>
              <option value="option9">Option 9</option>
            </select>

            <label htmlFor="dropdown2" className="dropdown-title">
              Total Flight Hours
            </label>
            <select id="dropdown2" name="dropdown2">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>

            <label htmlFor="dropdown3" className="dropdown-title">
              NVG Hours
            </label>
            <select id="dropdown3" name="dropdown3">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>

            <label htmlFor="dropdown4" className="dropdown-title">
             Flight Hours
            </label>
            <select id="dropdown4" name="dropdown3">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
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
