import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Breadcrumb, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationLog = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    sessionStorage.getItem('reservationCategory') || 'Facility' // Load from sessionStorage or default to 'Facility'
  );

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    // Save the selected category to sessionStorage whenever it changes
    sessionStorage.setItem('reservationCategory', selectedCategory);

    const fetchReservations = async () => {
      try {
        const endpoint =
          selectedCategory === 'Facility'
            ? 'http://localhost:5000/reservations'
            : 'http://localhost:5000/schedule/equipment';

        const response = await axios.get(endpoint, {
          params: { userId },
        });
        setReservations(response.data);
      } catch (error) {
        console.error(`Error fetching ${selectedCategory} data:`, error);
      }
    };

    fetchReservations();
  }, [userId, selectedCategory]);

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
        <Breadcrumb.Item onClick={() => navigate('/Dashboard')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Reservation Log</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">Reservation Log</h1>
        <p className="Subtext">Don't Miss Out, Explore Now</p>
      </div>

      <Container>
        <Row className="mb-4">
          <Col className="d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle className="btn-dark">
                {selectedCategory}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedCategory('Facility')}>Facility</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCategory('Equipment')}>Equipment</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              {selectedCategory === 'Facility' ? (
                <>
                  <th>ID</th>
                  <th>Program</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th style={{ width: '120px' }}>Action</th>
                </>
              ) : (
                <>
                  <th>Reservation ID</th>
                  <th>Reserved Equipment</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th style={{ width: '120px' }}>Action</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id || reservation.reservation_id}>
                {selectedCategory === 'Facility' ? (
                  <>
                    <td>{reservation.id}</td>
                    <td>{reservation.program}</td>
                    <td>{formatDate(reservation.date)}</td>
                    <td>{formatDate(reservation.end_date)}</td>
                    <td>{reservation.time_slot || 'N/A'}</td>
                    <td>{reservation.status || 'Pending'}</td>
                  </>
                ) : (
                  <>
                    <td>{reservation.reservation_id}</td>
                    <td>{reservation.reserved_equipment}</td>
                    <td>{formatDate(reservation.start_date)}</td>
                    <td>{formatDate(reservation.end_date)}</td>
                    <td>{reservation.status || 'Pending'}</td>
                  </>
                )}
                <td className="d-flex justify-content-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      sessionStorage.setItem('reservationId', reservation.id || reservation.reservation_id);
                      sessionStorage.setItem('reservationType', selectedCategory);
                      navigate('/Cancellation');
                    }}
                  >
                    Delete
                  </button>
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
