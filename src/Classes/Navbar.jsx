import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Dropdown } from 'react-bootstrap';
import Logo from "../Asset/WebImages/Logo.png";
import '../App.css'; // Ensure your custom CSS file is imported

const Navbar = () => {   
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hamburgerVisible, setHamburgerVisible] = useState(false); // State for hamburger menu
  const [activeButton, setActiveButton] = useState('login'); // State for active button
  const dropdownRef = useRef(null); // Ref to handle clicks outside

  const handleDropdownToggle = (e) => {
    e.preventDefault(); 
    setShowDropdown((prevState) => !prevState);
  };

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

  const toggleHamburgerMenu = () => {
    setHamburgerVisible(!hamburgerVisible);
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType); // Update active button state
    navigate(`/userauth?view=${buttonType}`);
  };

  return (
    <Nav className="navbar">
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
        <h2 className="Website-Name">
          <img src={Logo} alt="Logo"/> iSKed
        </h2>

        {/* Hamburger Icon */}
        <div className="hamburger-icon" onClick={toggleHamburgerMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Navbar Links */}
        <div className={`nav-links ${hamburgerVisible ? 'active' : ''}`}>
          <Link className="nav-item nav-link" to="/Home">Home</Link>
          <div className="dropdown-about" ref={dropdownRef}>
            <Link
              to="/"
              className="nav-item nav-link"
              onClick={handleDropdownToggle}
            >
              About
            </Link>
            {showDropdown && (
              <div className="dropdown-content">
                <Dropdown.Item as={Link} to="/About">SK Youth</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Mandate">Mandate</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Council">SK Council</Dropdown.Item>
                <Dropdown.Item as={Link} to="/History">History</Dropdown.Item>
              </div>
            )}
          </div>
          <Link className="nav-item nav-link" to="/UserProgram">Programs</Link>
          <Link className="nav-item nav-link" to="/ContactUs">Contact Us</Link>
        </div>
      </div>

      {/* Buttons */}
      <div className={`navbar-buttons ${hamburgerVisible ? 'active' : ''}`}>
        <button
          className={`login-button ${activeButton === 'signIn' ? 'active' : ''}`}
          onClick={() => handleButtonClick('signIn')}
        >
          Log In
        </button>
        <button
          className={`signup-button ms-2 ${activeButton === 'signUp' ? 'active' : ''}`}
          onClick={() => handleButtonClick('signUp')}
        >
          Sign Up
        </button>
      </div>
    </Nav>
  );
};

export default Navbar;
