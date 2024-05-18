import React from 'react';
import './Search.css';

function Search() {
  return (
    <div className='search'>
       <div className='search-field-section'>
        <input type='text' className='search-field' placeholder='Search for a Pilot...'></input>
        <div className='search-button-section'>
          <button className='search-button'>
            Search
          </button>
        </div>
        </div> 
    </div>
  )
}

export default Search
