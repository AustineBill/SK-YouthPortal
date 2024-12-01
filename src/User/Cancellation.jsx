import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Breadcrumb, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CancelReservation = () => {
  const [error, setError] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const navigate = useNavigate();

  const reservationId = sessionStorage.getItem('reservationId');

  const fetchReservationDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/reservations/${reservationId}`);
      if (response.status === 200) {
        setReservationDetails(response.data);
      } else {
        setError('No reservation found');
      }
    } catch (error) {
      console.error('Error fetching reservation details:', error);
      setError('Failed to load reservation details');
    }
  }, [reservationId]);

  useEffect(() => {
    fetchReservationDetails();
  }, [fetchReservationDetails]);

  const handleCancellation = async () => {
    if (!isConfirmed) {
      console.log('Cancellation not confirmed');
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:5000/reservations/${reservationId}`);
      if (response.status === 200) {
        setShowModal(true); // Show the modal after successful cancellation
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert("There was an error cancelling your reservation.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5">
        <Breadcrumb.Item onClick={() => navigate("/ReservationLog")}>
          Reservation Log
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Cancellation</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">Reservation Log</h1>
        <p className="Subtext text-danger">Cancellation</p> 
      </div> 

      <Container>
        <div className="cancel-reservation-box p-4 rounded bg-light">
          <h3 className="text-center mb-4">Cancel Reservation</h3>

          {reservationDetails ? (
            <Form.Group className="mb-3">
              <Form.Label>Reservation Details</Form.Label>
              <Container className="bg-light p-4 rounded">
                <Row>
                  <Col xs={12} md={6}>
                    <p><strong>Program:</strong> {reservationDetails.reservation_type}</p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p><strong>Date:</strong> {formatDate(reservationDetails.start_date)} to {formatDate(reservationDetails.end_date)}</p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p><strong>Time Slot:</strong> {reservationDetails.time_slot}</p>
                  </Col>
                </Row>
              </Container>
            </Form.Group>
          ) : (
            <p>{error ? error : 'Loading reservation details...'}</p>
          )}

          <Form.Group className="mb-4">
            <Form.Label>Reason for Cancellation</Form.Label>
            <Form.Check
              type="radio"
              id="reason1"
              name="cancelReason"
              label="Conflicting Priorities"
              className="mb-2"
              onChange={() => setSelectedReason("Conflicting Priorities")}
            />
            <Form.Check
              type="radio"
              id="reason2"
              name="cancelReason"
              label="Health Issues"
              className="mb-2"
              onChange={() => setSelectedReason("Health Issues")}
            />
            <Form.Check
              type="radio"
              id="reason3"
              name="cancelReason"
              label="Personal Emergency"
              onChange={() => setSelectedReason("Personal Emergency")}
            />
            <Form.Check
              type="radio"
              id="reason4"
              name="cancelReason"
              label="Other"
              onChange={() => setSelectedReason("Other")}
            />
            {selectedReason === "Other" && (
              <Form.Group className="mt-3">
                <Form.Label>Please specify:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your reason"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              </Form.Group>
            )}
          </Form.Group>

          <Form.Check
            type="checkbox"
            id="confirmCheck"
            label="I confirm this is my final reason for cancellation."
            className="mb-4"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            disabled={!selectedReason}
          />

          <Row className="justify-content-end">
            <Col xs="auto">
              <Button variant="secondary" className="btn-danger" disabled={!isConfirmed} onClick={handleCancellation}>
                Confirm
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-secondary"
                className="btn-dark text-white"
                onClick={() => {
                  sessionStorage.removeItem('reservationId'); 
                  navigate("/ReservationLog");
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="ModalOverlayStyles">
            <div className="ModalStyles large">
              <button
                className="closeButton"
                onClick={() => {
                  setShowModal(false);
                  navigate("/ReservationLog");
                }}
                aria-label="Close"
              >
                <i className="bi bi-x-circle"></i>
              </button>
              <div className="text-center">
                <i className="bi bi-check2-circle text-danger" style={{ fontSize: '4rem' }}></i>
                <h2 className="mt-3 mb-3">Your reservation cancelled successfully!</h2>
                <p>We hope to see you again soon.</p>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Button
                  variant="dark"
                  className="btn-dark"
                  onClick={() => navigate("/ReservationLog")}
                >
                  <i className="bi bi-house m-1"></i> 
                    Return to Log
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CancelReservation;
