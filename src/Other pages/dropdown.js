import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';  // Make sure to include custom styles

const CustomDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="custom-dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        About Us
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <Link className="dropdown-item" to="/about">Our Story</Link>
          <Link className="dropdown-item" to="/team">Our Team</Link>
          <Link className="dropdown-item" to="/mission">Our Mission</Link>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
