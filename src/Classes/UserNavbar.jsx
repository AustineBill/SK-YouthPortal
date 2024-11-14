import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../WebStructure/AuthContext';
import Avatar from 'react-avatar';
import Logo from "../Asset/WebImages/Logo.png";
import '../App.css';

const UserNavbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
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

  const openLogoutModal = () => {
    setLogoutModalVisible(true);
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    logout();
    setLogoutModalVisible(false);
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
                <div className="dropdown-item" onClick={openLogoutModal}>Logout</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModalVisible && (
        <div style={modalOverlayStyles}>
          <div style={modalStyles}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <button className="SmallButton btn-dark" onClick={handleLogout} style={modalButtonStyles}>Yes</button>
            <button className="btn-db SmallButton" onClick={() => setLogoutModalVisible(false)} style={modalButtonStyles}>No</button>
          </div>
        </div>
      )}
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

const modalOverlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyles = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  width: '300px',
};

const modalButtonStyles = {
  margin: '10px',
  padding: '8px 16px',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default UserNavbar;
