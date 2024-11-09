import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { AuthContext } from '../WebStructure/AuthContext';



const Program_details = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAuthorize = (type) => {
    if (isAuthenticated) {
      navigate('/Reservation', { state: { reservationType: type } });
    } else {
      navigate('/userauth');
    }
  };

  const handleViewSchedule = () => {
    if (isAuthenticated) {
      navigate('/ViewSchedule');
    } else {
      navigate('/userauth');
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="text-center text-lg-start m-4">
          <h1 className="Maintext animated slideInRight">Appointment</h1> 
          <p className='Subtext'>Reserve yours now!</p>

          <button className="LargeButton btn-dark" onClick={handleShow}>
            <i className="bi bi-bookmark" aria-hidden="true"> </i> Book Now
          </button>
          <button className="LargeButton btn-db" onClick={handleViewSchedule}>
            <i className="bi bi-calendar" aria-hidden="true"></i> View Schedule
          </button>
        </div>
      </div>

      <Modal  show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Number of Participants</Modal.Title>
        </Modal.Header>
        
          <Modal.Body>
            <div className="d-flex justify-content-around">
              <Button className="ButtonCard d-flex flex-column align-items-center" onClick={() => handleAuthorize('Solo')}
                style={{ backgroundColor: '#25327A', borderColor: '25327A' }}>
                <i className="bi bi-person mb-1" style={{ fontSize: '10rem' }}></i>
                <span style={{ fontSize: '2rem', color: '#fff' }}>Solo</span>
              </Button>
              <Button className="ButtonCard d-flex flex-column align-items-center " onClick={() => handleAuthorize('Group')}
                style={{ backgroundColor: '#25327A', borderColor: '25327A' }}>
                <i className="bi bi-people mb-1 " style={{ fontSize: '10rem' }}></i>
                <span style={{ fontSize: '2rem', color: '#fff' }}>Group</span>
              </Button>
            </div>
          </Modal.Body>
        </Modal>

      <div className="ItemContainer">
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
