import React from 'react';
import {Card, Button} from 'react-bootstrap';

import Location from "../Asset/location.png"


const Contact = () => (
  <div className="container-fluid">
    <div className="row">
      <div className="text-center text-lg-start m-4 mv-8">
        <h1 className="Maintext animated slideInRight">Get in Touch</h1>
          <p className='Subtext'>Reserve yours now!</p>

          <div className="d-flex justify-content-center mb-3 ">
            <Card className="ContactCard mx-2">
              <i className="bi bi-phone fa-4x"></i>
              <Card.Body>
                <Card.Text>Number</Card.Text>
              </Card.Body>
            </Card>

            <Card className="ContactCard mx-2">
              <i className="bi bi-geo-alt fa-4x"></i>
              <Card.Body>
                <Card.Text>Location</Card.Text>
              </Card.Body>
            </Card>

            <Card className="ContactCard mx-2">
              <i className="bi bi-envelope fa-4x"></i>
              <Card.Body>
                <Card.Text>@gmail.com</Card.Text>
              </Card.Body>
            </Card>
          </div>
      </div>
    </div> 

    <div className=" bg-secondary">
      <div className="DividerType2">
        <h1 className="DividerText">SK Youth - Western Bicutan is open from Monday to Friday from 8:00 AM - 5 PM</h1>
      </div>
    </div>
    <p className='Text-3'>Find us here!</p>
    <div className="d-flex justify-content-center">
      <img src={Location} alt="Location" />
    </div>
    <div className="d-flex justify-content-center">
      <Button variant ="dark"><i className="bi bi-hand-index me-3"></i>Appoint with us</Button>
    </div>`
</div>
);
export default Contact;
