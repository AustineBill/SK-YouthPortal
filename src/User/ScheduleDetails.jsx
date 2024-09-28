import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Row, Col, Button, Form} from 'react-bootstrap';
import '../user-style.css'; // Import your custom styling

import StepIndicator from '../Classes/StepIndicator';

const ScheduleDetails = () => {
    const navigate = useNavigate();

  return (
    <div className="calendar-container">
        <div className="text-center text-lg-start mt-4 ">
            <h1 className="Maintext-Calendar animated slideInRight">Schedule</h1>
                <p className='Subtext-Calendar'>Lorem ipsum</p> 
        </div>

    <StepIndicator currentStep={2} />

    <Form className="ScheduleInfo">
        <Form.Group className="mb-3" controlId="formFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter full name" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAge">
          <Form.Label>Age</Form.Label>
          <Form.Control type="number" placeholder="Enter age" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
      </Form>

      {/* Navigation Buttons */}
      <Row className="mt-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate('/Reservation')}>
            <i className="bi bi-arrow-left"></i> Previous
          </Button>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => navigate('/ScheduleDone')} >
            Next <i className="bi bi-arrow-right"></i>
          </Button>
        </Col>
      </Row>

    </div>
  );
};

export default ScheduleDetails;
