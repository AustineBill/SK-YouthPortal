import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <div className="container-fluid bg-secondary footer">
    <div className="row d-flex justify-content-between py-3">

      {/* Get In Touch Section */}
      <div className="col-md-3 d-flex flex-column">
        <h5>Get In Touch</h5>
        <p><i className="fa fa-map-marker-alt me-2"></i> 123 Street, New York, USA</p>
        <p><i className="fa fa-phone-alt me-2"></i> +012 345 67890</p>
        <p><i className="fa fa-envelope me-2"></i> info@example.com</p>
      </div>

      {/* Center Name Section */}
      <div className="col-md-2 d-flex flex-column align-items-center">
        <h1 className="footer-name clr-db">iSKed</h1>
        <p>All Rights Reserved 2024.</p>
      </div> 

      {/* Popular Links Section */}
      <div className="col-md-2 d-flex flex-column align-items-center">
        <h5>Popular Links</h5>
        <Link className="btn btn-link" to="/mandate">About Us</Link>
        <Link className="btn btn-link" to="">Privacy Policy</Link>
        <Link className="btn btn-link" to="">Terms & Condition</Link>
      </div>
    </div>
  </div>
);

export default Footer;


