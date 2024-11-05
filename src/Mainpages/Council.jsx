import React from 'react';
import {Breadcrumb} from 'react-bootstrap';
import { Link, useNavigate} from 'react-router-dom';

const Council = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5">
        <Breadcrumb.Item onClick={() => navigate('/About')}>About</Breadcrumb.Item>
          <Breadcrumb.Item active>SK Council</Breadcrumb.Item>
      </Breadcrumb>
        <div className="text-center text-lg-start m-4 mv-8">
          <h1 className="Maintext animated slideInRight">SK Council</h1>
            <p className='Subtext'>Lorem ipsum WEQWEQWEQWE</p> 
        </div> 

        <div className ="council-container">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="img_avatar.png" alt="Avatar" />
                <h1>John Doe</h1>
                <p className="title">CEO & Founder, Example</p>
                <p>Harvard University</p>
                  <Link to="/"><i className="fa fa-dribbble"></i></Link>
                  <Link to="/"><i className="fa fa-twitter"></i></Link>
                  <Link to="/"><i className="fa fa-linkedin"></i></Link>
                  <Link to="/"><i className="fa fa-facebook"></i></Link>
              </div>
              <div className="flip-card-back">
                <h1>John Doe</h1>
                <p>Architect & Engineer</p>
                <p>We love that guy</p>
              </div>
            </div>
          </div>

          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="img_avatar.png" alt="Avatar" />
                <h1>John Doe</h1>
                <p className="title">CEO & Founder, Example</p>
                <p>Harvard University</p>
                  <Link to="/"><i className="fa fa-dribbble"></i></Link>
                  <Link to="/"><i className="fa fa-twitter"></i></Link>
                  <Link to="/"><i className="fa fa-linkedin"></i></Link>
                  <Link to="/"><i className="fa fa-facebook"></i></Link>
              </div>
              <div className="flip-card-back">
                <h1>John Doe</h1>
                <p>Architect & Engineer</p>
                <p>We love that guy</p>
              </div>
            </div>
          </div>

          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="img_avatar.png" alt="Avatar" />
              </div>
              <div className="flip-card-back">
                <h1>John Doe</h1>
                <p>Architect & Engineer</p>
                <p>We love that guy</p>
              </div>
            </div>
          </div>

        </div>
      </div>

  )
}
  

export default Council
;
