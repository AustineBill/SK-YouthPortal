import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Footer = () => (
  <div className="container-fluid bg-db footer">
    <div className="row d-flex justify-content-between py-4 footer-content">
      <div className="col-md-3 d-flex flex-column align-items-start">
        <h1 className="footer-name">iSKed</h1>
      </div>

      {/* Get In Touch Section */}
      <div className="col-md-3 d-flex flex-column align-items-start get-in-touch">
        <h6>Get In Touch</h6>
        <p>
          <i className="fa fa-map-marker-alt me-2"></i> 1 Sampaguita, Taguig,
          1630 Metro Manila
        </p>
        <p>
          <i className="fa fa-phone-alt me-2"></i>+63 918 453 5868
        </p>
        <p>
          <i className="fa fa-envelope me-2"></i>
          skwesternbicutanofficial@gmail.com
        </p>
      </div>

      {/* Navigation Section */}
      <div className="col-md-3 d-flex flex-column align-items-start popular-links">
        <h6>Navigation</h6>
        <Link className="btn btn-link p-0" to="/About">
          About Us
        </Link>
        <Link className="btn btn-link p-0" to="/Council">
          SK Officials
        </Link>
        <Link className="btn btn-link p-0" to="/Mandate">
          Mandate
        </Link>
      </div>

      {/* Our Services Section */}
      <div className="col-md-3 d-flex flex-column align-items-start">
        <h6>Our Services</h6>
        <Link className="btn btn-link p-0" to="/UserProgram">
          Programs
        </Link>
        <Link className="btn btn-link p-0" to="/News">
          News & Events
        </Link>
        <Link className="btn btn-link p-0" to="/Spotlight">
          SK Youth Spotlight
        </Link>
      </div>
    </div>

    <div className="row">
      <div className="col-12 text-center">
        <hr className="footer-line" />
      </div>
    </div>
  </div>
);

export default Footer;
