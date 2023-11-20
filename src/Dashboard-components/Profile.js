import React, { useEffect, useState } from 'react';
import './card.css';
import {
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  updateEmail as updateAuthEmail,
  verifyBeforeUpdateEmail,
  onIdTokenChanged,
  updateProfile,
} from 'firebase/auth';
import { get, getDatabase, ref, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();



  const [userData, setUserData] = useState({
    name: null,
    username: null,
    email: null,
  });


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User is signed in:', user);
        const userRef = ref(db, 'users/' + user.uid);
        const snapshot = await get(userRef);
        const userDataFromDB = snapshot.val();

        const displayName = auth.currentUser.displayName;
        const email = user.email;
     
        setUserData({
          name: displayName,
          email: email,
          username: email,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setUserData]);



  const handleUpdateEmail = async (newEmail, currentPassword) => {
    const user = auth.currentUser;

    try {
     
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      

     
      const isNewEmailVerified = await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

      if (!isNewEmailVerified) {
        const shouldVerify = window.confirm('This is not a verified email. Do you want to verify it?');

        if (shouldVerify) {
          
          await sendEmailVerification(auth.currentUser, {
            url: 'https://adviceonclick-74934.firebaseapp.com/__/auth/action',
          });
          alert(
            'Verify your new email by clicking on the verification link sent to your new email address before clicking OK'
          );
         

          
          const updateEmailPromise = new Promise(async (resolve) => {
          
            const unsubscribe = onIdTokenChanged(auth, (updatedUser) => {
              if (updatedUser && updatedUser.emailVerified) {
                unsubscribe();
                resolve();
              }
            });
          });

          
          await updateEmailPromise;
         
          return; 
        } else {
          alert('Email update canceled. Please verify your new email to complete the update.');
          return;
        }
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Update failed. Please make sure your password is correct.');
    }
  };
  const ProfileUpdate = async () => {
 
    
    setUserData({
      name: userData.name,
      username: userData.username,
      email: userData.email,
    });
  
    const user = auth.currentUser;
  
    try {
      
      await updateProfile(user, { displayName: userData.name });
  
     
      const userRef = ref(db, 'users/' + user.uid);
      await update(userRef, {
        username: userData.name,
      });
  
      alert('Profile Name updated successful');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profile Name update failed');
    }
  };
  

  const handleUpdate = async () => {
    const user = auth.currentUser;

    const currentPassword = window.prompt('Please enter your current password:');

    if (currentPassword === null) {
      return;
    }

    try {
    const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  const isCorrectPassword = await reauthenticateWithCredential(user, credential);
  if(isCorrectPassword){
    console.log('Correct Password');
  }
  else{
    console.log('Incorrect Password');
  }



  
  const newEmail = window.prompt('Please enter your new email:');


      if (newEmail === null) {
        return;
      }



      await handleUpdateEmail(newEmail, currentPassword);

      if(isCorrectPassword){
      const reauthCredential = EmailAuthProvider.credential(newEmail, currentPassword);
      await reauthenticateWithCredential(user, reauthCredential);
      console.log('Reauthentication with updated email successful');

      await updateAuthEmail(user, newEmail);
      console.log('Email update successful');

      const userRef = ref(db, 'users/' + user.uid);
      await update(userRef, {
        email: newEmail,
       
      });
      setUserData({ ...userData,
        email: newEmail,
        username:newEmail,
      });

      alert('Update successful');

    } 
  }
    catch (error) {
      console.error('Email Not Verified');
      alert('Update failed');
    }
  };



   

  return (
    <div>
      <div className="card profile" style={{ height: '90vh', width: '99%', position: 'fixed' }}>
        <div className='prof' style={{ width: '50%', height: '90vh' }}>
          <div className='profile-image' style={{ marginLeft: '300px' }}>
            <img
                          src="https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"
                          alt="Default User Image"
                          width="150"
                          height="150"
                        />
                      </div>

                      <div className='input-fields'>
                      <input style={{marginBottom:'15px',borderRadius:'10px'}}
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={userData.name || ''}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        placeholder='Name'
                      />
                      <input style={{marginBottom:'15px',borderRadius:'10px'}}
                        type="email"
                        className="form-control"
                        id="usernamename"
                        name="username"
                        value={userData.username || ''}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        placeholder='username'
                        
                      />
                      <input style={{marginBottom:'15px',borderRadius:'10px'}}
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={userData.email || ''}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        placeholder='email'
                        readOnly
                        
                      />


              </div>
                      <div className='buttons' style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                        <button onClick={handleUpdate} style={{ marginRight: '10px', width: '30%' }} type='button' className='btn btn-primary'>
                          Email Update
                        </button>
                        <button onClick={ProfileUpdate} style={{ marginRight: '10px', width: '30%' }} type='button' className='btn btn-primary'>
                          Profile Update
                        </button>
                        <button onClick={() => navigate(-1)} style={{ width: '20%' }} type='button' className='btn btn-primary'>
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            };
            
            export default Profile;