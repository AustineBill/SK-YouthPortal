import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../Classes/StepIndicator';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios'; // Make sure you import axios

function ScheduleDone() {
  const navigate = useNavigate();
  const [currentStep] = useState(3); // Assuming step 2 is the confirmation step
  const [show, setShow] = useState(false);
  const [allData, setAllData] = useState({}); // State to hold all reservation data

  const generateReservationId = () => {
    return `REF-${Math.floor(100000 + Math.random() * 900000)}`; // Generate a 6-digit unique ID
  };

  const saveReservationToDatabase = async (reservationData) => {
    try {
      await axios.post('http://localhost:5000/reservations', reservationData);
      console.log('Reservation saved successfully in the database.');
    } catch (error) {
      console.error('Error saving reservation to the database:', error);
    }
  };

  const handleClose = () => setShow(false);
  const handleConfirm = () => setShow(true);
  const handlePrevious = () => {
    navigate('/ScheduleDetails');
  };

  const handleWaiverClick = async () => {
    try {
      // Save reservation data to the database
      await saveReservationToDatabase(allData);

      // Navigate to the waiver page
      navigate('/Waiver');
    } catch (error) {
      console.error('Error during reservation process:', error);
    }
  };

  useEffect(() => {
    let reservationData = JSON.parse(sessionStorage.getItem('reservationData')) || {};
    const scheduleDetails = JSON.parse(sessionStorage.getItem('scheduleDetails')) || {};

    // Generate reservation ID if it doesn't already exist
    if (!reservationData.reservationId) {
      reservationData.reservationId = generateReservationId();
      sessionStorage.setItem('reservationData', JSON.stringify(reservationData)); // Save back to sessionStorage
    }

    setAllData({ ...reservationData, ...scheduleDetails });
  }, []);

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mb-4">
        <h1 className="Maintext animated slideInRight">Reservation Confirmation</h1>
        <p className="Subtext text-muted">Please review your booking details below.</p>
      </div>

      <div className="calendar-container">
        <StepIndicator currentStep={currentStep} />

        <Card className="shadow-sm mt-4 border-0">
          <Card.Body>
            <div className="text-center mb-3">
              <h2 className="fw-bold">Reservation</h2>
              <p className="text-muted">
                Booking Reference: <strong>{allData.reservationId || 'N/A'}</strong>
              </p>
            </div>
            <hr />

            <Row>
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
        {show && (
          <div className="ModalOverlayStyles">
            <div className="ModalStyles large">
              <button className="closeButton" onClick={handleClose} aria-label="Close">
                <i className="bi bi-x-circle"></i>
              </button>
              <div className="text-center">
                <i className="bi bi-check2-circle text-success" style={{ fontSize: '4rem' }}></i>

                <h2 className="mt-3 mb-3">Your reservation is confirmed!</h2>
                <p>
                  Thank you for booking with us. Please proceed to Waiver for Rules and Policy.
                </p>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="ModalButtonStyles SmallButton btn-dark small"
                  onClick={handleWaiverClick}
                >
                  <i className="bi bi-file-earmark mb-1"></i> View Waiver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="ModalButtonStyles SmallButton btn-dark super-small"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className="ModalButtonStyles SmallButton btn-db super-small"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDone;
