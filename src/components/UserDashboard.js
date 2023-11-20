import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Img from '../img/logo-img.png';
import './dashboard.css';
import { useSelector } from 'react-redux';


const UserDashboard = () => {
 
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="wrapper">
          <div className="sidebar">
            <img className="logo" src={Img} alt="logo" />
            <ul>
              <div className="dash-links">
                <li><NavLink to="/dashboard/app">Dashboard</NavLink></li>
                <li><NavLink to="/dashboard/steps">Steps</NavLink></li>
                <li><NavLink to="/dashboard/integration">Website Integration</NavLink></li>
                <li><NavLink to="/dashboard/addDomain">Add Domain</NavLink></li>
                <li><NavLink to="/dashboard/notification">Send Notification</NavLink></li>
               
              </div>
            </ul>
          </div>
          <div className="main_content">
            <div className="header"></div>
            <div className="info">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;