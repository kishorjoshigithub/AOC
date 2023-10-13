import React from "react";
import { Link } from "react-router-dom";
import './Nav.css';


const Navbar = () => {
    return (

       
        <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">AOS</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">HOME</a>
              </li>
            </ul>
           <button type="btn" className="btn">LOGIN</button>
           <button type="btn" className="btn btn-primary">SIGNUP</button>
          </div>
        </div>
      </nav>
       

    )
}

export default Navbar;


