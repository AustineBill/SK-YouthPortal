import React from 'react';
import { Link } from 'react-router-dom';
import {Button, Card} from 'react-bootstrap';

const Dashboard = () => (
  <div className="container-fluid">
    <div className="hero-header">
        <div className="col-lg-12 text-center text-lg-start m-5">
          <h1 className="Maintext">Sangguniang Kabataan</h1>
          <h1 className="Subtext ms-5 animated slideInRight">Western Bicutan</h1>
              <button className="LargeButton btn-db">
                Explore Now <i className="bi bi-arrow-right"></i>
              </button>
          </div>
        </div>
      

    <div className="bg-secondary">
        <div className="Divider">
            <Link className="text-dark fw-bold fs-4" hidden="true">Discover for more events</Link>
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
              <Button variant="dark">Explore Now</Button>
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
              <Button variant="dark">Explore Now</Button>
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
              <Button variant="dark">Explore Now</Button>
        </Card.Body>
      </Card>
    </div>
</div>
);




export default Dashboard;
