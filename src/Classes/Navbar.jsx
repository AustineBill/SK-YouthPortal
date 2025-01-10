import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import Logo from "../Asset/WebImages/Logo.png";
import "../App.css"; // Ensure your custom CSS file is imported

const Navbar = () => {
  const navigate = useNavigate();
  const [hamburgerVisible, setHamburgerVisible] = useState(false); // State for hamburger menu
  const [activeButton, setActiveButton] = useState("login"); // State for active button
  const [activeLink, setActiveLink] = useState(""); // State to track active link
  const [fade, setFade] = useState(false); // Fade effect for hover state
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility

  const toggleHamburgerMenu = () => {
    setHamburgerVisible(!hamburgerVisible);
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType); // Update active button state
    navigate(`/userauth?view=${buttonType}`);
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName); // Set the active link
  };

  const handleHover = (isHovering) => {
    setFade(isHovering);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); // Toggle the dropdown visibility
  };

  return (
    <Nav className="navbar">
      <div className="navbar-links" style={{ display: "flex", alignItems: "center" }}>
        <h2 className="Website-Name">
          <img src={Logo} alt="Logo" /> iSKed
        </h2>

        {/* Hamburger Icon */}
        <div className="hamburger-icon" onClick={toggleHamburgerMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Navbar Links */}
        <div className={`nav-links ${hamburgerVisible ? "active" : ""}`}>
          <Link
            className={`nav-item home-link ${activeLink === "Home" ? "active" : ""}`}
            to="/Home"
            onClick={() => handleLinkClick("Home")}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            Home
          </Link>

          {/* About Link with Dropdown */}
          <div
            className="dropdown-about"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <Link
              className={`nav-item about-link ${activeLink === "About" ? "active" : ""}`}
              to="/About"
              onClick={() => handleLinkClick("About")}
              onMouseEnter={() => handleHover(true)}
              onMouseLeave={() => handleHover(false)}
            >
              About
            </Link>
            {dropdownVisible && (
              <div className="dropdown-content">
                <Link className="dropdown-item" to="/AboutHistory">
                  History
                </Link>
                <Link className="dropdown-item" to="/AboutTeam">
                  Our Team
                </Link>
                <Link className="dropdown-item" to="/AboutVision">
                  Vision
                </Link>
              </div>
            )}
          </div>

          <Link
            className={`nav-item programs-link ${activeLink === "Programs" ? "active" : ""}`}
            to="/UserProgram"
            onClick={() => handleLinkClick("Programs")}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            Programs
          </Link>
          <Link
            className={`nav-item contact-link ${activeLink === "Contact Us" ? "active" : ""}`}
            to="/ContactUs"
            onClick={() => handleLinkClick("Contact Us")}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Buttons */}
      <div className={`navbar-buttons ${hamburgerVisible ? "active" : ""}`}>
        <button
          className={`login-button ${activeButton === "signIn" ? "active" : ""}`}
          onClick={() => handleButtonClick("signIn")}
        >
          Log In
        </button>
        <button
          className={`signup-button ms-2 ${activeButton === "signUp" ? "active" : ""}`}
          onClick={() => handleButtonClick("signUp")}
        >
          Sign Up
        </button>
      </div>
    </Nav>
  );
};

export default Navbar;
