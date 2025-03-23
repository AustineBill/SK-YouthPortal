import React, { useState, useEffect } from "react";
import { Dropdown, Button, Modal } from "react-bootstrap";
import AdminGymCalendar from "./Calendars/AdminGymCalendar";
import "./styles/AdminGymReservation.css";
import axios from "axios";

const AdminGymReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);

  const [timeGap, setTimeGap] = useState(1);
  const [showTimeGapModal, setShowTimeGapModal] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [startBlockDate, setStartBlockDate] = useState("");
  const [endBlockDate, setEndBlockDate] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/Allreservations"
        );
        const activeReservations = response.data.filter(
          (reservation) => !reservation.is_archived
        );
        setReservations(activeReservations);
        setFilteredReservations(activeReservations);
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    let filteredData = reservations;
    const now = new Date();

    if (filterOption === "Now") {
      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate.toDateString() === now.toDateString();
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

    if (statusFilter !== "All") {
      filteredData = filteredData.filter((reservation) => {
        if (statusFilter === "Pending") {
          return !reservation.status || reservation.status === "Pending"; // Include undefined/null status as Pending
        }
        return reservation.status === statusFilter;
      });
    }

    setFilteredReservations(filteredData);
  }, [filterOption, statusFilter, reservations]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 17; hour += timeGap) {
      let startHour = hour;
      let endHour = hour + timeGap;

      let startPeriod = startHour < 12 ? "AM" : startHour === 12 ? "NN" : "PM";
      let endPeriod = endHour < 12 ? "AM" : endHour === 12 ? "NN" : "PM";

      if (startHour > 12) startHour -= 12;
      if (endHour > 12) endHour -= 12;

      let start = `${startHour}:00 ${startPeriod}`;
      let end = `${endHour}:00 ${endPeriod}`;

      if (endHour <= 17) {
        slots.push(`${start} - ${end}`);
      }
    }
    return slots;
  };

  return (
    <div className="admin-gym-reservation-container">
      <h2 className="admin-greservation-label-h2 fst-italic">
        Gym Reservation
      </h2>

      <div className="justify-content-end d-flex me-5">
        <button
          className="btn btn-warning me-2"
          onClick={() => setShowTimeGapModal(true)}
        >
          <i className="bi bi-clock-fill"></i>
        </button>
        <button
          className="btn btn-info me-2"
          onClick={() => setShowBlockModal(true)}
        >
          <i className="bi bi-calendar-x-fill"></i>
        </button>
      </div>

      <AdminGymCalendar
        blockedDates={blockedDates}
        generateTimeSlots={generateTimeSlots}
      />

      <div className="admin-greservation-buttons-table-container">
        <div className="admin-gr-toggle-buttons-container d-flex align-items-center">
          <Dropdown className="gr-toggle-container">
            <Dropdown.Toggle className="gr-toggle">
              {filterOption}
            </Dropdown.Toggle>
            <Dropdown.Menu className="gr-toggle-text">
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
            className="admin-gr-disapprove-button bg-success text-white rounded ms-3"
          >
            Approve
          </button>
          <button
            disabled={selectedReservations.length === 0}
            className="admin-gr-disapprove-button bg-danger text-white rounded ms-2"
          >
            Disapprove
          </button>

          <Dropdown className="gr-toggle-container ms-3">
            <Dropdown.Toggle className="gr-toggle">
              {statusFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu className="gr-toggle-text">
              <Dropdown.Item onClick={() => setStatusFilter("All")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter("Approved")}>
                Approved
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter("Disapproved")}>
                Disapproved
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter("Pending")}>
                Pending
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <table className="admin-greservation-table-container table-bordered">
          <thead className="admin-greservation-head text-center">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="admin-greservation-body text-center">
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.user_id}</td>
                <td>{reservation.program}</td>
                <td>{reservation.start_date}</td>
                <td>{reservation.end_date}</td>
                <td>{reservation.time_slot}</td>
                <td>{reservation.status || "Pending"}</td>
                <td>
                  <div className="admin-greservation-action-button-container d-flex justify-content-center">
                    <Button
                      variant="danger"
                      className="admin-greservation-delete-button rounded-pill"
                    >
                      <i class="bi bi-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGymReservation;
