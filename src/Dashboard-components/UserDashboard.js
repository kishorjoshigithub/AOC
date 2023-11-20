import React, { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Img from '../img/logo-img.png';
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faGlobe, faPlus, faBell, faUser, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import the icons you want to use
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/Actions/userActions';
import { getAuth, updatePassword } from 'firebase/auth';

const UserDashboard = () => {
  const authenticated = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  console.log('user');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordChangeVisible, setPasswordChangeVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
 

  const Logout = async () => {
    await dispatch(logout());
    navigate('/start');

  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const togglePasswordChange = () => {
    setPasswordChangeVisible(!isPasswordChangeVisible);
  };
  const closeChangePasswordCard = () => {
    setPasswordChangeVisible(false);
  };

  const changePassword = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      
      await updatePassword(user, newPassword);
      alert('Password changed successfully');
      togglePasswordChange();
    } catch (error) {
      console.error('Error changing password:', error);
     
    }
  }



  const handleLogOut = async () => {
    await dispatch(logout());
  }

  if (authenticated && userData.role === 'USER_ROLE') {
    return (
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="wrapper">
        
            <div className="card-container" style={{position:'fixed'}}>
              <div className='card' style={{ height: '100vh' }}>
                <div className='card-body'>
                  <img className="logo" src={Img} alt="logo" />
                  <ul>
                    <div className="dash-links">
                      <li>
                        <NavLink className='nav-link' to="/dashboard/app">
                          <FontAwesomeIcon icon={faHome} /> Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className='nav-link' to="/dashboard/steps">
                          <FontAwesomeIcon icon={faList} /> Steps
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className='nav-link' to="/dashboard/integration">
                          <FontAwesomeIcon icon={faGlobe} /> Integration
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className='nav-link' to="/dashboard/addDomain">
                          <FontAwesomeIcon icon={faPlus} /> Add Domain
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className='nav-link' to="/dashboard/notification">
                          <FontAwesomeIcon icon={faBell} /> Notification
                        </NavLink>
                      </li>
                    </div>
                  </ul>
                </div>
                </div>
              </div>
         
            <div className="main_content">
              <div className="header">
                <div className="header-right" style={{ float: 'right', marginRight: '200px' }}>
                  <div className="dropdown" style={{ position: 'absolute' }}>
                    <div className="dots" onClick={toggleDropdown}>
                      <span className='dot' style={{ color: "white", fontSize: '24px' }}>&#8942;</span>
                    </div>
                    {isDropdownOpen && (
                      <div className="dropdown" style={{ padding: '10px', height: '25vh' }}>
                        <div className='card' style={{ height: '25vh', marginRight: '20px' }}>
                          <div className='card-body'>
                            <ul>

                              <li>
                                <NavLink className="nav-link" style={{ color: 'white', padding: '5px' }} to='/dashboard/profile' >
                                  <FontAwesomeIcon icon={faUser} /> Profile
                                </NavLink>
                              </li>
                              <li>
                                <span
                                  className="nav-link"
                                  style={{ color: 'white', padding: '5px', cursor: 'pointer' }}
                                  onClick={togglePasswordChange}
                                >
                                  <FontAwesomeIcon icon={faKey} /> Password
                                </span>
                              </li>
                              <li>
                                <NavLink onClick={Logout} className="nav-link" style={{ color: 'white', padding: '5px' }} >
                                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                </NavLink>
                              </li>

                            </ul>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="info" >
                <Outlet />
              </div>
              {isPasswordChangeVisible &&  (
                <div className="card password-change-card" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-30%, -80%)', border: '1px solid skyblue', width: '35%', height: '40vh' }}>
                  <div className='card-body' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="form-group" style={{ marginBottom: '50px' }}>
                      <label htmlFor="newPassword" style={{ marginBottom: '5px', marginLeft: '0', fontSize: '25px' }}>New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        placeholder="Password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                       
                        
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button onClick={changePassword} style={{ marginRight: '10px', width: '30%', borderRadius: '10px' }}>Change</button>
                      <button onClick={closeChangePasswordCard} style={{ marginRight: '10px', width: '30%', borderRadius: '10px' }}>Close</button>
                    </div>
                  </div>
                </div>

              )}

            </div>

          </div>
        </div>
      </div>
    )
  } else {
    return <Navigate to='/404' />;
  }
};

export default UserDashboard;
