import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Breadcrumb, Container } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationLog = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reservations', {
          params: { userId }, 
        });
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [userId]);

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
        <Row className="mb-4">
          <Col className="d-flex justify-content-end">
            <Button variant="outline-secondary" onClick={() => navigate('/UserProgram')}>
              <FaCalendarAlt /> 00/00/0000
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Program</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Time Slot</th>
              <th style={{ width: '120px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.program}</td>
                <td>{reservation.date}</td>
                <td>{reservation.end_date}</td>
                <td>{reservation.time_slot}</td>
                <td className="d-flex justify-content-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      sessionStorage.setItem('reservationId', reservation.id, );  // Store the ID in sessionStorage
                      navigate('/Cancellation');  // Navigate without including the ID in the URL
                    }}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default ReservationLog;