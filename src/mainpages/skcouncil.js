import React from 'react';
import { Link } from 'react-router-dom';

const Council = () => (
  <div className="container-fluid">
    <div className="text-center text-lg-start m-4 mv-8">
      <h1 className="Maintext animated slideInRight">SK Council</h1>
        <p className='Subtext'>Lorem ipsum</p> 
    </div> 

    <div className ="council-container">
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="img_avatar.png" alt="Avatar" />
            <h1>John Doe</h1>
            <p class="title">CEO & Founder, Example</p>
            <p>Harvard University</p>
              <Link to="/"><i class="fa fa-dribbble"></i></Link>
              <Link to="/"><i class="fa fa-twitter"></i></Link>
              <Link to="/"><i class="fa fa-linkedin"></i></Link>
              <Link to="/"><i class="fa fa-facebook"></i></Link>
          </div>
          <div class="flip-card-back">
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </div>
        </div>
      </div>

      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="img_avatar.png" alt="Avatar" />
            <h1>John Doe</h1>
            <p class="title">CEO & Founder, Example</p>
            <p>Harvard University</p>
              <Link to="/"><i class="fa fa-dribbble"></i></Link>
              <Link to="/"><i class="fa fa-twitter"></i></Link>
              <Link to="/"><i class="fa fa-linkedin"></i></Link>
              <Link to="/"><i class="fa fa-facebook"></i></Link>
          </div>
          <div class="flip-card-back">
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </div>
        </div>
      </div>

      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="img_avatar.png" alt="Avatar" />
            <h1>John Doe</h1>
            <p class="title">CEO & Founder, Example</p>
            <p>Harvard University</p>
              <Link to="/"><i class="fa fa-dribbble"></i></Link>
              <Link to="/"><i class="fa fa-twitter"></i></Link>
              <Link to="/"><i class="fa fa-linkedin"></i></Link>
              <Link to="/"><i class="fa fa-facebook"></i></Link>
          </div>
          <div class="flip-card-back">
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </div>
        </div>
      </div>

      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="img_avatar.png" alt="Avatar" />
            <h1>John Doe</h1>
            <p class="title">CEO & Founder, Example</p>
            <p>Harvard University</p>
              <Link to="/"><i class="fa fa-dribbble"></i></Link>
              <Link to="/"><i class="fa fa-twitter"></i></Link>
              <Link to="/"><i class="fa fa-linkedin"></i></Link>
              <Link to="/"><i class="fa fa-facebook"></i></Link>
          </div>
          <div class="flip-card-back">
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </div>
        </div>
      </div>

      

      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="img_avatar.png" alt="Avatar" />
          </div>
          <div class="flip-card-back">
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </div>
        </div>
      </div>

    </div>




  </div>
);

export default Council
;
