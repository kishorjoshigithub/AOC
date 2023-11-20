import React, { useEffect, useState, useRef } from 'react';
import './card.css';
import { getDatabase, ref, set, get, update, Database, remove } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';

import CryptoJS from 'crypto-js';
import { createUserWithEmailAndPassword, deleteUser, getAuth, updateProfile } from 'firebase/auth';
import { auth } from '../FirebaseConfig/Firebase';

const Users = () => {
  const db = getDatabase();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showChangeRoleCard, setShowChangeRoleCard] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState(null);
  const [showAddUserCard, setShowAddUserCard] = useState(false);
  const [signupState, setSignupState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [signupFormError, setSignupFormError] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState('');

  const dropdownRef = useRef(null);

  const usersPerPage = 5;
  const totalUsers = users.length;
  const Roles = [
    { label: 'USER_ROLE', value: 'USER_ROLE' },
    { label: 'ADMIN_ROLE', value: 'ADMIN_ROLE' },
  ];

  useEffect(() => {
    const usersRef = ref(db, 'users');

    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = [];
          snapshot.forEach((childSnapshot) => {
            const userId = childSnapshot.key;
            const userData = childSnapshot.val();

            userData.userId = userId;

            usersData.push(userData);
          });
          setUsers(usersData);
        } else {
          console.log('No user data found in the database');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [db]);


  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.floor(totalUsers / usersPerPage))
    );
  };

  const startIndex = currentPage * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const usersToDisplay = users.slice(startIndex, endIndex);

  const toggleDropdown = (index) => {
    if (selectedDropdownIndex === index) {

      setSelectedDropdownIndex(null);
    } else {

      setSelectedDropdownIndex(index);

    }
  };

  const openChangeRoleCard = (user, userId) => {
    setShowChangeRoleCard(true);
    setSelectedRole({ label: user.role, value: user.role });
    setSelectedUser({ ...user, userId });
  };

  const AddUserCard = () => {
    setShowAddUserCard(true);
  }

  const closeAddUserCard = () => {
    setShowAddUserCard(false);

  };

  const changeRole = () => {
    if (selectedUser && selectedRole !== null) {
      const db = getDatabase();
      const userRef = ref(db, `users/${selectedUser.userId}`);

      update(userRef, { role: selectedRole.value })
        .then(() => {
          console.log(`Role updated to ${selectedRole.label} for user with UID: ${selectedUser.userId}`);
          const updatedUsers = users.map((user) => {
            if (user.userId === selectedUser.userId) {
              return { ...user, role: selectedRole.value };
            } else {
              return user;
            }
          });
          setUsers(updatedUsers);
          closeChangeRoleCard();
        })
        .catch((error) => {
          console.error('Error updating role:', error);
        });
    } else {
      console.error('Please select a user and a role');
    }
  };



  const closeChangeRoleCard = () => {
    setShowChangeRoleCard(false);
    setSelectedUser(null);
  };

  

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '4px',
    }),

    indicatorSeparator: () => ({}),
    dropdownIndicator: (defaultStyles) => ({
      ...defaultStyles,
      color: 'purple',
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: '30px',
    }),
  };


  const DeleteUser = async (user, userId) => {
    try {
      const auth = getAuth();

      console.log('Deleting user:', user);



    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };



  const hashPassword = (password) => {
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  };
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupState({
      ...signupState,
      [name]: value,
    });
  };
  const handleSignupSubmit = async (e) => {


    e.preventDefault();
    if (!signupState.username || !signupState.email || !signupState.password) {
      setSignupFormError(true);
      setSignupErrorMessage('Please fill out all fields');
      return;
    }


    setSignupFormError(false);
    setSignupErrorMessage('');

    try {



      const userCredential = await createUserWithEmailAndPassword(auth, signupState.email, signupState.password);
      const user = userCredential.user;
      if (user) {
        await updateProfile(user, { displayName: signupState.username });
        console.log("User is authenticated:", user);
        const userId = user.uid;
        const userRef = ref(db, 'users/' + userId);
        await set(userRef, {
          username: signupState.username,
          email: signupState.email,
          role: 'USER_ROLE',
          password: hashPassword(signupState.password),
        });



        setSignupState({
          username: '',
          email: '',
          password: '',
        });
        alert('User Added successfully');
        return;
      }
    } catch (error) {
      console.error(error.message);
      setSignupErrorMessage(error.message);
    }
  };


  return (
    <div className="container" style={{ position: 'fixed' }}>
      <div className="card">
        <button onClick={AddUserCard} style={{ width: '10%', borderRadius: '7px', marginLeft: 'auto', marginBottom: '7px', marginRight: '65px' }}>Add User</button>
        <form className="d-flex" style={{ width: '94%', marginLeft: '20px' }}>

          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
        </form>

        {(showChangeRoleCard || showAddUserCard) && <div className="overlay"></div>}

        <div className="table-container">
          <table className="table" style={{ marginLeft: '20px', marginTop: '20px' }}>
            <thead style={{ height: '7vh' }}>
              <tr className="table-header">
                <th style={{ background: 'transparent', color: 'skyblue' }}>Name</th>
                <th style={{ background: 'transparent', color: 'skyblue' }}>UserName</th>
                <th style={{ background: 'transparent', color: 'skyblue' }}>Roles</th>
                <th style={{ background: 'transparent', color: 'skyblue' }}>Actions</th>

              </tr>
            </thead>
            <tbody>
              {usersToDisplay.map((user, index) => (
                <tr key={index}>
                  <td style={{ background: 'transparent', color: 'white' }}>{user.username}</td>
                  <td style={{ background: 'transparent', color: 'white' }}>{user.email}</td>
                  <td style={{ background: 'transparent', color: 'white' }}>{user.role}</td>



                  <td style={{ background: 'transparent', color: 'white' }}>
                    <div className="dropdown-container" onClick={() => toggleDropdown(index)}>
                      <FontAwesomeIcon icon={faCog} />
                    </div>
                    {selectedDropdownIndex === index && (
                      <div ref={dropdownRef} className="dropdown-content">
                        <ul style={{ listStyle: 'none', padding: '2px', margin: '12px' }}>

                          <li>
                            <NavLink style={{ paddingLeft: '2' }} onClick={() => openChangeRoleCard(user, user.userId)} className="nav-link profile">
                              <FontAwesomeIcon icon={faUser} /> Change Role
                            </NavLink>
                          </li>
                          <li>
                            <NavLink style={{ paddingLeft: '2' }} className="nav-link profile">
                              <FontAwesomeIcon icon={faPlus} /> Add User
                            </NavLink>
                          </li>
                          <li>
                            <NavLink onClick={() => DeleteUser(user, user.userId)} style={{ paddingLeft: '2' }} className="nav-link profile">
                              <FontAwesomeIcon icon={faMinus} /> Delete Account
                            </NavLink>
                          </li>


                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showChangeRoleCard && (
          <div className='card change-role-card-container' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px solid skyblue', width: '35%', height: '40vh' }}>
            <div className='card-body'>
              <div className="row">
                <div className="col-md-4"></div>
                <div className='option-container' style={{ marginLeft: '100px' }}>
                  <div className="col-md-4" style={{ width: '50%' }}>
                    <Select styles={customStyles} className='change-role'
                      value={selectedRole}
                      onChange={(newValue) => setSelectedRole(newValue)} options={Roles} />
                  </div>
                </div>
                <div className="col-md-4"></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={changeRole} style={{ marginRight: '10px' }}>Done</button>
                <button onClick={closeChangeRoleCard}>Close</button>
              </div>
            </div>
          </div>
        )}




        {showAddUserCard && (
          <div className='card change-role-card-container' style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px solid skyblue', width: '60%', height: '70vh' }}>
            <div className='card-body'>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img style={{ width: '90px', height: '90px' }} src='https://icons.veryicon.com/png/o/brands/linear-icon-29/add-user-20.png' alt='add-user logo' />
              </div>
              <div className="signup" style={{ marginTop: '10px' }}>
                <form>

                  {signupFormError && <p style={{ color: 'red' }} className="error-message">{signupErrorMessage}</p>}
                  <input
                    style={{ margin: '2px auto' }}
                    type="text"
                    name="username"
                    placeholder="User name"
                    value={signupState.username}
                    onChange={handleSignupChange}
                  />
                  <input
                    style={{ margin: '2px auto' }}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={signupState.email}
                    onChange={handleSignupChange}
                  />
                  <input
                    style={{ margin: '2px auto' }}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signupState.password}
                    onChange={handleSignupChange}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={handleSignupSubmit} style={{ marginRight: '10px', width: '80%' }} type='button' className='btn btn-primary'>
                      Add
                    </button>
                    <button onClick={closeAddUserCard} style={{ width: '60%' }} type='button' className='btn btn-primary'>
                      Back
                    </button>

                  </div>
                </form>
              </div>




            </div>
          </div>
        )}

        <div className="pagination" style={{ padding: '20px' }}>
          <button
            className="btn btn-primary"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            style={{ marginLeft: '5px' }}
            className="btn btn-primary"
            onClick={goToNextPage}
            disabled={currentPage === totalUsers / usersPerPage - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
