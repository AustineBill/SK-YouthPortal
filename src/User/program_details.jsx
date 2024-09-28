import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import '../App.css';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Program_details = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="text-center text-lg-start m-4">
          <h1 className="Maintext animated slideInRight">Appointment</h1>
          <p className='Subtext'>Reserve yours now!</p>
          <button className="prog-book-button" onClick={() => navigate('/Reservation')}>
            <i className="fa fa-bookmark"></i> Book Now
          </button>
          <button className="prog-view-button" onClick={() => navigate('/ViewSchedule')}>
            <i className="fa fa-calendar" aria-hidden="true"></i> View Schedule
          </button>
        </div>
      </div>

      <div className="prog-descripton">
        <div className="row g-0">
          <div className="col-md-4">
            <img src="..." className="img-fluid rounded-start" alt="..." />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">Description</h5>
              <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
              <h5 className="card-title">Amenities</h5>
              <Card.Img src="holder.js/100px180" />
              <Card.Img src="holder.js/100px180" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Program_details;
