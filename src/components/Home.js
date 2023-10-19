import React from 'react';
import './home.css';

const Home = (props) => {
  return (
    <div className='home-container'>
      <div className='home-content'>
      <h2>Welcome {props.name}</h2>
      </div>
      
    </div>
  )
}

export default Home
