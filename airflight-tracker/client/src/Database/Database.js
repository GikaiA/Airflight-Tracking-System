import React from 'react';
import './Database.css';
import carlton from '../images/carlton.gif'
import { useNavigate, Link } from 'react-router-dom';

function Database() {
 // const handleSignOut = async () => {
  //   try {
  //     await supabase.auth.signOut();
  //     navigate('/')
  //   } catch (error) {
  //     console.error("Error signing out:", error.message);
  //   }
  // };


  return (
    <div className='database-section'>
     <p className='database-sentence'> YOU MADE IT TO THE DATABASE</p> 
     <img src={carlton} alt='carlton-gif' className='carlton'></img>
     <Link to = '/'><button className='logout-button'>Log Out </button></Link>
    </div>
  )
}

export default Database
