import React from 'react';
import { Container, Row, Col, Button, Breadcrumb, Form } from 'react-bootstrap';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReservationDetails= () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
        <Breadcrumb className="ms-5">
            <Breadcrumb.Item onClick={() => navigate('/Dashboard')}>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Reservation Log</Breadcrumb.Item>
        </Breadcrumb>

        <div className="text-center text-lg-start m-4 mv-8 mb-3">
            <h1 className="Maintext animated slideInRight">Reservation Log</h1>
                <p className="Subtext">Don't Miss out, Explore now</p> 
        </div>

       
        <Container>
            <Row md={3} className="mb-3">
                <Form.Group>
                <Form.Label>Program</Form.Label>
                <Form.Control type="text" disabled placeholder=" " className="bg-light" />
                </Form.Group>
            </Row>
            <Row md={3} className="mb-3">
                <Form.Group>
                <Form.Label>Event Schedule</Form.Label>
                <Form.Control type="text" disabled placeholder=" " className="bg-light" />
                </Form.Group>
            </Row>
            <Row md={3} className="mb-3">
                <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" disabled placeholder=" " className="bg-light" />
                </Form.Group>
            </Row>
        
    
            <Row className="my-4">
                <Col md={6}>
                    <Button variant="secondary" className="d-flex align-items-center" onClick={() => navigate(-1)}>
                    <FaChevronLeft className="me-2" /> Previous
                    </Button>
                </Col>
                <Col md={6}>
                    <Button variant="outline-danger" onClick={() => navigate('/Cancellation')}>
                    Cancel your reservation
                    </Button>
                </Col>
            </Row>
      </Container>

    </div>
  );
};

export default ReservationDetails;
