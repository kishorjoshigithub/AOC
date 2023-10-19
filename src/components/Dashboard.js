import React from 'react'
import './dashboard.css';
import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import Steps from './Steps';

const Dashboard = () => {
  return (
    <div className='dashboard-container'>
       <div className='sidebar'>
       <div className="wrapper">
    <div className="sidebar">
        <h2>Sidebar</h2>
        <ul>
            <li><NavLink  to='/dashboard'>DashboardHome</NavLink></li>
            <li><NavLink to='/dashboard/steps' >Steps</NavLink></li>
            <li><NavLink to='/dashboard/integration'>Web Integration</NavLink></li>
            <li><NavLink to='/dashboard/addDomain'>Add Domain</NavLink></li>
            <li><NavLink to='/dashboard/notification'>Send Notification</NavLink></li>
            <li><NavLink to='/Admin/uploadImage' >Upload Image</NavLink></li>
            <li><NavLink to='/Admin/users' >Users</NavLink></li>
        </ul> 
       
    </div>
    <div className="main_content">
        <div className="header">Welcome!! Have a nice day.</div>  
      <div className='card'>
        <div className='card-body'>
        <div className="info">
            <Outlet/>

            </div>
        </div>
      </div>
    </div>
</div>
       </div>
    </div>
  )
}

export default Dashboard
