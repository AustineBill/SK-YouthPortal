import React, { useEffect, useState, useRef } from 'react';
import {Link } from 'react-router-dom';



const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    const toggleDropdown = () => {
      setIsDropdownOpen(prev => !prev);
    };
  
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    return (
      <div className="container-fluid sticky-top">
        <nav className="navbar navbar-expand-lg bg-white">
          <Link to="/" className="navbar-brand">
            <h2 className="Website-Name" style={{ fontFamily: "'Sansita Swashed', cursive" }}>SK Youth</h2>
          </Link>
  
          <div className="navbar-nav ms-4 align-items-center">
            
            
            <div className="nav-item" ref={dropdownRef}>
              <span 
                className="nav-link dropdown-toggle" 
                onClick={toggleDropdown} 
                style={{ cursor: 'pointer' }}
              >
                About Us
              </span>
              {isDropdownOpen && (
                <div className="dropdown-menu" s>
                  <Link className="dropdown-item" to="/about" style={{ display: 'block', padding: '8px 16px' }}>About Us Overview</Link>
                  <Link className="dropdown-item" to="/mandate" style={{ display: 'block', padding: '8px 16px' }}>Mandate</Link>
                  <Link className="dropdown-item" to="/youth" style={{ display: 'block', padding: '8px 16px' }}>Youth</Link>
                  <Link className="dropdown-item" to="/council" style={{ display: 'block', padding: '8px 16px' }}>Council</Link>
                </div>
              )}
            </div>
            
            <Link className="nav-item nav-link" to="/program_details">Programs</Link>
            <Link className="nav-item nav-link" to="/contactus">Contact Us</Link>
          </div>
  
          <Link className="login-button btn btn-outline-dark ms-auto" to="/login">Log In</Link>
          <Link className="signup-button btn btn-primary ms-2" to="/signup">Sign Up</Link>
        </nav>
      </div>
    );
  };


export default Navbar;
  