import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import '../WebStyles/UserStyle.css';
import StepIndicator from '../Classes/StepIndicator';

const ScheduleDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationType } = location.state || { reservationType: 'Solo' };

  // Initialize participants based on reservationType
  const initialParticipants = reservationType === 'Group' 
    ? Array(5).fill({ fullName: '' }) // Only "Full Name" for each participant in group
    : [{ fullName: '', age: '', email: '' }]; // One full form for solo

  const [errorMessage, setErrorMessage] = useState('');
  const [participants, setParticipants] = useState(initialParticipants);
  const [sharedDetails, setSharedDetails] = useState({ age: '', email: '' });

  const handleInputChange = (index, field, value) => {
    if (field === 'fullName') {
      const updatedParticipants = [...participants];
      updatedParticipants[index][field] = value;
      setParticipants(updatedParticipants);
    } else {
      setSharedDetails((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = () => {
    setErrorMessage('');
    
    if (reservationType === 'Group') {
      const filledCount = participants.filter(participant => participant.fullName).length;
      if (filledCount < 5 || !sharedDetails.age || !sharedDetails.email) {
        setErrorMessage("Please fill out all participant names and shared age and email.");
        return;
      }
    } else {
      const { fullName, age, email } = participants[0];
      if (!fullName || !age || !email) {
        setErrorMessage("Please fill out your information.");
        return;
      }
    }
    navigate('/ScheduleDone');
  };

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start mt-4 ">
        <h1 className="Maintext animated slideInRight">Schedule</h1>
          <p className="Subtext">Please provide your details below</p> 
      </div>

      <StepIndicator currentStep={2} />

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Form className="ScheduleInfo">
        {participants.map((participant, index) => (
          <Row key={index} className="mb-3">
            <Form.Group as={Col} controlId={`formFullName${index}`}>
              <Form.Label>Full Name {index + 1}</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter full name" 
                value={participant.fullName}
                onChange={(e) => handleInputChange(index, 'fullName', e.target.value)}
              />
            </Form.Group>
          </Row>
        ))}

        {reservationType === 'Group' && (
          <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formSharedAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter age"
                  value={sharedDetails.age}
                  onChange={(e) => handleInputChange(null, 'age', e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formSharedEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={sharedDetails.email}
                  onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                />
              </Form.Group>
            </Row>
          </>
        )}

        {reservationType === 'Solo' && (
          <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formSoloAge">
                <Form.Label>Age</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Enter age" 
                  value={participants[0].age}
                  onChange={(e) => handleInputChange(0, 'age', e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formSoloEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={participants[0].email}
                  onChange={(e) => handleInputChange(0, 'email', e.target.value)}
                />
              </Form.Group>
            </Row>
          </>
        )}

        <Button variant="success" onClick={handleNext} className="mt-3">
          Next
        </Button>
        
      </Form>
    </div>
  );
};

export default ScheduleDetails;
