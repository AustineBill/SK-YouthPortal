import React from 'react';
import {Link } from 'react-router-dom';



const Footer = () => (
    <div className="container-fluid bg-secondary border-top footer">
      
        <div className="row">
          <div className="col-md-2 col-lg-3 mt-2 wow fadeIn" data-wow-delay="0.3s">
            <h5 className="mb-1">Get In Touch</h5>
            <p><i className="fa fa-map-marker-alt me-3 mb-1"></i>123 Street, New York, USA</p>
            <p><i className="fa fa-phone-alt me-3mb-1"></i>+012 345 67890</p>
            <p><i className="fa fa-envelope me-3mb-1"></i>info@example.com</p>
          </div>
  
          <div className="col-md-4 col-lg-6 d-flex flex-column justify-content-center align-items-center text-center">
            <div className="mb-5 mb-md-0">
              &copy; <a className="footer-name">SK YOUTH</a>
            </div>
            All Rights Reserved 2024.
            <div className="d-flex pt-2">
              <Link className="btn btn-square btn-outline-light me-1" to=""><i className="fab fa-twitter"></i></Link>
              <Link className="btn btn-square btn-outline-light me-1" to=""><i className="fab fa-facebook-f"></i></Link>
              <Link className="btn btn-square btn-outline-light me-1" to=""><i className="fab fa-instagram"></i></Link>
              <Link className="btn btn-square btn-outline-light me-1" to=""><i className="fab fa-linkedin-in"></i></Link>
            </div>
          </div>
  
         
  
          <div className="col-md-5 col-lg-3 d-flex flex-column justify-content-center align-items-end text-end">
            <h5 className="mb-0">Popular Links</h5>
            <Link className="btn btn-link" to="/mandate">About Us</Link>
            <Link className="btn btn-link" to="">Contact Us</Link>
            <Link className="btn btn-link" to="">Privacy Policy</Link>
            <Link className="btn btn-link" to="">Terms & Condition</Link>
          </div>
        </div>
     
    </div>
  );
  

export default Footer;