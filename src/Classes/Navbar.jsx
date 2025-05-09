import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import Logo from "../Asset/WebImages/Logo.png";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [hamburgerVisible, setHamburgerVisible] = useState(false);
  const [activeButton, setActiveButton] = useState("login");
  const [activeLink, setActiveLink] = useState("");
  const [fade, setFade] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleHamburgerMenu = () => {
    setHamburgerVisible(!hamburgerVisible);
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    navigate(`/userauth?view=${buttonType}`);
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const handleHover = (isHovering) => {
    setFade(isHovering); // Set fade on hover
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); // Toggle dropdown on click
  };

  return (
    <Nav className={`navbar ${fade ? "fade-effect" : ""}`}>
      <h1 className="Website-Name">
        <img src={Logo} alt="Logo" /> iSKed
      </h1>

      <div
        className="navbar-links"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="hamburger-icon" onClick={toggleHamburgerMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Navbar Links */}
        <div className={`nav-links-main ${hamburgerVisible ? "active" : ""}`}>
          <Link
            className={`nav-item ${activeLink === "Home" ? "active" : ""}`}
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
            onMouseEnter={toggleDropdown} // Use toggleDropdown here
            onMouseLeave={toggleDropdown}
          >
            <Link
              className={`nav-item ${activeLink === "About" ? "active" : ""}`}
              to="/About"
              onClick={() => handleLinkClick("About")}
            >
              About
            </Link>
            {dropdownVisible && (
              <div className="dropdown-content">
                <Link className="dropdown-item" to="/About">
                  About Us
                </Link>
                <Link className="dropdown-item" to="/Council">
                  SK Officials
                </Link>
                <Link className="dropdown-item" to="/Mandate">
                  Mandate
                </Link>
              </div>
            )}
          </div>

          <Link
            className={`nav-item ${activeLink === "Programs" ? "active" : ""}`}
            to="/UserProgram"
            onClick={() => handleLinkClick("Programs")}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            Programs
          </Link>
          <Link
            className={`nav-item  ${
              activeLink === "Contact Us" ? "active" : ""
            }`}
            to="/ContactUs"
            onClick={() => handleLinkClick("Contact Us")}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            Contacts
          </Link>

          {hamburgerVisible && (
            <>
              <Link
                className="nav-item"
                to="/userauth?view=signIn"
                onClick={() => handleButtonClick("signIn")}
              >
                Log In
              </Link>
              <Link
                className="nav-item"
                to="/userauth?view=signUp"
                onClick={() => handleButtonClick("signUp")}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="navbar-buttons">
        <button
          className={`login-button ${
            activeButton === "signIn" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("signIn")}
        >
          Log In
        </button>
        <button
          className={`signup-button ${
            activeButton === "signUp" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("signUp")}
        >
          Sign Up
        </button>
      </div>
    </Nav>
  );
};

export default Navbar;
