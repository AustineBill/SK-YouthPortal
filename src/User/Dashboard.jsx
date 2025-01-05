import React from "react";
import { Button, Card } from "react-bootstrap";

const Dashboard = () => (
  <div className="container-fluid">
    <div className="western-header"> </div>

    <div className="bg-secondary mt-2">
      <div className="Divider">
        <h1 className="text-dark fw-bold fs-4">Discover for more events</h1>
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
