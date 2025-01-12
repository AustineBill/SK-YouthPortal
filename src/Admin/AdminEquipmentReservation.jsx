import "./styles/AdminEquipmentReservation.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// New Codes:
import {
  Table,
  Dropdown,
  Button,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AdminEquipmentReservation = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const endpoint = "http://localhost:5000/Allequipments"; // Updated endpoint to fetch equipment reservations
        const response = await axios.get(endpoint);
        setReservations(response.data);
        setFilteredReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };
    fetchReservations();
  }, []);

  // Fetch reservations from the backend
  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:5000/ViewEquipment");
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

  useEffect(() => {
    let filteredData = reservations;

    const now = new Date();
    if (filterOption === "Now") {
      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate.getTime() === now.getTime();
      });
    } else if (filterOption === "Week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate >= startOfWeek && reservationDate <= endOfWeek;
      });
    } else if (filterOption === "Month") {
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
      await axios.post("http://localhost:5000/approveEquipment", {
        ids: selectedReservations,
      });

      // Refresh the reservations list
      const response = await axios.get("http://localhost:5000/Allequipments");
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
      await axios.post("http://localhost:5000/disapproveEquipment", {
        ids: selectedReservations,
      });

      // Refresh the reservations list
      const response = await axios.get("http://localhost:5000/Allequipments");
      setReservations(response.data);
      setFilteredReservations(response.data);
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  // Filter reservations by start_date
  const filterReservations = (date) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_date).toDateString();
      const currentDate = date.toDateString();
      return startDate === currentDate;
    });
  };

  // Assign classes to tiles based on reservation data
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return ""; // Apply styles only in month view

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time component for comparison

    const isSunday = date.getDay() === 0; // Check if the day is Sunday (0 represents Sunday)

    if (date < today || isSunday) {
      return "unavailable"; // Past dates and Sundays should always be unavailable
    }
    const dailyReservations = filterReservations(date);

    if (dailyReservations.length === 0) return "available";
    if (dailyReservations.length >= 5) return "unavailable";
    return "available";
  };

  const renderPopover = (dailyReservations) => (
    <Popover id="reservation-popover">
      <Popover.Header as="h3">Reservation Details</Popover.Header>
      <Popover.Body>
        {dailyReservations.map((res, index) => (
          <h5 key={index}>
            <strong>User:</strong> {res.username} <br />
            <strong>Item:</strong> {res.equipment_name} <br />
            <strong>Quantity:</strong> {res.quantity}
          </h5>
        ))}
      </Popover.Body>
    </Popover>
  );

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dailyReservations = filterReservations(date);

    if (dailyReservations.length > 0) {
      return (
        <OverlayTrigger
          trigger="click"
          placement="top"
          overlay={renderPopover(dailyReservations)}
        >
          <div className="tile-content">
            <span className="reservation-count">
              {dailyReservations.length}
            </span>
          </div>
        </OverlayTrigger>
      );
    }
    return null;
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
    <div className="admin-equipment-reservation-container">
      <h2 className="admin-ereservation-label-h2 fst-italic">
        Equipment Reservation
      </h2>

      <div className="admin-ereservation-calendar-container">
        <Calendar
          className={"er-calendar rounded"}
          minDate={new Date()}
          selectRange={true}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>

      <div className="admin-ereservation-buttons-table-container">
        <div className="admin-er-toggle-buttons-container d-flex align-items-center">
          <Dropdown className="er-toggle-container">
            <Dropdown.Toggle className="er-toggle">
              {filterOption}
            </Dropdown.Toggle>
            <Dropdown.Menu className="er-toggle-text">
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

          <button
            disabled={selectedReservations.length === 0}
            onClick={handleApprove}
            className="admin-er-disapprove-button bg-success text-white rounded"
          >
            Approve
          </button>
          <button
            disabled={selectedReservations.length === 0}
            onClick={handleDisapprove}
            className="admin-er-disapprove-button bg-danger text-white rounded"
          >
            Disapprove
          </button>
        </div>

        <Table className="admin-ereservation-table-container table-bordered">
          <thead className="admin-ereservation-head text-center">
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
              <th>Reservation ID</th>
              <th>Reserved Equipment</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th style={{ width: "120px" }}>Action</th>
            </tr>
          </thead>

          <tbody className="admin-ereservation-body text-center">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No Reservation Found.
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
                  <td>
                    {Array.isArray(reservation.reserved_equipment) &&
                    reservation.reserved_equipment.length > 0 ? (
                      reservation.reserved_equipment.map((item) => (
                        <div key={item.id}>
                          {item.name} (Quantity: {item.quantity})
                        </div>
                      ))
                    ) : (
                      <span>No items reserved</span>
                    )}
                  </td>
                  <td>{formatDate(reservation.start_date)}</td>
                  <td>{formatDate(reservation.end_date)}</td>
                  <td>{reservation.status || "Pending"}</td>
                  <td className="admin-ereservation-action-button-container d-flex justify-content-center">
                    <Button
                      variant="danger"
                      className="admin-ereservation-delete-button rounded-pill"
                      onClick={() => {
                        sessionStorage.setItem("reservationId", reservation.id);
                        navigate("/Cancellation");
                      }}
                      disabled={
                        reservation.status === "Approved" ||
                        reservation.status === "Pending"
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminEquipmentReservation;
