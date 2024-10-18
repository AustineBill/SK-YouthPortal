import React from 'react';
import { Container, Row, Col, Button, Breadcrumb, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CancelReservation = () => {

    const navigate = useNavigate();

  return (
    <div className="container-fluid">
       <Breadcrumb className="ms-5">
          <Breadcrumb.Item onClick={() => navigate("/ReservationDetails")}>Reservation Log</Breadcrumb.Item>
          <Breadcrumb.Item active>Cancellation</Breadcrumb.Item>
        </Breadcrumb>


      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">Reservation Log</h1>
        <p className="Subtext">Don't Miss out, Explore now</p> 
      </div> 

      <Container>

        {/* Cancel Reservation Box */}
        <div className="cancel-reservation-box p-4 rounded bg-light">
          <h3 className="text-center mb-4">Cancel Reservation</h3>

          {/* Reservation Details (Placeholder) */}
          <Form.Group className="mb-3">
            <Form.Label>Details</Form.Label>
            <Form.Control as="textarea" rows={4} disabled placeholder=" " className="bg-secondary text-white" />
          </Form.Group>

          {/* Reason for Cancellation */}
          <Form.Group className="mb-4">
            <Form.Label>Reason for Cancellation</Form.Label>
            <Form.Check type="radio" id="reason1" name="cancelReason" label="Reason 1" className="mb-2" />
            <Form.Check type="radio" id="reason2" name="cancelReason" label="Reason 2" className="mb-2" />
            <Form.Check type="radio" id="reason3" name="cancelReason" label="Reason 3" />
          </Form.Group>

          {/* Buttons */}
          <Row className="justify-content-end">
            <Col xs="auto">
              <Button variant="secondary" className="me-2">
                Confirm
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary">
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
