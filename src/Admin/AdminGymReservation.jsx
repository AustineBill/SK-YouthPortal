import React, { useState, useEffect } from "react";
import { Table, Dropdown, Button, Modal } from "react-bootstrap";
import AdminGymCalendar from "./Calendars/AdminGymCalendar";
import "./styles/AdminGymReservation.css";
import axios from "axios";
//import { TabPanel } from "@restart/ui";

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
            {filteredReservations.map((reservation, index) => (
              <tr key={reservation.id || reservation.reservation_id || index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedReservations.includes(reservation.id)}
                    onChange={() => handleCheckboxChange(reservation.id)}
                  />
                </td>
                <td>{reservation.reservation_id}</td>
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
                      onClick={handleCancellation}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          show={showTimeGapModal}
          onHide={() => setShowTimeGapModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Customize Time Gap</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Select Time Gap:</label>
            <select
              className="form-select"
              value={timeGap}
              onChange={(e) => setTimeGap(Number(e.target.value))}
            >
              <option value={1}>1 Hour</option>
              <option value={2}>2 Hours</option>
              <option value={3}>3 Hours</option>
            </select>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowTimeGapModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  if (!timeGap || isNaN(timeGap)) {
                    alert("Invalid time gap value! Please enter a number.");
                    return;
                  }

                  await axios.post(
                    "https://isked-backend-ssmj.onrender.com/settings/time-gap",
                    {
                      time_gap: Number(timeGap),
                    }
                  );

                  alert("Time gap updated!");
                  setShowTimeGapModal(false);
                } catch (error) {
                  console.error("Error updating time gap:", error);
                }
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Block Dates</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Start Date:</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => setStartBlockDate(e.target.value)}
            />
            <label>End Date:</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => setEndBlockDate(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowBlockModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!startBlockDate)
                  return alert("Please select a start date.");
                try {
                  await axios.post(
                    "https://isked-backend-ssmj.onrender.com/settings/block-dates",
                    {
                      start_date: startBlockDate,
                      end_date: endBlockDate || null,
                    }
                  );
                  alert("Blocked dates added!");
                  setBlockedDates([
                    ...blockedDates,
                    {
                      start: startBlockDate,
                      end: endBlockDate || startBlockDate,
                    },
                  ]);
                  setShowBlockModal(false);
                } catch (error) {
                  console.error("Error blocking dates:", error);
                }
              }}
            >
              Block Date Range
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminGymReservation;
