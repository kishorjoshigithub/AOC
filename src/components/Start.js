import React, { useState } from 'react';
import './start.css';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../FirebaseConfig/Firebase';
import { getDatabase, ref, set } from 'firebase/database';
import CryptoJS from 'crypto-js'; // Import crypto-js library



const Start = () => {
    const navigate = useNavigate();

    // Define state for the Signup form
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

    // Function to hash the password using crypto-js
    const hashPassword = (password) => {
        const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        return hashedPassword;
    };

    // Function to handle Signup form submission
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (!signupState.username || !signupState.email || !signupState.password) {
            setSignupFormError(true);
            setSignupErrorMessage('Please fill out all fields');
            return; // Prevent submission if fields are missing
        }
    
        // Reset the error state
        setSignupFormError(false);
        setSignupErrorMessage('');
    
        try {
            // Hash the password using crypto-js
            const hashedPassword = hashPassword(signupState.password);
    
            const userCredential = await createUserWithEmailAndPassword(auth, signupState.email, hashedPassword);
            const user = userCredential.user;
            if (user) {
                // User is authenticated, you can navigate or perform other actions here
                console.log("User is authenticated:", user);
    
                // Create a unique user ID
                const userId = user.uid;
    
                // Add the user data (including 'role' and hashed password) to the Firebase Realtime Database
                const userRef = ref(db, 'users/' + userId);
                await set(userRef, {
                    username: signupState.username,
                    email: signupState.email,
                    role: 'USER_ROLE', // Set the initial role to 'user'
                    password: hashedPassword, // Store the hashed password
                });
    
                navigate('/start'); // Navigate after a successful signup
    
                // Clear the signup input fields
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

        try {

            const hashedLoginPassword = hashPassword(loginState.password);

            const userCredential = await signInWithEmailAndPassword(auth, loginState.email, hashedLoginPassword);
            const user = userCredential.user; // Get the authenticated user
            if (user) {
                // User is authenticated, you can navigate or perform other actions here
                console.log("User is authenticated:", user);
                navigate('/dashboard');
                // Clear the login input fields
                setLoginState({
                    email: '',
                    password: '',
                });
            }
        } catch (error) {
            console.error(error.message);
            setLoginErrorMessage('Login failed. Check your email and password.'); // Set a custom error message
        }
    };

    return (
        <div className='form-container'>
            <div className="main">
                <input type="checkbox" id="chk" aria-hidden="true" />

                <div className="signup">
                    <form  onSubmit={handleSignupSubmit}>
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
