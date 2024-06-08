import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import airforcelogononame from '../images/airforcelogo-noname.png';
import { AuthContext } from '../Context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setError('User is not authenticated. Please log in.');
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/user/profile/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setUserData(null);
    navigate('/');
  };

  return (
    <div className='navbar'>
      <Link to='/'>
        <img
          src={airforcelogononame}
          alt='airforce-logo'
          className='navbar-logo'
        />
      </Link>
      <ul className='navbar-menu'>
        <li className='navbar-item'>
          <Link to='/about' className='navbar-text'>
            About
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li className='navbar-item'>
              <Link to='/findapilot' className='navbar-text'>
                Find a Pilot
              </Link>
            </li>
            <li className='navbar-item'>
              <Link to='/search' className='navbar-text'>
                Search
              </Link>
            </li>
          </>
        )}
        <li className='navbar-item'>
          {isAuthenticated ? (
            <button className='logout-button' onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <button className='login-button'>
              <Link to='/login' className='login-text'>Log In</Link>
            </button>
          )}
        </li>
      </ul>
      {error && <p className='error-text'>{error}</p>}
    </div>
  );
}

export default Navbar;
