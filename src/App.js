
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';
import Pricing from './components/Pricing';
import About from './components/About';
import './App.css';
import Features from './components/Features';
import Start from './components/Start';


function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar should be rendered outside of the <Routes> */}
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/start" element={<Start />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
