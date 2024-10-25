import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import Logo from "../Asset/WebImages/Logo.png";
import '../App.css'; // Ensure your custom CSS file is imported

const UserNavbar = ({ setIsUserLoggedIn }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownVisible(!dropdownVisible);
  };

  const handleLinkClick = () => {
    setDropdownVisible(false); // Close dropdown when a link is clicked
  };

  useEffect(() => {
    const username = localStorage.getItem('username') || 'Default User';
    setLoggedInUser(username);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', width: '98%' }}>
        <Link to="/" className="navbar-brand">
          <h2 className="Website-Name">
            <img src={Logo} alt="Logo" style={{ width: '70px' }} /> iSKed
          </h2>
        </Link>
        <Link className="nav-item nav-link" to="/Dashboard">Home</Link>
        <Link className="nav-item nav-link" to="/UserProgram">Programs</Link>
        <Link className="nav-item nav-link" to="/ReservationLog">Reservation</Link>
        <Link className="nav-item nav-link" to="/ContactUs">Help and Support</Link>

        <div style={{ marginLeft: 'auto', position: 'relative' }} ref={dropdownRef}>
          <div onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
            <Avatar name={loggedInUser} round={true} size="50" />
          </div>
          {dropdownVisible && (
            <div className={`avatar-dropdown ${dropdownVisible ? 'visible' : ''}`} style={dropdownStyles}>
              <Link to="/Profile" className="dropdown-item" onClick={handleLinkClick}>Profile</Link>
              <Link to="/Settings" className="dropdown-item" onClick={handleLinkClick}>Settings</Link>
              <Link to="/userauth" className="dropdown-item" onClick={() => { 
                localStorage.setItem('isUserLoggedIn', 'false');
                setIsUserLoggedIn(false);  // Update state to trigger re-render
                handleLinkClick();
              }}>Logout</Link>
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

export default UserNavbar;
