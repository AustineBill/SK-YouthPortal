import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import rightArrow from "../Asset/right-arrow.png"
import Cover from "../Asset/bg.png"



const Intro = () => (
    <div className="container-fluid">
      <div className="hero-header">
          <div className="col-lg-12 text-center text-lg-start m-5 ">
            <h1 className="MainText">Lagi't lagi para sa Kabataan,</h1>
            <h1 className="SubText animated slideInRight">Barangay at sa Bayan. <span className="custom-name">iSKed</span></h1>
            <p className="custom-intro-details">Western Bicutan</p> 
          </div>
          <button className="IntroButton">Explore Now <img src={rightArrow} className="arrow" alt="Right Arrow" /></button>
      </div>
     
        <div className="row g-4 justify-content-center">
          <div className="col-lg-3 wow fadeIn" data-wow-delay="0.1s">
            <div className="custom-feature-item ">
             
                <i className="fa fa-search fa-3x text-dark mb-3"></i>
                <span className="text-dark mb-3 d-block">Search</span> <h5 className="text-dark mb-0">Unleash the champion with SK Youth's Program</h5>
              
            </div>
          </div>
          
          <div className="col-lg-3 wow fadeIn" data-wow-delay="0.3s">
            <div className="custom-feature-item ">
             
                <i className="fa fa-book fa-3x text-dark mb-3"></i>
                <span className="text-dark mb-3 d-block">Book</span> <h5 className="text-dark mb-0">Secure your spot</h5>
            
            </div>
          </div>
          <div className="col-lg-3 wow fadeIn" data-wow-delay="0.5s">
            <div className="custom-feature-item ">
            
                <i className="fa fa-check fa-3x text-dark mb-3"></i>
                <span className="text-dark mb-3 d-block">Manage</span> <h5 className="text-dark mb-0">Own your Schedule, your way!</h5>
             
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
  
          <h1 className="NewEve-headline">NEWS & EVENTS</h1>
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
  
            <Link className="btn btn-primary py-2 px-4 mb-5" to="/news">Find Out More</Link>
  
          <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active bg-dark">
                <img src={Cover} className="d-block w-100" alt="..."></img>
              </div>
              <div className="carousel-item bg-primary">
                <img src={Cover} className="d-block w-100" alt="..."></img>
              </div>
              <div className="carousel-item bg-secondary">
              <img src={Cover} className="d-block w-100" alt="..."></img>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
  
  
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
                <h1 style={{ fontFamily: "'Sansita Swashed', cursive" }} className="Text-1">Connect with us.</h1>
                <h1 style={{ fontFamily: "'Sansita Swashed', cursive" }} className="Text-2">Be part of the SK Youth Community</h1>
                <h3  style={{ fontFamily: "'Poppins', sans-serif" }} className="Text-3"> Create your Profile today.</h3>
              </div> 
          </div>
    </div>
  );
  
  
  export default Intro;
  
  