import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


import '../App.css';
import '../style.css';



const Dashboard = () => (
  <div className="container-fluid">
    <div className="intro-container hero-header bg-primary ">
      <div className="row">
        <div className="col-lg-5 text-center text-lg-start ms-5 ">
          <h1 className="Maintext animated slideInRight">SK Youth </h1>
            <h3 className="Subtext">Western Bicutan</h3>
                <p className=''>Lorem Ipsum heheeeeeeeeeeeeeehheehheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</p>
          <button className="dash-button">Find out more</button>
        </div>
      </div>
    </div>

    <div className="bg-secondary">
        <div className="Divider">
            <Link className="Divider-Text">Discover for more events</Link>
        </div>
    </div>

    <div className="CardContainer">
        <Card className="MediumCard">
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Explore Now</Button>
          </Card.Body>
        </Card>

        <Card className="MediumCard">
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
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




export default Dashboard;
