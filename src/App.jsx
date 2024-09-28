import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


import Navbar from "./Classes/Navbar"
import Footer from "./Classes/Footer"


/*Main Pages*/
import OverviewProgram from "./Mainpages/program";
import Contact from "./Mainpages/contactus";
import About from "./Mainpages/aboutus";
import Spotlight from './Mainpages/spotlight';
import NewsEvents from './Mainpages/news';
  import ViewDetailed from './Mainpages/news-details';



/*Sub Pages*/
import Mandate from "./Mainpages/mandate";
import Youth from "./Mainpages/aboutus";
import Council from "./Mainpages/skcouncil";
import Former from "./Mainpages/former_sk";
import History from "./Mainpages/history";
import UserAuthentication from './Classes/UserAuthentication';



/*User Side*/ 
import Dashboard from "./User/Dashboard"
import Programs from "./User/user_program"
import Log from "./User/log"
import HelpSupport from "./User/help_support"
import ProgramDescript from './User/program_details';

import Reservation from './User/Reservation';

import './App.css';
import './style.css';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';




import rightArrow from "./Assets/right-arrow.png"
import Cover from "./Assets/bg.png"



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
            <div className="content"> 
              <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="/overview" element={<OverviewProgram />} />
                <Route path="/about" element={<About />} />
                  <Route path="/mandate" element={<Mandate />} />
                  <Route path="/youth" element={<Youth />} />
                  <Route path="/council" element={<Council />} />
                  <Route path="/former_sk" element={<Former />} />
                  <Route path="/history" element={<History />} />
                <Route path="/contactus" element={<Contact />} />
                <Route path="/userauth" element={<UserAuthentication />} />

                <Route path="/spotlight" element={<Spotlight />} />
                <Route path="/news" element={<NewsEvents />} />
                  <Route path="/news-details/:id" element={<ViewDetailed />} />
                  
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/programs" element={<Programs />} />
                  <Route path="/program_details" element={<ProgramDescript />} />
                <Route path="/log" element={<Log />} />
                <Route path="/Reservation" element={<Reservation />} />
                //<Route path="/contact" element={<HelpSupport />} />
                
               
              </Routes>
            </div>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
};


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
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
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


export default App;
