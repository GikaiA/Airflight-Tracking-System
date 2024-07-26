import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindPilot.css";

function FindPilot() {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [recommendedPilots, setRecommendedPilots] = useState([]);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedMissions = async () => {
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(
          `http://localhost:3000/api/user/recommendedMissions/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }

        const data = await response.json();
        setMissions(data);
      } catch (error) {
        console.error("Error fetching missions:", error);
      }
    };

    fetchRecommendedMissions();
  }, []);

  const handleMissionClick = async (mission) => {
    setSelectedMission(mission);
    setSelectedPilot(null); // Reset selected pilot when a new mission is selected
    try {
      const userId = localStorage.getItem("userId");
      console.log("Mission ID:", mission._id, "User ID:", userId); // Debugging information
      const response = await fetch("http://localhost:3000/api/user/findPilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ missionId: mission._id, userId }), // Include userId
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      console.log("Recommended Pilots:", data.pilots); // Debugging information
      setRecommendedPilots(data.pilots);
    } catch (error) {
      console.error("Error fetching pilot data:", error);
    }
  };

  const handlePilotClick = (pilot) => {
    setSelectedPilot(pilot);
  };

  const handleAcceptMission = async (userId, missionId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/acceptMission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            missionId,
            copilotId: selectedPilot._id,
          }), // Include copilotId
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error(errorData.message || "Failed to process request");
      }

      const data = await response.json();
      console.log("Mission accepted:", data);

      // Redirect to dashboard with message
      navigate(
        `/dashboard?message=Mission accepted with Pilot ${selectedPilot.username}`
      );
    } catch (error) {
      console.error("Error accepting mission:", error);
    }
  };

  return (
    <div className="findpilot">
      <h1 className="findpilot-title">Find a Pilot</h1>
      {!selectedMission ? (
        <div className="missions">
          {missions.map((mission) => (
            <div
              key={mission._id}
              className="mission-card"
              onClick={() => handleMissionClick(mission)}
            >
              <h3>{mission.aircraft}</h3>
              <p>
                <strong>Duration:</strong> {mission.duration_hours} hours
              </p>
              <p>
                <strong>Destination:</strong> {mission.destination}
              </p>
              <p>
                <strong>Type:</strong> {mission.mission_type}
              </p>
              <p>
                <strong>Specific Mission:</strong> {mission.specific_mission}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="selected-mission">
          <h2>Mission Details</h2>
          <p>
            <strong>Aircraft:</strong> {selectedMission.aircraft}
          </p>
          <p>
            <strong>Duration:</strong> {selectedMission.duration_hours} hours
          </p>
          <p>
            <strong>Destination:</strong> {selectedMission.destination}
          </p>
          <p>
            <strong>Type:</strong> {selectedMission.mission_type}
          </p>
          <p>
            <strong>Specific Mission:</strong>{" "}
            {selectedMission.specific_mission}
          </p>

          <h2>Recommended Pilots</h2>
          {recommendedPilots.length > 0 ? (
            <div className="cards">
              {recommendedPilots.map((pilot) => (
                <div
                  key={pilot._id}
                  className={`card ${
                    selectedPilot && selectedPilot._id === pilot._id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handlePilotClick(pilot)}
                >
                  <div className="card-body">
                    <h3 className="card-title">{pilot.username}</h3>
                    <p className="card-text">
                      <strong>Email:</strong> {pilot.email}
                    </p>
                    <p className="card-text">
                      <strong>Rank:</strong> {pilot.rank || "N/A"}
                    </p>
                    <p className="card-text">
                      <strong>NVG Hours:</strong> {pilot.nvg_hours || "N/A"}
                    </p>
                    <p className="card-text">
                      <strong>Total Flight Hours:</strong>{" "}
                      {pilot.total_flight_hours || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No pilots found</p>
          )}
          <div className="buttons">
            {selectedPilot && (
              <button
                onClick={() =>
                  handleAcceptMission(
                    localStorage.getItem("userId"),
                    selectedMission._id
                  )
                }
                className="accept-button"
              >
                Accept Mission with {selectedPilot.username}
              </button>
            )}

            <button
              onClick={() => setSelectedMission(null)}
              className="back-button"
            >
              Back to Missions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindPilot;
