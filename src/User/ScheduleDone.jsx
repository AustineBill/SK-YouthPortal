import React, { useState } from 'react';
import StepIndicator from '../Classes/StepIndicator';
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ScheduleDone() {
  const [currentStep, setCurrentStep] = useState(0);
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleConfirm = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Container>
      <StepIndicator currentStep={3} />
      <h2>Schedule</h2>
      <p>Lorem ipsum dolor sit amet consectetur.</p>
      <Form>
        {currentStep === 0 && (
          <>
            <Form.Group controlId="formProgram">
              <Form.Label>Program</Form.Label>
              <Form.Control type="text" placeholder="Program" disabled />
            </Form.Group>
            <Form.Group controlId="formDateTime">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control type="text" placeholder="Date & Time" />
            </Form.Group>
          </>
        )}
        {currentStep === 1 && (
          <>
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
          </>
        )}
      </Form>
      
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {currentStep === 2 ? 'Confirm' : 'Next'}
        </Button>
      </div>
    </Container>
  );
}

export default ScheduleDone;
