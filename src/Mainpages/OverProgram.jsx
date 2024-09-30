import React from 'react';
import { Link } from 'react-router-dom';


import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';



/*Main Pages*/


/*Sub Pages*/


import '../App.css';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const OverviewProgram = () => (
  <div className="container-fluid">
  <div className="intro-container hero-header bg-primary ">
    <div className="row">
      <div className="col-lg-5 text-center text-lg-start ms-5 ">
        <h1 className="dash-maintext animated slideInRight">SK Youth </h1>
          <h3 className="dash-subtext">Western Bicutan</h3>
              <p className=''>Lorem Ipsum heheeeeeeeeeeeeeehheehheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
        <button className="dash-button">Find out more</button>
      </div>
    </div>
  </div>

  <div className="bg-secondary">
      <div className="dash-divider row">
          <Link className="dash-divider-text">Discover for more events</Link>
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

    

   
  </div>
</div>
);

export default OverviewProgram;
