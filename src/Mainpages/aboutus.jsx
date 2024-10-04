import React from 'react';  
import Cover from "../Assets/bg.png"

const About = () => (
  <div className="container-fluid">

    <div className="text-center text-lg-start m-4 mv-8">
      <h1 className="Maintext animated slideInRight">SK Youth</h1>
        <p className='Subtext'>The Team at your Service</p> 
    </div>

    <div className="d-flex justify-content-center ">
      <div id="youthCarousel" className="carousel w-75 mb-2" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#youthCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#youthCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#youthCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active bg-dark">
            <img src={Cover} className="d-block w-100 " alt="Youth Slide 1"></img>
          </div>
          <div className="carousel-item bg-primary">
            <img src={Cover} className="d-block w-100" alt="Youth Slide 2"></img>
          </div>
          <div className="carousel-item bg-secondary">
            <img src={Cover} className="d-block w-100" alt="Youth Slide 3"></img>
          </div>
        </div>

          <button className="carousel-control-prev " type="button" data-bs-target="#youthCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button className="carousel-control-next " type="button" data-bs-target="#youthCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
      </div>
    </div>

    <div className="youth-container">
      <h1 className="youth-head">SANGGUNIANG KABATAAN - WESTERN BICUTAN</h1>
        <p className="yout-text-content">SANGGUNIANG KABATAAN - WESTERN BICUTAN</p>
        
    </div>
  </div>
);

export default About;
