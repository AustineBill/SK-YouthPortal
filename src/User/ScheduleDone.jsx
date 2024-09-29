import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../Classes/StepIndicator';
import { Button, Form, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ScheduleDone() {
  const navigate = useNavigate();
  const [currentStep] = useState(2);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleConfirm = () => setShow(true);

  const handlePrevious = () => {
    navigate('/ScheduleDetails');
  };

  
  return (
    <div className="calendar-container">
        <div className="text-center text-lg-start mt-4 ">
            <h1 className="Maintext-Calendar animated slideInRight">Schedule</h1>
                <p className='Subtext-Calendar'>Lorem ipsum</p> 
        </div>
      <StepIndicator currentStep={3} />
      <Form>
        <Form.Group controlId="formProgram">
          <Form.Label>Program</Form.Label>
            <Form.Control type="text" placeholder="Program" disabled />
        </Form.Group>
        <Form.Group controlId="formDateTime">
          <Form.Label>Date & Time</Form.Label>
            <Form.Control type="text" placeholder="Date & Time" />
        </Form.Group>
      
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" />
        </Form.Group>
        <Form.Group controlId="formAge">
          <Form.Label>Age</Form.Label>
            <Form.Control type="number" placeholder="Age" />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Email Address" />
          </Form.Group>
      </Form>


      <Modal  show={show} onHide={handleClose} centered size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>Number of Participants</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
        <div className="text-center"> {/* Use 'text-center' for centering */}
          <i className="bi bi-bookmark-check-fill" style={{ fontSize: '6rem' }}></i>
          <h2 className="mt-3">Appointment Scheduled!</h2> {/* Add margin top for spacing */}
          <h4 className="mt-2">
            Your schedule has been successfully set. Please click the button below to acknowledge the contract and waiver, 
            which you will need to present when you arrive for your appointment.
          </h4>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100 d-flex justify-content-between"> {/* Use flex utilities to space buttons */}
          <Button variant="primary" onClick={() => navigate('/Reservation')}>
            <i className="bi bi-file-text m-2" style={{ fontSize: '2rem' }}></i>
            Proceed to Waiver
          </Button>

          <Button variant="primary" onClick={() => navigate('/Reservation')}>
            <i className="bi bi-house-door m-2" style={{ fontSize: '2rem' }}></i>
            Back to Home
          </Button>
        </div>
      </Modal.Footer>
      </Modal>

      
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {currentStep === 2 ? 'Confirm' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

export default ScheduleDone;
