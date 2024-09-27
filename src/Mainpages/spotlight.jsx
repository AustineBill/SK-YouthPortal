import React from 'react';

import Card from 'react-bootstrap/Card';

import SKPhoto from "../assets/Western Photo.png";

const Spotlight = () => (
    <div className="container-fluid">
        <div className="text-center text-lg-start">
            <h1 className="Maintext animated slideInRight">Spotlight</h1>
                <p className="Subtext">Celebrating SK Youth Excellent </p>
        </div>
        <div className="Former-img-container">
            <img src={SKPhoto} className="Former-main-img" alt="Cover" />
        </div>

        <div className="spotlight-text-content">
            <h1 className="Lower-Maintext">SK WESTERN BICUTAN COUNSIL</h1>
                <p className="Lower-Subtext">Celebrating SK Youth Excellent </p>
        </div>

        <div className="bg-secondary">
            <div className="Divider">
                <h1 className="Divider-Text">Milestones</h1>
            </div>
        </div>

        <div className="dash-card-container">

            <Card className="dash-Card">
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body className="d-flex flex-column align-items-center ">
                <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title> 
            </Card.Body>
            </Card>

            <Card className="dash-Card">
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body className="d-flex flex-column align-items-center ">
                <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title> 
            </Card.Body>
            </Card>

            <Card className="dash-Card">
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body className="d-flex flex-column align-items-center ">
                <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title> 
            </Card.Body>
            </Card>

            <Card className="dash-Card">
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body className="d-flex flex-column align-items-center ">
                <Card.Title className="fs-5 fw-bold text-dark">Card Title</Card.Title> 
            </Card.Body>
            </Card>
        </div>
    </div>
);

export default  Spotlight;