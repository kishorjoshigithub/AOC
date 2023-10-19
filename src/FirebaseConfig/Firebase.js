import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAluy7ZCUrUoL4ZMEgyAjGnkDjTnH-tB00",
  authDomain: "adviceonclick-74934.firebaseapp.com",
  projectId: "adviceonclick-74934",
  storageBucket: "adviceonclick-74934.appspot.com",
  messagingSenderId: "56859486912",
  appId: "1:56859486912:web:55d700a5a9552413315b25",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
