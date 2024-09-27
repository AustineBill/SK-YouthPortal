import React from 'react';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';



import '../App.css';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Program_details = () => (
  <div className="container-fluid">
    <div className="container-fluid sticky-top">
      <nav className="navbar navbar-expand-lg bg-white">
        <Link to="/" className="navbar-brand">
          <h2 className="Website-Name" style={{ fontFamily: "'Sansita Swashed', cursive" }}>SK Youth</h2>
        </Link>

        <div className="navbar-nav ms-4 align-items-center">
          <Link className="nav-item nav-link" to="/">Home</Link>
          <Link className="nav-item nav-link" to="/programs">Programs</Link>
          <Link className="nav-item nav-link" to="/programs">Reservation</Link>
          <Link className="nav-item nav-link" to="/contact">Help and Support</Link>
        </div>
      </nav>
    </div>


    <div className="row">
      <div className="text-center text-lg-start m-4">
        <h1 className="prog-maintext animated slideInRight">Appointment</h1>
          <p className='prog-p'>Reserve yours now!</p>
          <button className="prog-book-button"><i className="fa fa-bookmark"></i> Book Now </button>
          <button className="prog-view-button"><i className="fa fa-calendar" aria-hidden="true"></i> View Schedule</button>
      </div>
    </div> 
  

    <div className="prog-descripton">
        <div className="row g-0">
            <div className="col-md-4">
            <img src="..." className="img-fluid rounded-start" alt="..."/>
            </div>
            <div className="col-md-8">
            <div className="card-body">
                <h5 className="card-title">Description</h5>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <h5 className="card-title">Amendities</h5>
                <Card.Img  src="holder.js/100px180" />
                <Card.Img  src="holder.js/100px180" />
            </div>
            </div>
        </div>
    </div>





</div>
);

export default Program_details;
