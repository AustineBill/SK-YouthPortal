import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../WebStructure/AuthContext';
import Avatar from 'react-avatar';
import Logo from "../Asset/WebImages/Logo.png";
import '../App.css';

const UserNavbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const dropdownRef = useRef(null);


  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
        setLoggedInUser(username);
    }
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

  const handleLogout = () => {
    logout();
    setDropdownVisible(false);
  };


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

        {isAuthenticated && (
          <div style={{ marginLeft: 'auto', position: 'relative' }} ref={dropdownRef}>
            <div onClick={() => setDropdownVisible(!dropdownVisible)} style={{ cursor: 'pointer' }}>
              <Avatar name={loggedInUser} round={true} size="50" />
            </div>
            {dropdownVisible && (
              <div style={dropdownStyles}>
                <Link to={`/Profile/${loggedInUser}`} className="dropdown-item" onClick={() => setDropdownVisible(false)}>Profile</Link>
                <Link to="/Settings" className="dropdown-item" onClick={() => setDropdownVisible(false)}>Settings</Link>
                <Link to="/userauth" className="dropdown-item" onClick={handleLogout}>Logout</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

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
