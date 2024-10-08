import React from 'react';
import Card from 'react-bootstrap/Card';

import Location from "../Asset/location.png"


const Contact = () => (
  <div className="container-fluid">
  <div className="row">
    <div className="text-center text-lg-start m-4 mv-8">
      <h1 className="Maintext animated slideInRight">Get in Touch</h1>
        <p className='Subtext'>Reserve yours now!</p>

        <div className="d-flex justify-content-center mb-3 ">
          <Card className="contact-card mx-2">
            <i className="bi bi-phone fa-4x"></i>
            <Card.Body>
              <Card.Text>Number</Card.Text>
            </Card.Body>
          </Card>

          <Card className="contact-card mx-2">
            <i className="fa fa-map-marker-alt fa-4x" aria-hidden="true"></i>
            <Card.Body>
              <Card.Text>Location</Card.Text>
            </Card.Body>
          </Card>

          <Card className="contact-card mx-2">
            <i className="bi bi-envelope fa-4x"></i>
            <Card.Body>
              <Card.Text>@gmail.com</Card.Text>
            </Card.Body>
          </Card>

          <Card className="contact-card mx-2">
            <i class="bi bi-telephone fa-4x"></i>
            <Card.Body>
              <Card.Text>Telefax</Card.Text>
            </Card.Body>
          </Card>
        </div>
    </div>
  </div> 

  <div className=" bg-secondary">
    <div className="contact-divider">
      <h1 className="contact-divider-text">SK Youth - Western Bicutan is open from Monday to Friday from 8:00 AM - 5 PM</h1>
    </div>
  </div>

  <p className='contact-p'>Find us here!</p>

  <div className="d-flex justify-content-center">
    <img src={Location} className="contact-img " alt="Location" />
  </div>

  <div className="d-flex justify-content-center">
    <button className="contact-button"><i class="bi bi-hand-index me-3"></i>Appoint with us</button>
  </div>
</div>
);
export default Contact;
