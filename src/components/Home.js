import React from 'react';
import './home.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/Actions/userActions';

const Home = () => {
  const authenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  if (authenticated) {
    dispatch(logout());
  }
  return (
    <div className='home-container'>
      <div className='home-content'>
      <h2>Welcome </h2>
      </div>
      
    </div>
  )
}

export default Home
