import React from 'react';
import './Homepage.css';
import airforcewallpaper from '../images/airforcewallpaper.jpg'

function Homepage() {
  return (
    <div className='homepage'>
        <img src={airforcewallpaper} alt='airforce-wallpaper' className='airforce-wallpaper'></img>
    </div>
  )
}

export default Homepage
