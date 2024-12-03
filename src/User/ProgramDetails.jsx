import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { AuthContext } from '../WebStructure/AuthContext';

const Program_details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location; // Access the passed state
  const { programType } = state || {}; // Destructure programType from state
  const [show, setShow] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (programType === 'Equipment') {
      handleEquipment();
    } else {
      setShow(true);
    }
  };

  const handleAuthorize = (type) => {
    if (isAuthenticated) {
      navigate('/Reservation', { state: { reservationType: type, programType } });
    } else {
      navigate('/userauth');
    }
  };

  const handleEquipment = () => {
    if (isAuthenticated) {
      navigate('/Equipment', { state: { programType } });
    } else {
      navigate('/userauth');
    }
  };

  const handleViewSchedule = () => {
    if (isAuthenticated) {
      // Navigate based on programType
      if (programType === 'Equipment') {
        navigate('/ViewEquipment', { state: { programType } });
      } else if (programType === 'Facilities') {
        navigate('/ViewFacilities', { state: { programType } });
      }
    } else {
      navigate('/userauth');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="text-center text-lg-start m-4">
          <h1 className="Maintext animated slideInRight"> Reservation: {programType}</h1>
          <p className="Subtext">Reserve yours now!</p>

          {(programType === 'Facilities' || programType === 'Equipment') && (
            <button className="LargeButton btn-dark" onClick={handleShow}>
              <i className="bi bi-bookmark" aria-hidden="true"> </i> Book Now
            </button>
          )}

          <button className="LargeButton btn-db" onClick={handleViewSchedule}>
            <i className="bi bi-calendar" aria-hidden="true"></i> View Schedule
          </button>
        </div>
      </div>

      {/* Modal for "Solo or Group" option */}
      {programType === 'Facilities' && show && (
        <div className='ModalOverlayStyles'>
          <div className='ModalStyles large'>
            <button className="closeButton" onClick={handleClose} aria-label="Close">
              <i className="bi bi-x-circle"></i>
            </button>
            <h4>Number of Participants</h4>
            <button className="ModalButtonStyles SmallButton btn-dark small" 
                    onClick={() => handleAuthorize('Solo')}>
              <i className="bi bi-person mb-1"></i> Solo
            </button>
            <button className="ModalButtonStyles SmallButton btn-db small" 
                    onClick={() => handleAuthorize('Group')}>
              <i className="bi bi-people mb-1"></i> Group
            </button>
          </div>
        </div>
      )}

      <div className="ItemContainer">
        <div className="row g-0">
          <div className="col-md-4">
            <img src="..." className="img-fluid rounded-start" alt="..." />
          </div>
          <div className="col-md-8">
            <h5 className="card-title">Description</h5>
            {programType === 'Facilities'
              ? 'This is a facilities description.'
              : 'This is an equipment description.'}
            <h5 className="card-title">Amenities</h5>
            <Card.Img src="holder.js/100px180" />
            <Card.Img src="holder.js/100px180" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Program_details;
