import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [rank, setRank] = useState('');
  const [totalFlightHours, setTotalFlightHours] = useState('');
  const [nvgHours, setNvgHours] = useState('');
  const [aircraftQualification, setAircraftQualification] = useState([]);
  const [trainingCompleted, setTrainingCompleted] = useState([]);
  const [languageProficiency, setLanguageProficiency] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [dropdowns, setDropdowns] = useState({
    aircraft: false,
    training: false,
    language: false,
  });

  const aircraftQualificationOptions = [
    'No Selection', 'KC-10 Extender', 'KC-46A Pegasus', 'KC-135 Stratotanker',
    'C-5 Galaxy', 'C-17 Globemaster III', 'C-20', 'C-21', 'C-32', 'C-37A/B', 'C-40B/C',
    'C-130 Hercules', 'HC-130J Combat King II', 'HC-130P/N King', 'MC-130H Combat Talon II', 'VC-25 Air Force One'
  ];

  const trainingCompletedOptions = [
    'No Selection', 'Private Pilot License (PPL)', 'Commercial Pilot License (CPL)', 'Airbus A330 Multi Role Tanker Transport (MRTT)',
    'C-130 Hercules Initial Qualification Course', 'Boeing 767 Type Rating', 'KC-135 Stratotanker Type Rating',
    'Aerial Refueling Course', 'Combat Airlift Course', 'Advanced Aircraft Maneuvering Program (AAMP)', 'Emergency Response Training'
  ];

  const languageProficiencyOptions = [
    'No selection', 'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Portuguese', 'Arabic', 'Hindi'
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setEmail(data.email || '');
        setRank(data.rank || '');
        setTotalFlightHours(data.total_flight_hours || '');
        setNvgHours(data.nvg_hours || '');
        setAircraftQualification(data.aircraft_qualification || []);
        setTrainingCompleted(data.training_completed || []);
        setLanguageProficiency(data.language_proficiency || []);
        setProfileImage(data.profile_image || null);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCheckboxChange = (setState, currentState, value) => {
    if (currentState.includes(value)) {
      setState(currentState.filter(item => item !== value));
    } else {
      setState([...currentState, value]);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3000/api/user/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setProfileImage(data.imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('Email cannot be empty');
      return;
    }

    const userId = localStorage.getItem("userId");
    const updateData = {
      email,
      rank,
      total_flight_hours: totalFlightHours,
      nvg_hours: nvgHours,
      aircraft_qualification: aircraftQualification,
      training_completed: trainingCompleted,
      language_proficiency: languageProficiency,
      profile_image: profileImage,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      localStorage.setItem("updateMessage", "Profile updated successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const toggleDropdown = (section) => {
    setDropdowns(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Rank:
          <input type="text" value={rank} onChange={(e) => setRank(e.target.value)} />
        </label>
        <label>
          Total Flight Hours:
          <input type="number" value={totalFlightHours} onChange={(e) => setTotalFlightHours(e.target.value)} />
        </label>
        <label>
          NVG Hours:
          <input type="number" value={nvgHours} onChange={(e) => setNvgHours(e.target.value)} />
        </label>
        <label>
          Profile Image:
          <input type="file" onChange={handleImageUpload} />
          {profileImage && <img src={profileImage} alt="Profile" className="profile-image-preview" />}
        </label>
        <label>
          Aircraft Qualification:
          <div className={`dropdown ${dropdowns.aircraft ? 'active' : ''}`}>
            <div className="dropdown-header" onClick={() => toggleDropdown('aircraft')}>
              Select Aircraft Qualification <span className={`arrow ${dropdowns.aircraft ? 'up' : 'down'}`}></span>
            </div>
            <div className="dropdown-options">
              {aircraftQualificationOptions.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={aircraftQualification.includes(option)}
                    onChange={() => handleCheckboxChange(setAircraftQualification, aircraftQualification, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </label>
        <label>
          Training Completed:
          <div className={`dropdown ${dropdowns.training ? 'active' : ''}`}>
            <div className="dropdown-header" onClick={() => toggleDropdown('training')}>
              Select Training Completed <span className={`arrow ${dropdowns.training ? 'up' : 'down'}`}></span>
            </div>
            <div className="dropdown-options">
              {trainingCompletedOptions.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={trainingCompleted.includes(option)}
                    onChange={() => handleCheckboxChange(setTrainingCompleted, trainingCompleted, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </label>
        <label>
          Language Proficiency:
          <div className={`dropdown ${dropdowns.language ? 'active' : ''}`}>
            <div className="dropdown-header" onClick={() => toggleDropdown('language')}>
              Select Language Proficiency <span className={`arrow ${dropdowns.language ? 'up' : 'down'}`}></span>
            </div>
            <div className="dropdown-options">
              {languageProficiencyOptions.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={languageProficiency.includes(option)}
                    onChange={() => handleCheckboxChange(setLanguageProficiency, languageProficiency, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </label>
        <button type="submit" className="update-button">Update Profile</button>
        <button type="button" className="back-button" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </form>
    </div>
  );
};

export default EditProfile;
