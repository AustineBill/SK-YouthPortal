import React, { useState, useEffect, useCallback} from 'react';
import { Container, Row, Col, Button, Breadcrumb, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CancelReservation = () => {
  const [error, setError] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);

  
  
  const navigate = useNavigate();

  const reservationId = sessionStorage.getItem('reservationId');  // Get reservation ID from sessionStorage
  //console.log('Reservation', reservationId )

  const fetchReservationDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/reservations/${reservationId}`);
      console.log('Fetched reservation:', response.data);  // Log the fetched data
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
      console.log('Cancellation response:', response); // Log the cancellation response
      if (response.status === 200) {
        alert("Your reservation has been cancelled successfully.");
        navigate("/ReservationLog");  // Redirect after successful cancellation
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert("There was an error cancelling your reservation.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', // Long weekday name (e.g., Monday)
      year: 'numeric', // Full year (e.g., 2024)
      month: 'long', // Full month name (e.g., November)
      day: 'numeric', // Day of the month
    });
  };
  

  return (
    <div className="container-fluid">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="ms-5">
        <Breadcrumb.Item onClick={() => navigate("/ReservationLog")}>
          Reservation Log
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Cancellation</Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">Reservation Log</h1>
        <p className="Subtext text-danger">Cancellation</p> 
      </div> 

      <Container>
        {/* Cancel Reservation Box */}
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

          {/* Reason for Cancellation */}
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

            {/* Text Input for 'Other' Reason */}
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

          {/* Confirmation Checkbox */}
          <Form.Check
            type="checkbox"
            id="confirmCheck"
            label="I confirm this is my final reason for cancellation."
            className="mb-4"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            disabled={!selectedReason} // Disable checkbox until a reason is selected
          />

          {/* Buttons */}
          <Row className="justify-content-end">
            <Col xs="auto">
              <Button variant="secondary" className="btn-danger" disabled={!isConfirmed} onClick={handleCancellation}>
                Confirm
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" className="btn-dark text-white" 
                onClick={() => {
                  sessionStorage.removeItem('reservationId'); 
                  navigate("/ReservationLog") }}>
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default CancelReservation;