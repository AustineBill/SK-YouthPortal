import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Cover from "../Asset/bg.png"

const Intro = () => (

    <div className="container-fluid">
      <div className="hero-header">
        <div className="col-lg-12 text-center text-lg-start m-5">
          <h1 className="MainText ms-5">Lagi't lagi para sa Kabataan,</h1>
          <h1 className="SubText animated slideInRight">
            Barangay at sa Bayan 
            <span className="custom-name clr-db txt-i-db"> Sangguniang Kabataan</span>
          </h1>
          <div className="IntroContainer">
            <p className="IntroDetails">Western Bicutan</p>
              <button className="IntroButton btn-db">
                Explore Now <i className="bi bi-arrow-right"></i>
              </button>
          </div>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.1s">
          <div className="custom-feature-item "> 
            <i className="fa fa-search fa-3x text-dark mb-3"></i>
              <span className="text-dark mb-3 fs-3 d-block">Search</span> <span className="text-dark mb-0 fs-5">Unleash the champion with SK Youth's Program</span>
          </div>
        </div>
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.3s">
          <div className="custom-feature-item ">
            <i className="fa fa-book fa-3x text-dark mb-3"></i>
              <span className="text-dark mb-3 fs-3 d-block">Book</span> <span className="text-dark mb-0 fs-5">Secure your spot</span>
          </div>
        </div>
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.5s">
          <div className="custom-feature-item ">
            <i className="fa fa-check fa-3x text-dark mb-3"></i>
              <span className="text-dark mb-3 fs-3 d-block">Manage</span> <span className="text-dark mb-0 fs-5">Own your Schedule, your way!</span>
          </div>
        </div>
      </div>


      <div className="card-container">
        <Card className="ProgramCard">
          <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
        <Card className="ProgramCard">
          <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>  
        <Card className="ProgramCard">
          <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
      </div>
  
      <h1 className="NewEveHead">NEWS & EVENTS</h1>
      <div className="row g-4justify-content-center"></div>
        <div className="card-container">
          <Card className="ProgramCard">
            <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body> 
                <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                  </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
          </Card>
          <Card className="ProgramCard">
            <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body> 
                <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                  </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
          </Card>
          
        </div>
      
      <Link className="btn btn-primary py-2 px-4 mb-5" to="/news">Find Out More</Link>
      
      <Carousel id="carouselExampleIndicators" interval={3000} controls={true} indicators={true}>
        <Carousel.Item className="bg-dark">
          <img src={Cover} className="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item className="bg-primary">
          <img src={Cover} className="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item className="bg-secondary">
          <img src={Cover} className="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
      </Carousel>

      <div className="spotlight-container">
        <h1 className="spotlight-head">SK YOUTH SPOTLIGHTS</h1>
          <Link className="spotlight-button" to="/Spotlight">View Gallery</Link>
      </div>

      <div className="BodyContainer" data-wow-delay="0.5s">
        <h1 className="BlockQuote">SANGGUNIANG KABATAAN - WESTERN BICUTAN</h1>
          <Card>
            <Card.Body>
              <blockquote className="blockquote">
                <p >
                  {' '}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                  posuere erat a ante.{' '}
                </p>
                <footer className="blockquote-footer">
                  Someone famous in <cite title="Source Title">Source Title</cite>
                </footer>
              </blockquote>
            </Card.Body>
          </Card>
      </div>

      <div>
        <div className="TextContent">
          <h1 className="Text-1">Connect with us.</h1>
          <h1 className="Text-2 clr-db">Be part of the SK Youth Community</h1>
            <h3 className="Text-3"> Create your Profile today.</h3>
        </div> 
      </div>        
    </div>
  );
  
  export default Intro;
  
  