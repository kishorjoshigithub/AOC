
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';
import Pricing from './components/Pricing';
import About from './components/About';
import './App.css';
import Features from './components/Features';
import Start from './components/Start';
import Dashboard from './components/Dashboard';
import Steps from './components/Steps';
import DashboardHome from './components/DashboardHome';
import Integration from './components/Integration';
import Notification from './components/Notification';
import AddDomain from './components/AddDomain';
import UploadImage from './components/UploadImage';
import Users from './components/Users';
import Admin from './components/Admin';


function App() {
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



          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="steps" element={<Steps />} />
            <Route path="integration" element={<Integration />} />
            <Route path="notification" element={<Notification />} />
            <Route path="addDomain" element={<AddDomain />} />
          </Route>

          <Route path="/Admin" element={<Admin />}>
            <Route path="uploadImage" element={<UploadImage />} />
            <Route path="users" element={<Users />} />
          </Route>







        </Routes>
      </div>
    </Router>
  );
}

export default App;