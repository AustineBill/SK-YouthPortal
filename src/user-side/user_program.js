import React from 'react';
import {Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';



/*Main Pages*/


/*Sub Pages*/


import '../App.css';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Programs = () => (
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


    <div className="row bg-primary">
      <div className="text-center text-lg-start m-4">
        <h1 className="prog-maintext animated slideInRight">Programs</h1>
          <p className='prog-p'>Don't miss out, This is your event</p>
      </div>
    </div>
  

    <div className="dash-card-container">
        <Card className="dash-Card">
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body className="d-flex flex-column align-items-center ">
            <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Explore Now</Button>
          </Card.Body>
        </Card>

        <Card className="dash-Card">
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body className="d-flex flex-column align-items-center ">
            <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Explore Now</Button>
          </Card.Body>
        </Card>
    </div>





</div>
);

export default Programs;
