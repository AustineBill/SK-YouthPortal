import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Dropdown } from 'react-bootstrap'; // Import Nav and Dropdown from react-bootstrap

import Logo from "../Asset/WebImages/Logo.png";
import '../App.css'; // Ensure your custom CSS file is imported

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef(null); // Ref to handle clicks outside

  // Function to toggle dropdown visibility
  const handleDropdownToggle = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setShowDropdown((prevState) => !prevState);
  };

  // Function to close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center'}}>
        <h2 className="Website-Name clr-db">
          <img src={Logo} alt="Logo" style={{ width: '70px' }} /> iSKed
        </h2>

        <Link className="nav-item nav-link" to="/Home">Home</Link>
        
        <div className="dropdown-about" ref={dropdownRef}>
          <Link
            to="/"
            className="nav-item nav-link"
            onClick={handleDropdownToggle}
            style={{ border: 'none', backgroundColor: 'transparent', padding: '0', cursor: 'pointer' }}
          >
            About
          </Link>
          {showDropdown && (
            <div className="dropdown-content">
              <Dropdown.Item as={Link} to="/About">SK Youth</Dropdown.Item>
              <Dropdown.Item as={Link} to="/Mandate">Mandate</Dropdown.Item>
              <Dropdown.Item as={Link} to="/Council">SK Council</Dropdown.Item>
              <Dropdown.Item as={Link} to="/FormerSK">Former SK Council</Dropdown.Item>
              <Dropdown.Item as={Link} to="/History">History</Dropdown.Item>
            </div>
          )}
        </div>
  
        <Link className="nav-item nav-link" to="/UserProgram">Programs</Link>
        <Link className="nav-item nav-link" to="/ContactUs">Contact Us</Link>
      </div>

      <div className="navbar-buttons" style={{ display: 'flex', alignItems: 'center' }}>
        <button className="login-button ms-2" onClick={() => navigate('/userauth?view=signIn')}>Log In</button>
        <button className="signup-button ms-2" onClick={() => navigate('/userauth?view=signUp')}>Sign Up</button>
      </div>
    </Nav>
  );
};

export default Navbar;
