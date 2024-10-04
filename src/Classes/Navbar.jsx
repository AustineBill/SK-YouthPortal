import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap'; // Import only Dropdown from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Ensure your custom CSS file is imported



const Navbar = () => {
  // State to manage dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);
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
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <h2 className="Website-Name" style={{ fontFamily: "'Sansita Swashed', cursive" }}>SK Youth</h2>
      </Link>
      <Link className="nav-item nav-link" to="/">Home</Link>

      {/* Customized Dropdown */}
      <div className="dropdown" ref={dropdownRef}>
        <Link
          to="/"
          className="nav-item nav-link"
          onClick={handleDropdownToggle}
          style={{ border: 'none', backgroundColor: 'transparent', padding: '0', cursor: 'pointer' }} // Removes background and border
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

      <Link className="nav-item nav-link" to="/Overview">Programs</Link>
      <Link className="nav-item nav-link" to="/ContactUs">Contact Us</Link>
      

      <Link className="login-button btn btn-outline-dark ms-auto" to="/userauth?view=signIn">Log In</Link>
      <Link className="signup-button btn btn-primary ms-2" to="/userauth?view=signUp">Sign Up</Link>
    </nav>
  );
};

export default Navbar;
