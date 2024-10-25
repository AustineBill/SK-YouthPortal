import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <div className="container-fluid bg-secondary border-top footer">
    <div className="row d-flex justify-content-between align-items-center text-center py-3">

      {/* Get In Touch Section */}
      <div className="col-md-2 d-flex flex-column">
        <h5>Get In Touch</h5>
        <p><i className="fa fa-map-marker-alt"></i>123 Street, New York, USA</p>
        <p><i className="fa fa-phone-alt me-2"></i>+012 345 67890</p>
        <p><i className="fa fa-envelope me-2"></i>info@example.com</p>
      </div>

      {/* Center Name Section */}
      <div className="col-md-4 d-flex flex-column align-items-center">
        <h1 className="footer-name clr-db">iSKed</h1>
        <p>All Rights Reserved 2024.</p>
        <div className="d-flex">
          <Link className="btn btn-square btn-outline-light me-1" to=""><i className="fab fa-twitter"></i></Link>
          <Link className="btn btn-square btn-outline-light me-1" to=""><i className="fab fa-facebook-f"></i></Link>
          <Link className="btn btn-square btn-outline-light me-1" to=""><i className="fab fa-instagram"></i></Link>
          <Link className="btn btn-square btn-outline-light me-1" to=""><i className="fab fa-linkedin-in"></i></Link>
        </div>
      </div>

      {/* Popular Links Section */}
      <div className="col-md-2 d-flex flex-column align-items-center">
        <h5>Popular Links</h5>
        <Link className="btn btn-link" to="/mandate">About Us</Link>
        <Link className="btn btn-link" to="">Contact Us</Link>
        <Link className="btn btn-link" to="">Privacy Policy</Link>
        <Link className="btn btn-link" to="">Terms & Condition</Link>
      </div>
    </div>
  </div>
);

export default Footer;
