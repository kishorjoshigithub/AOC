import React, { useEffect, useState } from 'react';
import './start.css';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { app } from '../FirebaseConfig/Firebase';
import { get, getDatabase, ref, set } from 'firebase/database';
import CryptoJS from 'crypto-js'; 
import { useDispatch, useSelector } from 'react-redux';
import { login, logout,setUserData } from '../redux/Actions/userActions';






const Start = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const authenticated = useSelector((state) => state.auth.isAuthenticated);


  

    const [signupState, setSignupState] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [signupFormError, setSignupFormError] = useState(false);
    const [signupErrorMessage, setSignupErrorMessage] = useState('');

    // Define state for the Login form
    const [loginState, setLoginState] = useState({
        email: '',
        password: '',
    });
    const [loginFormError, setLoginFormError] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');

    // Initialize Firebase Auth and Database
    const auth = getAuth(app);
    const db = getDatabase(app);

    // Function to handle changes in the Signup form
    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupState({
            ...signupState,
            [name]: value,
        });
    };

    // Function to handle changes in the Login form
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginState({
            ...loginState,
            [name]: value,
        });
    };
    const hashPassword = (password) => {
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        return hashedPassword;
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
                navigate('/start'); 

                
                setSignupState({
                    username: '',
                    email: '',
                    password: '',
                });
            }
        } catch (error) {
            console.error(error.message);
            setSignupErrorMessage(error.message);
        }
    };

    // Function to handle Login form submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!loginState.email || !loginState.password) {
            setLoginFormError(true);
            setLoginErrorMessage('Please fill out all fields');
            return; // Prevent submission if fields are missing
        }

        // Reset the error state
        setLoginFormError(false);
        setLoginErrorMessage('');
        console.log('Before authentication', authenticated);

        try {
           
            const userCredential = await signInWithEmailAndPassword(auth, loginState.email, loginState.password);
            const user = userCredential.user;

            if (user) {
                const username = user.username;
                const userId = user.uid;
                const userRef = ref(db, 'users/' + userId);
                const snapshot = await get(userRef);
                const userDataFromDatabase = snapshot.val();
                console.log("User is authenticated:", user);

                if (userDataFromDatabase) {

                    dispatch(
                        setUserData({
                            role: userDataFromDatabase.role,
                            username: userDataFromDatabase.username,
                            email: userDataFromDatabase.email,
                        })
                    );
                    if (userDataFromDatabase.username) {
                        updateProfile(user, { displayName: userDataFromDatabase.username });
                    }

                    dispatch(login());

                    navigate('/dashboard/app');
                }
            }
        } catch (error) {
            console.error(error.message);
            setLoginErrorMessage('Login failed. Check your email and password.');
        }
    };

    useEffect(() => {
        if (authenticated && location.pathname === '/start') {
            
            const delayLogout = setTimeout(() => {
                dispatch(logout());
            }, 100); 
            return () => clearTimeout(delayLogout);
        }
    }, [authenticated, dispatch, navigate, location]);


    

    return (
        <div className='form-container'>
            <div className="main">
                <input type="checkbox" id="chk" aria-hidden="true" />

                <div className="signup">
                    <form onSubmit={handleSignupSubmit}>
                        <label htmlFor="chk" aria-hidden="true">Sign up</label>
                        {signupFormError && <p className="error-message">{signupErrorMessage}</p>}
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
                        <button style={{ margin: '2px auto' }}>Sign up</button>
                    </form>
                </div>

                <div className="login">
                    <form onSubmit={handleLoginSubmit}>
                        <label htmlFor="chk" aria-hidden="true">Login</label>
                        {loginFormError && <p className="error-message">{loginErrorMessage}</p>}
                        <input
                            style={{ margin: '2px auto' }}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginState.email}
                            onChange={handleLoginChange}
                        />
                        <input
                            style={{ margin: '2px auto' }}
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginState.password}
                            onChange={handleLoginChange}
                        />
                        <button style={{ margin: '2px auto' }}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
   
   
    
   
  

}

export default Start;
