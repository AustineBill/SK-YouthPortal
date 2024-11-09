import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import ADAM from "../Asset/ADAM FORTALEZA.png"


const Programs = () => {
  const navigate = useNavigate();
  
    return (
      <div className="container-fluid">
        <div className="text-center text-lg-start m-4 mv-8 mb-5">
          <h1 className="Maintext animated slideInRight">Programs</h1>
          <p className="Subtext">Don't Miss out, Explore now</p> 
        </div> 

      <div className="d-flex flex-column align-items-center">
        <div className="w-100 d-flex justify-content-center mb-4">
          <Card className=" w-75">
            <Card.Img variant="top" src={ADAM} />
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Button variant="dark" onClick={() => navigate('/ProgramDetails')}>Explore Now</Button>
            </Card.Body>
          </Card>
        </div>

        <div className="w-100 d-flex justify-content-center mb-4">
          <Card className=" w-75">
            <Card.Img variant="top"src={ADAM} />
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Button variant="dark" onClick={() => navigate('/Equipment')}>Explore Now</Button>
            </Card.Body>
          </Card>
        </div>
    </div>
  </div>
);
};

export default Programs;
