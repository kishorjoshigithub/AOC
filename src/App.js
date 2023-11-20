import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';
import Pricing from './components/Pricing';
import About from './components/About';
import './App.css';
import Features from './components/Features';
import Start from './components/Start';
import Steps from './Dashboard-components/Steps';
import DashboardHome from './Dashboard-components/DashboardHome';
import Integration from './Dashboard-components/Integration';
import Notification from './Dashboard-components/Notification';
import AddDomain from './Dashboard-components/AddDomain';
import UploadImage from './Dashboard-components/UploadImage';
import Users from './Dashboard-components/Users';
import AdminDashboard from './Dashboard-components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import UserDashboard from './Dashboard-components/UserDashboard';
import {useDispatch, useSelector } from 'react-redux';
import Profile from './Dashboard-components/Profile';





function App() {


  const userData = useSelector((state) => state.user.userData);
  const authenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  
  
  
  
 
 
  return (
    <Router>

      <div className="App">
       
        <Navbar />
        
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/start" element={<Start />} />
          
          
        
          {userData ? (
            <Route
              path="/dashboard"
              element={
                userData.role === 'USER_ROLE' ? (
                  <ProtectedRoute element={<UserDashboard />} requiredRole="USER_ROLE" />
                ) : (
                  <ProtectedRoute element={<AdminDashboard />} requiredRole="ADMIN_ROLE" />
                )
              }
            >
              <Route path="app" element={<DashboardHome />} />
              <Route path="steps" element={<Steps />} />
              <Route path="integration" element={<Integration />} />
              <Route path="notification" element={<Notification />} />
              <Route path="addDomain" element={<AddDomain />} />
              <Route path="profile" element={<Profile />} />
              
            </Route>
          ) : (
            <Route path="/dashboard" element={<Navigate to="/404" />} />
          )}

          {userData && userData.role === 'ADMIN_ROLE' && !authenticated ? (
            <Route path="/admin" element={<Navigate to="/404" />} />
          ) : (
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="uploadImage" element={<UploadImage />} />
              <Route path="users" element={<Users />} />
            </Route>
          )}

          <Route path='/404' element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
       

      </div>
      

      
     
     
    
     


    </Router>

  );
}


export default App;
