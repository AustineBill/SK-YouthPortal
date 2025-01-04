import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css"

const Footer = () => (
  <div className="container-fluid bg-db footer">
    <div className="row d-flex justify-content-between py-1">

      {/* Get In Touch Section */}
      <div className="col-md-2 d-flex flex-column">
        <h6>Get In Touch</h6>
        <p><i className="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA</p>
        <p><i className="fa fa-phone-alt me-2"></i>+012 345 67890</p>
        <p><i className="fa fa-envelope me-2"></i>info@example.com</p>
      </div>

      {/* Center Name Section */}
      <div className="col-md-2 d-flex flex-column align-items-center">
        <h4 className="footer-name">iSKed</h4>
        <p className="mb-0">All Rights Reserved 2024.</p>
      </div> 

      {/* Popular Links Section */}
      <div className="col-md-2 d-flex flex-column align-items-center">
        <h6>Popular Links</h6>
        <Link className="btn btn-link p-0" to="/mandate">About Us</Link>
        <Link className="btn btn-link p-0" to="">Privacy Policy</Link>
        <Link className="btn btn-link p-0" to="">Terms & Condition</Link>
      </div>
    </div>
  </div>
);

export default Footer;
