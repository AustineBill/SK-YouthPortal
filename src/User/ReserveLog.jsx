import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Container,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReservationLog = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    sessionStorage.getItem("reservationCategory") || "Facility" // Load from sessionStorage or default to 'Facility'
  );

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    // Save the selected category to sessionStorage whenever it changes
    sessionStorage.setItem("reservationCategory", selectedCategory);

    const fetchReservations = async () => {
      try {
        const endpoint =
          selectedCategory === "Facility"
            ? "https://isked-backend-ssmj.onrender.com/reservations"
            : "https://isked-backend-ssmj.onrender.com/schedule/equipment";

        const response = await axios.get(endpoint, {
          params: { userId },
        });

        // Filter out reservations where is_archived is true or "t"
        const activeReservations = response.data.filter(
          (reservation) =>
            reservation.is_archived !== true && reservation.is_archived !== "t"
        );

        setReservations(activeReservations);
      } catch (error) {
        console.error(`Error fetching ${selectedCategory} data:`, error);
      }
    };

    fetchReservations();

    // Cleanup function to remove reservationCategory from sessionStorage when leaving the page
    return () => {
      sessionStorage.removeItem("reservationCategory");
    };
  }, [userId, selectedCategory]);

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
        <Breadcrumb.Item onClick={() => navigate("/Dashboard")}>
          Home
        </Breadcrumb.Item>
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
                <Dropdown.Item onClick={() => setSelectedCategory("Facility")}>
                  Facility
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCategory("Equipment")}>
                  Equipment
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <div className="table-wrapper">
          <Table striped bordered hover className="mt-4 mb-5">
            <thead>
              <tr>
                {selectedCategory === "Facility" ? (
                  <>
                    <th>Reservation ID</th>
                    <th>Program</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th style={{ width: "120px" }}>Action</th>
                  </>
                ) : (
                  <>
                    <th>Reservation ID</th>
                    <th>Reserved Equipment</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th style={{ width: "120px" }}>Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Reservation found.
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.reservation_id}>
                    {selectedCategory === "Facility" ? (
                      <>
                        <td>{reservation.reservation_id}</td>
                        <td>{reservation.program}</td>
                        <td>{formatDate(reservation.date)}</td>
                        <td>{formatDate(reservation.end_date)}</td>
                        <td>{reservation.time_slot || "N/A"}</td>
                        <td>{reservation.status || "Pending"}</td>
                      </>
                    ) : (
                      <>
                        <td>{reservation.reservation_id}</td>
                        <td>{reservation.reserved_equipment}</td>
                        <td>{formatDate(reservation.start_date)}</td>
                        <td>{formatDate(reservation.end_date)}</td>
                        <td>{reservation.status || "Pending"}</td>
                      </>
                    )}
                    <td className="d-flex justify-content-center">
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={
                          (selectedCategory === "Facility" &&
                            reservation.status === "Disapproved") ||
                          (selectedCategory === "Equipment" &&
                            reservation.status === "Not Returned") ||
                          (selectedCategory === "Equipment" &&
                            reservation.status === "Received")
                        }
                        onClick={() => {
                          sessionStorage.setItem(
                            "reservationId",
                            reservation.id || reservation.reservation_id
                          );
                          sessionStorage.setItem(
                            "reservationType",
                            selectedCategory
                          );
                          navigate("/Cancellation");
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default ReservationLog;
