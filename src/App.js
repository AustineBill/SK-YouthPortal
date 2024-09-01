import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Mandate from "./pages/mandate"

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
//import 'owl.carousel/dist/assets/owl.carousel.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';



const App = () => {
  const [loading, setLoading] = useState(true);

  const introRef = useRef(null);
  const programRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const highlightsRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (ref) => {
    const offsetTop = ref.current.offsetTop;
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    window.scrollTo({
      top: offsetTop - navbarHeight,
      behavior: 'smooth'
    });
  };

  return (
    <Router>
      <div>
        {loading ? (
          <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <Navbar handleScroll={handleScroll} sections={{ introRef, programRef, aboutRef, contactRef, highlightsRef }} />
            <div ref={introRef}><Intro /></div>
            <div ref={programRef}><Programs /></div>
            <div ref={contactRef}><Contact Us /></div>
            <div ref={aboutRef}><About /></div>
           

            <Routes>
              <Route path="/mandate" element={<Mandate />} />
            </Routes>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
};

const Navbar = ({ handleScroll, sections }) => (
  <div className="container-fluid sticky-top">
    
      <nav className="navbar navbar-expand-lg bg-white">
        <a href="App.js" className="navbar-brand">
          <h2 className="text-dark ms-4">SK Youth Portal</h2>
        </a>
        
        <button type="button" className="navbar-toggler ms-auto me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse " id="navbarCollapse">
          <div className="navbar-nav ms-5 me-10">
            <a className="nav-item nav-link " onClick={() => handleScroll(sections.introRef)}>Home</a>
            <a className="nav-item nav-link" onClick={() => handleScroll(sections.aboutRef)}>About us </a>
            <a className="nav-item nav-link" onClick={() => handleScroll(sections.programRef)}>Programs</a>
            <a className="nav-item nav-link" onClick={() => handleScroll(sections.contactRefRef)}>Contact us</a>
          </div>

          <a className=" login-button btn btn-light " >Log In</a>
          <a className="signup-button btn btn-blue">Sign Up</a>


        </div>
      </nav>
    
  </div>
);

const Intro = () => (
  <div className="container-fluid bg-primary hero-header mb-10">
    <div className="container">
      <div className="row g- align-items-center">
        <div className="col-lg-9 text-center text-lg-start">
          <h3 className="custom-intro-text">Lagi't lagi para sa Kabataan,</h3>
          <h1 className="display-5 text-white animated slideInRight">Barangay at sa Bayan. <span className="custom-name">SK Youth Portal</span></h1>

          
          <p className="custom-intro-details">Western Bicutan</p>
          <a href="" className="intro-button">Explore Now <img src="assets/right-arrow.png"></img> </a>

        </div>

        
        <div className="col-lg-6">
          <img className="img-fluid animated pulse infinite" src="" alt=""/>
        </div>
      </div>
    </div>
  </div>
);



const Programs = () => (
  <div className="container-fluid py-5">
    <div className="container">
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

      <div className="row g-10 justify-content-center mt-3">
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
    </div>
  </div>
);



const Contact  = () => (
  <div className="container-fluid py-5">
    
        <div className="about-container" data-wow-delay="0.5s">
          <h1 className="about-head">NEWS & EVENTS</h1>
          <div className="row g-10 justify-content-center mt-3">
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
          <a className="btn btn-primary py-2 px-4" href="">Find Out More</a>
        </div>
      
    
  </div>
);


const Highlights = () => (
  <div className="container-fluid py-5">
    <div className="container">
        <div className="spotlight-container" data-wow-delay="0.5s">
          <h1 className="spotlight-head">SK YOUTH SPOTLIGHT</h1>
          <a className="spotlight-button" href="">View Gallery</a>
        </div>
      
    </div>
  </div>
);



const About = () => (
  <div className="container-fluid py-5">
    <div className="container">
        <div className="about-container" data-wow-delay="0.5s">
          <h1 className="about-head">SANGGUNIANG KABATAAN - WESTERN BICUTAN</h1>
          <Card>
            <Card.Body>
              <blockquote className="blockquote mb-0">
                <p>
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
    </div>
  </div>
);



const Footer = () => (
  <div className="container-fluid bg-white border-top footer">
    <div className="container wow fadeIn" data-wow-delay="0.1s">
      <div className="row mt-3">
        <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.3s">
          <h5 className="mb-4">Get In Touch</h5>
          <p><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
          <p><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
          <p><i className="fa fa-envelope me-3"></i>info@example.com</p>
         
        </div>

        <div className="col-md-6 col-lg-6 d-flex flex-column justify-content-center align-items-center text-center">
          <div className="mb-5 mb-md-0">
            &copy; <a className="footer-name">SK YOUTH PORTAL</a>
          </div>
          All Rights Reserved 2024.
          <div className="d-flex pt-2">
            <a className="btn btn-square btn-outline-primary me-1" href=""><i className="fab fa-twitter"></i></a>
            <a className="btn btn-square btn-outline-primary me-1" href=""><i className="fab fa-facebook-f"></i></a>
            <a className="btn btn-square btn-outline-primary me-1" href=""><i className="fab fa-instagram"></i></a>
            <a className="btn btn-square btn-outline-primary me-1" href=""><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

       

        <div className="col-md-6 col-lg-3 d-flex flex-column justify-content-center align-items-end text-end">
          <h5 className="mb-3">Popular Links</h5>
          <a className="btn btn-link" to="/mandate">About Us</a>
          <a className="btn btn-link" href="">Contact Us</a>
          <a className="btn btn-link" href="">Privacy Policy</a>
          <a className="btn btn-link" href="">Terms & Condition</a>
        </div>
      </div>
    </div>
  </div>
);


export default App;
