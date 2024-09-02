import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';



import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


/*Main Pages*/
import Programs from "./mainpages/program";
import Contact from "./mainpages/contactus";
import About from "./mainpages/aboutus";


/*Sub Pages*/
import Mandate from "./pages/mandate";

import './App.css';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import rightArrow from "./assets/right-arrow.png"
import Cover from "./assets/bg.png"


const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div>
        {loading ? (
          <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Intro />} />
              <Route path="/mandate" element={<Mandate />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              {/* Add more routes as needed */}
            </Routes>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
};

const Navbar = () => (
  <div className="container-fluid sticky-top">
    <nav className="navbar navbar-expand-lg bg-white">

      <Link to="/" className="navbar-brand">
        <h2 className="Website-Name" style={{ fontFamily: "'Sansita Swashed', cursive" }}>SK Youth </h2>
      </Link>
      
      <button type="button" className="navbar-toggler ms-auto me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-5 me-10">
          <Link className="nav-item nav-link" to="/">Home</Link>
          <Link className="nav-item nav-link" to="/about">About Us</Link>
          <Link className="nav-item nav-link" to="/programs">Programs</Link>
          <Link className="nav-item nav-link" to="/contact">Contact Us</Link>
        </div>

        <Link className="login-button btn btn-outline-dark" to="/login">Log In</Link>
        <Button className="signup-button " to="/signup">Sign Up</Button>
      </div>
    </nav>
  </div>
);

const Intro = () => (
  <div className="container-fluid">
    <div className="intro-container hero-header bg-primary ">
      <div className="row g- align-items-center mb-15">
        <div className="col-lg-12 text-center text-lg-start ms-5 ">
          <h1 className="intro-text">Lagi't lagi para sa Kabataan,</h1>
          <h1 className="custom-intro-text animated slideInRight">Barangay at sa Bayan. <span className="custom-name">SK Youth Portal</span></h1>
          <p className="custom-intro-details">Western Bicutan</p>
          <button className="intro-button">Explore Now <img src={rightArrow} className="arrow" alt="Right Arrow" /></button>
        </div>
      </div>
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

        <h1 className="NewEve-head">NEWS & EVENTS</h1>
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

          <Link className="btn btn-primary py-2 px-4 mb-5">Find Out More</Link>

        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div class="carousel-item active bg-dark">
              <img src={Cover} class="d-block w-100" alt="..."></img>
            </div>
            <div class="carousel-item bg-primary">
              <img src={Cover} class="d-block w-100" alt="..."></img>
            </div>
            <div class="carousel-item bg-secondary">
            <img src={Cover} class="d-block w-100" alt="..."></img>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>


        <div className="spotlight-container">
            <h1 className="spotlight-head">SK YOUTH SPOTLIGHTS</h1>
              <Link className="spotlight-button">View Gallery</Link>
        </div>


        <div className="about-container" data-wow-delay="0.5s">
          <h1 className="about-head">SANGGUNIANG KABATAAN - WESTERN BICUTAN</h1>
          <Card className="BlockQuote">
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
          <div className="text-content">
            <h1 style={{ fontFamily: "'Sansita Swashed', cursive" }} className="Text-1">Connect with us.</h1>
            <h1 style={{ fontFamily: "'Sansita Swashed', cursive" }} className="Text-2">Be part of the SK Youth Community</h1>
            <h3  style={{ fontFamily: "'Poppins', sans-serif" }} className="Text-3"> Create your Profile today.</h3>
          </div> 
        </div>

  </div>
);


const Footer = () => (
  <div className="container-fluid bg-secondary border-top footer">
    
      <div className="row">
        <div className="col-md-2 col-lg-3 mt-2 wow fadeIn" data-wow-delay="0.3s">
          <h5 className="mb-1">Get In Touch</h5>
          <p><i className="fa fa-map-marker-alt me-3 mb-1"></i>123 Street, New York, USA</p>
          <p><i className="fa fa-phone-alt me-3mb-1"></i>+012 345 67890</p>
          <p><i className="fa fa-envelope me-3mb-1"></i>info@example.com</p>
        </div>

        <div className="col-md-4 col-lg-6 d-flex flex-column justify-content-center align-items-center text-center">
          <div className="mb-5 mb-md-0">
            &copy; <a className="footer-name">SK YOUTH</a>
          </div>
          All Rights Reserved 2024.
          <div className="d-flex pt-2">
            <a className="btn btn-square btn-outline-light me-1" href=""><i className="fab fa-twitter"></i></a>
            <a className="btn btn-square btn-outline-light me-1" href=""><i className="fab fa-facebook-f"></i></a>
            <a className="btn btn-square btn-outline-light me-1" href=""><i className="fab fa-instagram"></i></a>
            <a className="btn btn-square btn-outline-light me-1" href=""><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

       

        <div className="col-md-5 col-lg-3 d-flex flex-column justify-content-center align-items-end text-end">
          <h5 className="mb-0">Popular Links</h5>
          <a className="btn btn-link" to="/mandate">About Us</a>
          <a className="btn btn-link" href="">Contact Us</a>
          <a className="btn btn-link" href="">Privacy Policy</a>
          <a className="btn btn-link" href="">Terms & Condition</a>
        </div>
      </div>
   
  </div>
);


export default App;
