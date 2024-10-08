import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

import '../App.css'; // Ensure your custom CSS file is imported

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Link to="/" className="navbar-brand">
          <h2 className="Website-Name" style={{ fontFamily: "'Sansita Swashed', cursive" }}>SK Youth</h2>
        </Link>
        <Link className="nav-item nav-link" to="/Dashboard">Home</Link>
        <Link className="nav-item nav-link" to="/Overview">Programs</Link>
        <Link className="nav-item nav-link" to="/UserProgram">Reservation</Link>
        <Link className="nav-item nav-link" to="/ContactUs">Help and Support</Link>

        {/* Avatar with Dropdown */}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <div onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
            <Avatar name="Wim Mostmans" round={true} size="70" />
          </div>
          {dropdownVisible && (
            <div className="avatar-dropdown" style={dropdownStyles}>
              <Link to="/Profile" className="dropdown-item">Profile</Link>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <Link to="/userauth" className="dropdown-item">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Inline styles for dropdown (or you can move it to your CSS)
const dropdownStyles = {
  position: 'absolute',
  right: 0,
  top: '50px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '5px',
  width: '150px',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
};



export default Navbar;
