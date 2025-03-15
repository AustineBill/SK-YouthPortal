import React, { useState, useEffect } from "react";
import { Table, Dropdown, Button } from "react-bootstrap";
import AdminGymCalendar from "./Calendars/AdminGymCalendar";
import "./styles/AdminGymReservation.css";
import axios from "axios";

const AdminGymReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);

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
      await axios.post(
        "https://isked-backend-ssmj.onrender.com/approveReservations",
        { ids: selectedReservations }
      );
      setSelectedReservations([]);
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  const handleDisapprove = async () => {
    try {
      await axios.post(
        "https://isked-backend-ssmj.onrender.com/disapproveReservations",
        { ids: selectedReservations }
      );
      setSelectedReservations([]);
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  const handleCancellation = async (reservationId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!isConfirmed) return;
    try {
      await axios.delete(
        `https://isked-backend-ssmj.onrender.com/reservations/${reservationId}`
      );
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== reservationId)
      );
      setFilteredReservations((prev) =>
        prev.filter((reservation) => reservation.id !== reservationId)
      );
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  return (
    <div className="admin-gym-reservation-container">
      <h2 className="admin-greservation-label-h2 fst-italic">
        Gym Reservation
      </h2>

      <AdminGymCalendar />

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
            onClick={handleApprove}
            className="admin-gr-disapprove-button bg-success text-white rounded"
          >
            Approve
          </button>
          <button
            disabled={selectedReservations.length === 0}
            onClick={handleDisapprove}
            className="admin-gr-disapprove-button bg-danger text-white rounded"
          >
            Disapprove
          </button>
        </div>

        <Table className="admin-greservation-table-container table-bordered">
          <thead className="admin-greservation-head text-center">
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedReservations(
                      e.target.checked
                        ? filteredReservations.map((res) => res.id)
                        : []
                    )
                  }
                  checked={
                    selectedReservations.length === filteredReservations.length
                  }
                />
              </th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={selectedReservations.includes(reservation.id)}
                    onChange={() => handleCheckboxChange(reservation.id)}
                  />
                </td>
                <td>{reservation.id}</td>
                <td>{reservation.program}</td>
                <td>{reservation.start_date}</td>
                <td>{reservation.end_date}</td>
                <td>{reservation.time_slot}</td>
                <td>{reservation.status || "Pending"}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleCancellation(reservation.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminGymReservation;
