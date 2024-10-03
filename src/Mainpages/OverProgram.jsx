import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import '../App.css';
import '../style.css';


const OverviewProgram = () => (
  <div className="container-fluid">
    <div className="text-center text-lg-start m-4 mv-8">
      <h1 className="Maintext animated slideInRight">SK Council</h1>
        <p className='Subtext'>Don't Miss out, Explore now</p> 
    </div> 

  <div className="CardContainer">
      <Card className="LargeCard">
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
