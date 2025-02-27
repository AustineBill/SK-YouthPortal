import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Table,
  Dropdown,
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import "./styles/AdminGymReservation.css";
import axios from "axios";

const AdminGymReservation = () => {
  const [reservations, setReservations] = useState([]); // Used for table data
  const [calendarReservations, setCalendarReservations] = useState([]); // Used for calendar data
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch all reservations for the table (Allreservations)
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/Allreservations"
        );

        // Filter out archived reservations (is_archived: true) and only show active ones (is_archived: false)
        const activeReservations = response.data.filter(
          (reservation) => !reservation.is_archived
        );

        setReservations(activeReservations); // Set the filtered list of active reservations
        setFilteredReservations(activeReservations); // Also update filtered reservations if needed
      } catch (error) {
        console.error("Error fetching reservation data for table:", error);
      }
    };
    fetchReservations();
  }, []);

  // Fetch scheduled reservations for the calendar (ViewSched)
  const fetchCalendarReservations = async () => {
    try {
      const response = await fetch(
        "https://isked-backend-ssmj.onrender.com/ViewSched"
      );
      if (!response.ok) {
        throw new Error("Error fetching calendar reservations");
      }
      const data = await response.json();
      setCalendarReservations(data); // For calendar view
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  useEffect(() => {
    fetchCalendarReservations();
  }, []);

  // Filter reservations for the table based on selected filter option
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
        {
          ids: selectedReservations,
        }
      );
      const response = await axios.get(
        "https://isked-backend-ssmj.onrender.com/Allreservations"
      );
      setReservations(response.data);
      setFilteredReservations(response.data);
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  const handleDisapprove = async () => {
    try {
      await axios.post(
        "https://isked-backend-ssmj.onrender.com/disapproveReservations",
        {
          ids: selectedReservations,
        }
      );
      const response = await axios.get(
        "https://isked-backend-ssmj.onrender.com/Allreservations"
      );
      setReservations(response.data);
      setFilteredReservations(response.data);
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  const handleCancellation = async (reservationId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!isConfirmed) {
      console.log("Cancellation not confirmed");
      return;
    }

    // Proceed with cancellation if confirmed
    try {
      const endpoint = `https://isked-backend-ssmj.onrender.com/reservations/${reservationId}`;
      const response = await axios.delete(endpoint);

      if (response.status === 200) {
        console.log("Reservation successfully cancelled");
        // Update the local state to remove the cancelled reservation
        setReservations((prevReservations) =>
          prevReservations.filter(
            (reservation) => reservation.id !== reservationId
          )
        );
        setFilteredReservations((prevFilteredReservations) =>
          prevFilteredReservations.filter(
            (reservation) => reservation.id !== reservationId
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert("There was an error cancelling your reservation.");
    }
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

  // Filter reservations for the calendar based on the selected time slot
  const filterCalendarReservations = (date) => {
    return calendarReservations.filter((res) => {
      const startDate = new Date(res.start_date);
      const endDate = new Date(res.end_date);
      const selectedDate = new Date(date);
      const selectedTime = selectedTimeSlot
        ? res.time_slot === selectedTimeSlot
        : true;
      return (
        selectedDate >= startDate && selectedDate <= endDate && selectedTime
      );
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return ""; // Apply styles only in month view

    const dailyReservations = filterCalendarReservations(date);

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

  return (
    <div className="admin-gym-reservation-container">
      <h2 className="admin-greservation-label-h2 fst-italic">
        Gym Reservation
      </h2>

      <div className="time-dropdown-container" ref={dropdownRef}>
        <div className="time-dropdown">
          <button
            className="time-dropdown-button dropdown-toggle bg-primary"
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

      <div className="calendar-container">
        <Calendar
          className={"gr-calendar rounded"}
          minDate={new Date()}
          selectRange={true}
          tileClassName={tileClassName}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const dailyReservations = filterCalendarReservations(date);

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
      </div>

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
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th style={{ width: "120px" }}>Action</th>
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
                <td>{formatDate(reservation.date)}</td>
                <td>{formatDate(reservation.end_date)}</td>
                <td>{reservation.time_slot}</td>
                <td>{reservation.status || "Pending"}</td>
                <td className="admin-greservation-action-button-container d-flex justify-content-center">
                  <Button
                    variant="danger"
                    className="admin-greservation-edit-button rounded-pill"
                    onClick={() => handleCancellation(reservation.id, true)} // Pass reservation ID and confirmation
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
