import React, { useEffect, useState } from 'react';
import { NavLink,useLocation } from 'react-router-dom';
import './nav.css';
import logo from '../img/logo-img.png';

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const shouldRenderNavbar = !location.pathname.startsWith('/dashboard')
   && !location.pathname.startsWith('/admin')&& 
   !location.pathname.startsWith('/404');

  return (
    <div className='nav-container'>
      {shouldRenderNavbar && (  
        <nav className={`navbar navbar-expand-lg ${scrolling ? 'scrolling' : ''}`}>
          <div className="container-fluid">
            <div className="logo-container">
              <NavLink to='/'>
                <img className="img-logo" src={logo} alt="logo" />
              </NavLink>
            </div>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink to='/' className="nav-link active" aria-current="page">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/services' className="nav-link active" aria-current="page">Services</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/features' className="nav-link active" aria-current="page">Features</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/pricing' className="nav-link active" aria-current="page">Pricing</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to='/about' className="nav-link active" aria-current="page">About</NavLink>
                </li>
              </ul>
            </div>
            <div className='btn-container'>
              <NavLink to="/start">
                <button className="btn btn-outline-primary circular-button">GO</button>
              </NavLink>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
