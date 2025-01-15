import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../WebStructure/AuthContext";
import Avatar from "react-avatar";
import { Nav } from "react-bootstrap";
import Logo from "../Asset/WebImages/Logo.png";
import "../App.css";

const UserNavbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [hamburgerVisible, setHamburgerVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const username = sessionStorage.getItem("username");

    if (username) {
      setLoggedInUser(username);
    }
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
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

  const toggleHamburgerMenu = () => {
    setHamburgerVisible(!hamburgerVisible);
  };

  return (
    <Nav className="navbar">
      <div
        className="navbar-links-user"
        style={{ display: "flex", alignItems: "center" }}
      >
        <h2 className="Website-Name">
          <img src={Logo} alt="Logo" /> iSKed
        </h2>

        {/* Hamburger Icon - Visible only on mobile/tablet */}
        <div className="hamburger-icon" onClick={toggleHamburgerMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Navbar Links */}
        <div className={`nav-links ${hamburgerVisible ? "active" : ""}`}>
          <Link className="nav-item nav-link" to="/Dashboard">
            Home
          </Link>
          <Link className="nav-item nav-link" to="/UserProgram">
            Programs
          </Link>
          <Link className="nav-item nav-link" to="/ReservationLog">
            Reservation
          </Link>
        </div>

        {hamburgerVisible && (
          <div className="hamburger-dropdown">
            <Link className="nav-item" to="/Profile/:username">
              Log In
            </Link>
            <Link
              className="nav-item"
              to="/userauth?view=signUp"
              onClick={handleLogout}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModalVisible && (
        <div className="ModalOverlayStyles">
          <div className="ModalStyles semi-large">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <button
              className="ModalButtonStyles SmallButton btn-dark super-small"
              onClick={handleLogout}
            >
              Yes
            </button>
            <button
              className="ModalButtonStyles SmallButton btn-db super-small"
              onClick={() => setLogoutModalVisible(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* User Avatar and Dropdown */}
      {isAuthenticated && (
        <div className="navbar-buttons" ref={dropdownRef}>
          <div
            onClick={() => setDropdownVisible(!dropdownVisible)}
            style={{ cursor: "pointer" }}
          >
            <Avatar name={loggedInUser} round={true} size="50" />
          </div>
          {dropdownVisible && (
            <div style={dropdownStyles}>
              <Link
                to={`/Profile/${loggedInUser}`}
                className="dropdownAvatar text-decoration-none"
                onClick={() => setDropdownVisible(false)}
              >
                Profile
              </Link>
              <div
                className="dropdownAvatar"
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </Nav>
  );
};

const dropdownStyles = {
  position: "absolute",
  right: "10px",
  top: "70px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "5px",
  width: "100px",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
};

export default UserNavbar;
