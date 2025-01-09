import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Container,
  Dropdown,
  Button,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import "../WebStyles/CalendarStyles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminGymReservation = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const endpoint = "http://localhost:5000/Allreservations"; // Endpoint to fetch all reservations
        const response = await axios.get(endpoint);
        setReservations(response.data);
        setFilteredReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };

    fetchReservations();
  }, []);

  // Filter reservations based on the selected filter option
  useEffect(() => {
    let filteredData = reservations;

    const now = new Date();
    if (filterOption === "Now") {
      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.date);
        return reservationDate.getTime() === now.getTime();
      });
    } else if (filterOption === "Week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.date);
        return reservationDate >= startOfWeek && reservationDate <= endOfWeek;
      });
    } else if (filterOption === "Month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.date);
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
      await axios.post("http://localhost:5000/approveReservations", {
        ids: selectedReservations,
      });

      // Refresh the reservations list
      const response = await axios.get("http://localhost:5000/Allreservations");
      setReservations(response.data);
      setFilteredReservations(response.data);
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  const handleDisapprove = async () => {
    try {
      // Update the status of the selected reservations to 'Disapproved'
      await axios.post("http://localhost:5000/disapproveReservations", {
        ids: selectedReservations,
      });

      // Refresh the reservations list
      const response = await axios.get("http://localhost:5000/Allreservations");
      setReservations(response.data);
      setFilteredReservations(response.data);
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  // Fetch reservations from the backend
  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:5000/ViewSched");
      if (!response.ok) {
        throw new Error("Error fetching reservations");
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations by date
  const filterReservations = (date) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_date);
      const endDate = new Date(res.end_date);
      const selectedDate = new Date(date);

      return selectedDate >= startDate && selectedDate <= endDate;
    });
  };
  // Count solo and group reservations
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return ""; // Apply styles only in month view

    const dailyReservations = filterReservations(date);

    if (dailyReservations.length === 0) {
      return "vacant"; // No reservations: Vacant
    }

    const soloReservationsCount = dailyReservations.filter(
      (res) => res.reservation_type === "Solo"
    ).length;

    const hasGroupReservation = dailyReservations.some(
      (res) => res.reservation_type === "Group"
    );
    const isFullyBooked = soloReservationsCount >= 5;

    if (hasGroupReservation || isFullyBooked) {
      return "unavailable"; // Fully booked: Unavailable
    }

    return "available"; // Partially booked
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const selectTime = (time) => {
    setSelectedTimeSlot(time);
    setIsDropdownVisible(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  // Render a popover with reservation details
  const renderPopover = (dailyReservations) => (
    <Popover id="popover-basic">
      <Popover.Body>
        {dailyReservations.map((res, index) => (
          <div key={index}>
            {res.username} {res.reservation_type === "Group" ? "(Group)" : ""}
          </div>
        ))}
      </Popover.Body>
    </Popover>
  );
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /*const handleBlockDates = async () => {
    try {
      await axios.post("http://localhost:5000/blockDates", {
        start_date: blockStartDate,
        end_date: blockEndDate,
        reason: "Admin blocked",
      });
      alert("Dates successfully blocked!");
    } catch (error) {
      console.error("Error blocking dates:", error);
    }
  };*/

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

      <div className="dropdown-container" ref={dropdownRef}>
        <div className="time-dropdown">
          <button
            className="btn-db dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            onClick={toggleDropdown}
          >
            {selectedTimeSlot || "Select Time"}
          </button>
          {isDropdownVisible && (
            <div
              className="time-dropdown-menu"
              aria-labelledby="dropdownMenuButton"
            >
              {[
                "9:00 am - 10:00 am",
                "10:00 am - 11:00 am",
                "11:00 am - 12:00 nn",
                "12:00 nn - 1:00 pm",
                "1:00 pm - 2:00 pm",
                "2:00 pm - 3:00 pm",
              ].map((time) => (
                <h6
                  key={time}
                  className="dropdown-item"
                  onClick={() => selectTime(time)}
                >
                  {time}
                </h6>
              ))}
            </div>
          )}
        </div>
      </div>

      <Calendar
        minDate={new Date()}
        selectRange={true}
        tileClassName={tileClassName}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const dailyReservations = filterReservations(date);

          if (dailyReservations.length > 0) {
            const displayCount = dailyReservations.some(
              (res) => res.reservation_type === "Group"
            )
              ? 5
              : dailyReservations.length;

            return (
              <OverlayTrigger
                trigger="click"
                placement="top"
                overlay={renderPopover(dailyReservations)}
              >
                <div className="overlay-content">
                  {displayCount > 0 && (
                    <div className="reservation-count">{displayCount}</div>
                  )}
                </div>
              </OverlayTrigger>
            );
          }
          return null;
        }}
      />

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
                <Dropdown.Item onClick={() => setFilterOption("Now")}>
                  Now
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterOption("Week")}>
                  Week
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterOption("Month")}>
                  Month
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterOption("All")}>
                  All
                </Dropdown.Item>
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
                      setSelectedReservations(
                        filteredReservations.map(
                          (reservation) => reservation.id
                        )
                      );
                    } else {
                      setSelectedReservations([]);
                    }
                  }}
                  checked={
                    selectedReservations.length === filteredReservations.length
                  }
                />
              </th>
              <th>ID</th>
              <th>Program</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th style={{ width: "120px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
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
                  <td>{reservation.program}</td>
                  <td>{formatDate(reservation.date)}</td>
                  <td>{formatDate(reservation.end_date)}</td>
                  <td>{reservation.time_slot || "N/A"}</td>
                  <td>{reservation.status || "Pending"}</td>
                  <td className="d-flex justify-content-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        sessionStorage.setItem("reservationId", reservation.id);
                        sessionStorage.setItem("reservationType", "Facility");
                        navigate("/Cancellation");
                      }}
                      disabled={
                        reservation.status === "Approved" ||
                        reservation.status === "Pending"
                      }
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
