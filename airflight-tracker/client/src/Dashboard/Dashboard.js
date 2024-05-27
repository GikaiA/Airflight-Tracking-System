import React from "react";
import "./Dashboard.css";
import carlton from "../images/carlton.gif";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

function Dashboard() {
  return (
    <div className="database">
      <p className="database-sentence"> YOU MADE IT TO THE DATABASE</p>
      <img src={carlton} alt="carlton-gif" className="carlton"></img>
      <Link to="/">
        <button className="logout-button">Log Out </button>
      </Link>
    </div>
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      // Replace 'userId' with actual user ID from somewhere like a global state or local storage
      const userId = 'your_user_id_here';
      axios.get(`/api/user/profile/${userId}`)
          .then(response => {
              setUser(response.data);
          })
          .catch(error => {
              console.error('Error fetching user profile:', error);
              // Handle error, maybe redirect if not authenticated
              navigate('/login');
          });
  }, [navigate]);

  return (
      <div className="database">
          <p className="database-sentence">YOU MADE IT TO THE DATABASE</p>
          <img src={carlton} alt="carlton-gif" className="carlton"/>
          {user ? (
              <div>
                  <h1>User Profile</h1>
                  <p>Username: {user.username}</p>
                  <p>Rank: {user.rank}</p>
                  <p>Flight Hours: {user.flightHours}</p>
              </div>
          ) : (
              <p>Loading user data...</p>
          )}
          <Link to="/">
              <button className="logout-button">Log Out</button>
          </Link>
      </div>
  );
}



{user && (
  <button onClick={() => navigate(`/edit-profile/${user._id}`)}>Edit Profile</button>
)}

export default Dashboard;
