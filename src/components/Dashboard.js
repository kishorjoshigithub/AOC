import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Img from '../img/logo-img.png';
import { useSelector } from 'react-redux';
import './dashboard.css';


const Dashboard = () => {
  const userData = useSelector((state) => state.user.userData);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="wrapper">
          <div className="sidebar">
            <img className="logo" src={Img} alt="logo" />
            <ul>
              <div className="dash-links">
                <li><NavLink to="/dashboard/app">DashboardHome</NavLink></li>
                <li><NavLink to="/dashboard/steps">Steps</NavLink></li>
                <li><NavLink to="/dashboard/integration">Web Integration</NavLink></li>
                <li><NavLink to="/dashboard/addDomain">Add Domain</NavLink></li>
                <li><NavLink to="/dashboard/notification">Send Notification</NavLink></li>
                <li><NavLink to="/Admin/uploadImage">Upload Image</NavLink></li>
                <li><NavLink to="/Admin/users">Users</NavLink></li>
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



export default Dashboard;
