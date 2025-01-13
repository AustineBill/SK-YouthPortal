import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios"; // Import axios

const AdminReservations = () => {
  // State for managing reservations and time slots
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [selectedTime, setSelectedTime] = useState("");
  const [reservations, setReservations] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch reservation data
  useEffect(() => {
    // Assuming userId is available (e.g., from context or props)
    const userId = 1; // Change this based on your app logic (e.g., from logged-in user)

    // Fetch reservations for the current user
    axios
      .get(`/reservations?userId=${userId}`)
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
      });
  }, []);

  // Handle date selection (single or range)
  const handleDateChange = (range) => {
    if (Array.isArray(range)) {
      setSelectedDates(range);
    } else {
      setSelectedDates([range, range]);
    }
  };

  // Toggle the visibility of the time dropdown
  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  // Select a time slot from the dropdown
  const selectTime = (time) => {
    setSelectedTime(time);
    setIsDropdownVisible(false);
  };

  // Handle click outside of the dropdown to close it
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

  // Handle reservation actions (Edit, Cancel, Approve)
  const handleReservationAction = (action, reservation) => {
    console.log(
      `${action} reservation for ${reservation.time} on ${reservation.date}`
    );
    if (action === "Cancel") {
      // Call backend API to delete reservation
      axios
        .delete(`/reservations/${reservation.id}`)
        .then((response) => {
          console.log("Reservation canceled:", response.data);
          setReservations(reservations.filter((r) => r.id !== reservation.id)); // Update local state
        })
        .catch((error) => {
          console.error("Error canceling reservation:", error);
        });
    }
    // Add additional logic for "Edit" and "Approve" actions as needed
  };

  const handleSubmitReservation = () => {
    const userId = 1; // Example userId
    const reservationData = {
      user_id: userId,
      reservation_type: "Event", // Can be dynamic based on user input
      start_date: selectedDates[0].toISOString(),
      end_date: selectedDates[1].toISOString(),
      time_slot: selectedTime,
    };

    axios
      .post("/reservations", reservationData)
      .then((response) => {
        console.log("Reservation created:", response.data);
        setReservations([...reservations, response.data]); // Update local state with new reservation
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
      });
  };

  return (
    <div className="admin-reservation-page">
      {/* Main content */}
      <div className="content-container">
        <div className="admin-calendar-container">
          <div className="text-center text-lg-start mt-4">
            <h1 className="Maintext-Calendar animated slideInRight">
              Admin Schedule Management
            </h1>
            <p className="Subtext-Calendar">
              Manage venue reservations and availability
            </p>
          </div>

          <div className="grid-container">
            {/* Reservation Legend */}
            <div className="legend">
              <h2>Legend</h2>
              <div className="legend-item">
                <span className="circle available"></span>
                <h3>Available</h3>
              </div>
              <div className="legend-item">
                <span className="circle booked"></span>
                <h3>Booked</h3>
              </div>
              <div className="legend-item">
                <span className="circle cancelled"></span>
                <h3>Cancelled</h3>
              </div>
            </div>

            {/* Reservations List */}
            <div className="reservation-list">
              <h2>Reservations</h2>
              {reservations.length === 0 ? (
                <p>No reservations for the selected date range.</p>
              ) : (
                reservations.map((reservation, index) => (
                  <div key={index} className="reservation-item">
                    <p>
                      {new Date(reservation.start_date).toDateString()} -{" "}
                      {reservation.time_slot} ({reservation.reservation_type})
                    </p>
                    <button
                      onClick={() =>
                        handleReservationAction("Edit", reservation)
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleReservationAction("Cancel", reservation)
                      }
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handleReservationAction("Approve", reservation)
                      }
                    >
                      Approve
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Selected Date and Time */}
            <div className="selected-date">
              {selectedDates[0].toDateString() ===
              selectedDates[1].toDateString()
                ? `Selected Date: ${selectedDates[0].toDateString()}`
                : `Selected Dates: ${selectedDates[0].toDateString()} to ${selectedDates[1].toDateString()}`}
              {selectedTime && <div>Selected Time: {selectedTime}</div>}
            </div>

            {/* Apply Dates Button */}
            <button className="apply-dates" onClick={handleSubmitReservation}>
              Apply Dates
            </button>
          </div>

          {/* Time Slot Dropdown */}
          <div className="dropdown-container" ref={dropdownRef}>
            <div className="time-dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                onClick={toggleDropdown}
              >
                Select Time
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
                      className="dropdown-item"
                      key={time}
                      onClick={() => selectTime(time)}
                    >
                      {time}
                    </h6>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calendar Component */}
          <Calendar
            minDate={new Date()}
            onChange={handleDateChange}
            selectRange={true}
            value={selectedDates}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;
