import React from 'react'
import './dashboard.css';
import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import Steps from './Steps';
import Img from '../img/logo-img.png'

const UserDashboard = () => {
  return (
    <div className='dashboard-container'>
       <div className='sidebar'>
       <div className="wrapper">
    <div className="sidebar">
            <img className='logo' src={Img} alt='logo'></img>
        
        <ul>
           <div className='dash-links'>
           <li><NavLink  to='/dashboard'>DashboardHome</NavLink></li>
            <li><NavLink to='/dashboard/steps' >Steps</NavLink></li>
            <li><NavLink to='/dashboard/integration'>Web Integration</NavLink></li>
            <li><NavLink to='/dashboard/addDomain'>Add Domain</NavLink></li>
            <li><NavLink to='/dashboard/notification'>Send Notification</NavLink></li>
            <li><NavLink to='/Admin/uploadImage' >Upload Image</NavLink></li>
            <li><NavLink to='/Admin/users' >Users</NavLink></li>
           </div>
        </ul> 
       
    </div>
    <div className="main_content">
        <div className="header"></div>  
      
        <div className="info">
            <Outlet/>

            </div>
        </div>
      </div>
    </div>
</div>
      
  )
}

export default UserDashboard
