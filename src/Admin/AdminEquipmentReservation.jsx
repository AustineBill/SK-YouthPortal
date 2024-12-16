import './styles/AdminReservation.css';

import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Breadcrumb, Container, Dropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminGymReservation = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState('All');
  const [selectedReservations, setSelectedReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const endpoint = 'http://localhost:5000/Allequipments'; // Updated endpoint to fetch equipment reservations
        const response = await axios.get(endpoint);
        setReservations(response.data);
        setFilteredReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      }
    };

    fetchReservations();
  }, []);

  // Filter reservations based on the selected filter option
  useEffect(() => {
    let filteredData = reservations;

    const now = new Date();
    if (filterOption === 'Now') {
      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate.getTime() === now.getTime();
      });
    } else if (filterOption === 'Week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate >= startOfWeek && reservationDate <= endOfWeek;
      });
    } else if (filterOption === 'Month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate >= startOfMonth && reservationDate <= endOfMonth;
      });
    }

    setFilteredReservations(filteredData);
  }, [filterOption, reservations]);

  const handleCheckboxChange = (id) => {
    setSelectedReservations((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((reservationId) => reservationId !== id)
        : [...prevSelected, id]
    );
  };

  const handleApprove = async () => {
    try {
      // Update the status of the selected reservations to 'Approved'
      await axios.post('http://localhost:5000/approveEquipment', { ids: selectedReservations });

      // Refresh the reservations list
      const response = await axios.get('http://localhost:5000/Allequipments');
      setReservations(response.data);
      setFilteredReservations(response.data);
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  const handleDisapprove = async () => {
    try {
      // Update the status of the selected reservations to 'Disapproved'
      await axios.post('http://localhost:5000/disapproveEquipment', { ids: selectedReservations });

      // Refresh the reservations list
      const response = await axios.get('http://localhost:5000/Allequipments');
      setReservations(response.data);
      setFilteredReservations(response.data);
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error('Error updating reservation status:', error);
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
        <Breadcrumb.Item onClick={() => navigate('/Dashboard')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Reservation Log</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">Reservation Log</h1>
        <p className="Subtext">Don't Miss Out, Explore Now</p>
      </div>

      <Container>
        {/* Approve and Disapprove buttons */}
        <Row className="mb-3 d-flex justify-content-center">
          <Col className="d-flex justify-content-center gap-3">
            <Button
              variant="success"
              disabled={selectedReservations.length === 0}
              onClick={handleApprove}
            >
              Approve Selected Reservations
            </Button>
            <Button
              variant="danger"
              disabled={selectedReservations.length === 0}
              onClick={handleDisapprove}
            >
              Disapprove Selected Reservations
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className="d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle className="btn-dark">
                {filterOption}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterOption('Now')}>Now</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterOption('Week')}>Week</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterOption('Month')}>Month</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterOption('All')}>All</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReservations(filteredReservations.map((reservation) => reservation.id));
                    } else {
                      setSelectedReservations([]);
                    }
                  }}
                  checked={selectedReservations.length === filteredReservations.length}
                />
              </th>
                <th>Reservation ID</th>
                <th>Reserved Equipment</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              <th style={{ width: '120px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No transactions found. Inventory has been restored.
                </td>
              </tr>
            ) : (
              filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReservations.includes(reservation.id)}
                      onChange={() => handleCheckboxChange(reservation.id)}
                    />
                  </td>
                  <td>{reservation.id}</td>
                  <td>{formatDate(reservation.start_date)}</td>
                  <td>{formatDate(reservation.end_date)}</td>
                  <td>{reservation.time_slot || 'N/A'}</td>
                  <td>{reservation.status || 'Pending'}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        sessionStorage.setItem('reservationId', reservation.id);
                        navigate('/Cancellation');
                      }}
                      disabled={reservation.status === 'Approved' || reservation.status === 'Pending'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AdminGymReservation;
