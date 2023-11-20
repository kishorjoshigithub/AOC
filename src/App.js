
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';
import Pricing from './components/Pricing';
import About from './components/About';
import './App.css';
import Features from './components/Features';
import Start from './components/Start';
import Steps from './components/Steps';
import DashboardHome from './components/DashboardHome';
import Integration from './components/Integration';
import Notification from './components/Notification';
import AddDomain from './components/AddDomain';
import UploadImage from './components/UploadImage';
import Users from './components/Users';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import UserDashboard from './components/UserDashboard';
import { useSelector } from 'react-redux';
function App() {
  const userData = useSelector((state) => state.user.userData);
  

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

          {userData && (
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
            </Route>
          )}


          {userData && userData.role === 'ADMIN_ROLE' && (
            <Route path="/Admin" element={<AdminDashboard />}>
              <Route path="uploadImage" element={<UploadImage />} />
              <Route path="users" element={<Users />} />
            </Route>
          )}
          <Route path='/unauthorized' element={<Unauthorized />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;