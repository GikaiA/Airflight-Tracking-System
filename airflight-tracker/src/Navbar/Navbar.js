import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className='navbar'>
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
