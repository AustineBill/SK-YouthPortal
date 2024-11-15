import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../Classes/StepIndicator';
import { Button, Modal, Row, Col, Card, Table } from 'react-bootstrap';

function ScheduleDone() {
  const navigate = useNavigate();
  const [currentStep] = useState(2); // Assuming step 2 is the confirmation step
  const [show, setShow] = useState(false);
  const [allData, setAllData] = useState({}); // State to hold all reservation data

  const handleClose = () => setShow(false);
  const handleConfirm = () => setShow(true);
  const handlePrevious = () => {
    navigate('/ScheduleDetails');
  };

  useEffect(() => {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
    const scheduleDetails = JSON.parse(localStorage.getItem('scheduleDetails')) || {};
    setAllData({ ...reservationData, ...scheduleDetails });
  }, []);

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="Maintext animated slideInRight">Reservation Confirmation</h1>
        <p className="Subtext text-muted">
          Please review your booking details below. Confirm to finalize your reservation.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Confirmation Details */}
      <Card className="shadow-sm mt-4 border-0">
        <Card.Body>
          <div className="text-center mb-3">
            <h2 className="fw-bold">Reservation</h2>
            <p className="text-muted">Booking Reference: <strong>{allData.reservationId || 'N/A'}</strong></p>
          </div>
          <hr />

          {/* Details Section */}
          <Row>
            {/* Reservation Details */}
            <Col md={6}>
              <h5 className="text-primary">Reservation Details</h5>
              <Table bordered hover size="sm" className="mt-3">
                <tbody>
                  <tr>
                    <td><strong>Type:</strong></td>
                    <td>{allData.reservation_type || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Start Date:</strong></td>
                    <td>{new Date(allData.start_date).toLocaleDateString() || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>End Date:</strong></td>
                    <td>{new Date(allData.end_date).toLocaleDateString() || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Time Slot:</strong></td>
                    <td>{allData.time_slot || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>

            {/* Participant Details */}
            <Col md={6}>
              <h5 className="text-primary">Participant Details</h5>
              {allData.reservation_type === 'Group' ? (
                <>
                  <p className="mt-3"><strong>Shared Age:</strong> {allData.sharedDetails?.age || 'N/A'}</p>
                  <p><strong>Shared Email:</strong> {allData.sharedDetails?.email || 'N/A'}</p>
                  <h6 className="mt-3">Participants:</h6>
                  <ul>
                    {allData.participants?.map((participant, index) => (
                      <li key={index}>
                        {participant.fullName} ({participant.age} years old)
                      </li>
                    )) || <li>N/A</li>}
                  </ul>
                </>
              ) : (
                <Table bordered hover size="sm" className="mt-3">
                  <tbody>
                    <tr>
                      <td><strong>Full Name:</strong></td>
                      <td>{allData.participants?.[0]?.fullName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Age:</strong></td>
                      <td>{allData.participants?.[0]?.age || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{allData.participants?.[0]?.email || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i className="bi bi-bookmark-check-fill text-success" style={{ fontSize: '5rem' }}></i>
          <h3 className="mt-3">Your reservation is confirmed!</h3>
          <p>
            Thank you for booking with us. Please download or print the acknowledgment
            and bring it along for your appointment.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={() => navigate('/Reservation')}>
            View Contract & Waiver
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-secondary" onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default ScheduleDone;
