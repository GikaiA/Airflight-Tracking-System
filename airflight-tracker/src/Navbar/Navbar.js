import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import airforcelogononame from '../images/airforcelogo-noname.png';

function Navbar() {
  return (
    <div className='navbar'>
      <img src={airforcelogononame} alt='airforce-logo' className='navbar-logo'></img>
                <ul className='navbar-menu'>
            <li className='navbar-item'>
                <Link to='/'>Home</Link>
            </li>
            <li className='navbar-item'>
                <Link to='/login'>Login</Link>
            </li>
        </ul>
    </div>
  )
}

export default Navbar
