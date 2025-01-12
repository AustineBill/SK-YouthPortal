import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Breadcrumb, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CancelReservation = () => {
  const [error, setError] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const reservationId = sessionStorage.getItem("reservationId");
  const reservationType = sessionStorage.getItem("reservationType"); // Facility or Equipment

  const fetchReservationDetails = useCallback(async () => {
    try {
      const endpoint =
        reservationType === "Facility"
          ? `http://localhost:5000/reservations/${reservationId}`
          : `http://localhost:5000/equipment/${reservationId}`;

      const response = await axios.get(endpoint);
      if (response.status === 200) {
        setReservationDetails(response.data);
      } else {
        setError("No reservation found");
      }
    } catch (error) {
      console.error("Error fetching reservation details:", error);
      setError("Failed to load reservation details");
    }
  }, [reservationId, reservationType]);

  useEffect(() => {
    fetchReservationDetails();
  }, [fetchReservationDetails]);

  const handleCancellation = async () => {
    if (!isConfirmed) {
      console.log("Cancellation not confirmed");
      return;
    }

    try {
      const endpoint =
        reservationType === "Facility"
          ? `http://localhost:5000/reservations/${reservationId}`
          : `http://localhost:5000/equipment/${reservationId}`;

      // Send PATCH request to update is_archived and reason
      const response = await axios.patch(endpoint, {
        is_archived: true, // Set to true to archive
      });

      if (response.status === 200) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert("There was an error cancelling your reservation.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
                    <p>
                      <strong>Type:</strong> {reservationType}
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(reservationDetails.start_date)} to{" "}
                      {formatDate(reservationDetails.end_date)}
                    </p>
                  </Col>
                  {/* Condition to check if the reservation is for Equipment */}
                  {reservationType === "Facility" ? (
                    <Col xs={12} md={6}>
                      <p>
                        <strong>Time Slot:</strong>{" "}
                        {reservationDetails.time_slot || "N/A"}
                      </p>
                    </Col>
                  ) : (
                    <Col xs={12} md={6}>
                      <p>
                        <strong>Reserved Equipment:</strong>{" "}
                        {reservationDetails.reserved_equipment
                          ? reservationDetails.reserved_equipment
                          : "No equipment reserved"}
                      </p>
                    </Col>
                  )}
                </Row>
              </Container>
            </Form.Group>
          ) : (
            <p>{error ? error : "Loading reservation details..."}</p>
          )}

          <Form.Group className="mb-4">
            <Form.Label>Reason for Cancellation</Form.Label>
            <Form.Check
              type="radio"
              id="reason1"
              name="cancelReason"
              label="Change in Plans"
              className="mb-2"
              onChange={() => setSelectedReason("Change in Plans")}
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
              className="mb-2"
              label="Weather or Environmental Factors"
              onChange={() =>
                setSelectedReason("Weather or Environmental Factors")
              }
            />
            {reservationType === "Equipment" && (
              <Form.Check
                type="radio"
                id="reason4"
                name="cancelReason"
                className="mb-2"
                label="Equipment No Longer Needed"
                onChange={() => setSelectedReason("Equipment No Longer Needed")}
              />
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
              <Button
                variant="secondary"
                className="btn-danger"
                disabled={!isConfirmed}
                onClick={handleCancellation}
              >
                Confirm
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-secondary"
                className="btn-dark text-white"
                onClick={() => {
                  sessionStorage.removeItem("reservationId");
                  navigate("/ReservationLog");
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </div>

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
                <i
                  className="bi bi-check2-circle text-danger"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h2 className="mt-3 mb-3">
                  Your reservation was archived successfully!
                </h2>
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
