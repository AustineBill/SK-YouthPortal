import React from 'react';
import './Navbar.css';
import './css/NavBar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="path/to/your/logo.png" alt="Logo" />
      </div>
      <div className="navbar-links">
        <a href="#about">About Us</a>
        <a href="#facilities">Facilities</a>
        <a href="#contact">Contact Us</a>
      </div>
      <div className="navbar-signup">
        <button>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
