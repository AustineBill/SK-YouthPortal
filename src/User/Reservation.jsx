import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../WebStyles/CalendarStyles.css";
import StepIndicator from "../Classes/StepIndicator";
import { Breadcrumb, Modal, Button } from "react-bootstrap";

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location; // Access the passed state
  const { programType } = state || {}; // Destructure programType from state
  const { reservationType } = location.state || { reservationType: "Solo" };
  const [reservations, setReservations] = useState([]);
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const dropdownRef = useRef(null);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        "https://isked-backend.onrender.com/ViewSched"
      );
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

  const timeSlots = [
    "9:00 am - 10:00 am",
    "10:00 am - 11:00 am",
    "11:00 am - 12:00 nn",
    "12:00 nn - 1:00 pm",
    "1:00 pm - 2:00 pm",
    "2:00 pm - 3:00 pm",
  ];

  const handleDateChange = (range) => {
    if (Array.isArray(range)) {
      const [start, end] = range;

      // Normalize the dates to remove time zone offset
      const startLocal = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );
      const endLocal = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      );

      const diffDays = (endLocal - startLocal) / (1000 * 60 * 60 * 24);

      if (diffDays > 4) {
        setModalMessage("You can select a maximum of 4 days.");
        setShowModal(true);
        setSelectedDates([startLocal, startLocal]); // Reset to the start date
      } else {
        setSelectedDates([startLocal, endLocal]);
      }
    } else {
      // Single date selection
      const localDate = new Date(
        range.getFullYear(),
        range.getMonth(),
        range.getDate()
      );
      setSelectedDates([localDate, localDate]);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const selectTime = (time) => {
    setSelectedTime(time);
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

  const filterReservations = (date) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_date);
      const endDate = new Date(res.end_date);
      const selectedDate = new Date(date);

      return selectedDate >= startDate && selectedDate <= endDate;
    });
  };

  // Calendar Tile Class Logic
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return ""; // Apply styles only in month view

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time component for comparison

    const isSunday = date.getDay() === 0; // Check if the day is Sunday (0 represents Sunday)

    if (date < today || isSunday) {
      return "unavailable"; // Past dates and Sundays should always be unavailable
    }

    const dailyReservations = filterReservations(date, selectedTime);

    if (dailyReservations.length === 0) {
      return "available"; // No reservations: Vacant
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

  const tileDisabled = ({ date }) => {
    // Check if the date is a Sunday
    if (date.getDay() === 0) return true;

    // Check for reservations on this date
    const dailyReservations = filterReservations(date);

    // Group reservation or fully booked?
    const hasGroupReservation = dailyReservations.some(
      (res) => res.reservation_type === "Group"
    );
    const soloReservationsCount = dailyReservations.filter(
      (res) => res.reservation_type === "Solo"
    ).length;
    const isFullyBooked = soloReservationsCount >= 5;

    return hasGroupReservation || isFullyBooked; // Disable unavailable dates
  };

  const saveReservation = async () => {
    if (!selectedDates || !selectedTime) {
      alert("Please select both a date and a time slot before proceeding.");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("No user ID found. Please log in again.");
      console.error("No userId found in sessionStorage");
      return;
    }

    // Format start and end dates to 'YYYY-MM-DD'
    const formatDateToYYYYMMDD = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const startDate = formatDateToYYYYMMDD(selectedDates[0]);
    const endDate = formatDateToYYYYMMDD(selectedDates[1]);

    const reservationData = {
      user_id: userId,
      reservation_type: reservationType,
      start_date: startDate, // Save in 'YYYY-MM-DD' format
      end_date: endDate, // Save in 'YYYY-MM-DD' format
      time_slot: selectedTime,
    };

    try {
      // Validate the reservation
      const response = await fetch(
        "https://isked-backend.onrender.com/ValidateReservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to validate reservation. Status: ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        setModalMessage(result.message); // Show the error message in the modal
        setShowModal(true);
        return;
      }

      // If validation passes, save the reservation to sessionStorage and navigate
      sessionStorage.setItem(
        "reservationData",
        JSON.stringify(reservationData)
      );
      navigate("/ScheduleDetails", {
        state: { reservationData, reservationType },
      });
    } catch (error) {
      console.error("Error validating reservation:", error);
      alert(
        "An error occurred while validating your reservation. Please try again later."
      );
    }
  };

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/UserProgram")}>
          Programs
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() =>
            navigate("/ProgramDetails", { state: { programType } })
          }
        >
          Program Details
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Reservation</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Schedule</h1>
        <p className="Subtext">Selected Type: {reservationType}</p>
      </div>

      <div className="calendar-container">
        <div className="grid-container">
          <div className="legend">
            <h2>Legend</h2>
            <div className="legend-item">
              <span className="circle available"></span>
              <h3>Available</h3>
            </div>
            <div className="legend-item">
              <span className="circle unavailable"></span>
              <h3>Unavailable</h3>
            </div>
          </div>

          <div className="legend">
            <p>
              <strong>Selected Date:</strong>{" "}
              {selectedDates[0].toDateString() ===
              selectedDates[1].toDateString()
                ? selectedDates[0].toLocaleDateString()
                : `${selectedDates[0].toLocaleDateString()} to ${selectedDates[1].toLocaleDateString()}`}
            </p>
            <p>
              <strong>Selected Time:</strong>{" "}
              {selectedTime || "No time selected"}
            </p>
          </div>

          <button className="apply-dates" onClick={saveReservation}>
            Apply Dates
          </button>
        </div>

        <StepIndicator currentStep={1} />

        <div className="dropdown-container mb-3" ref={dropdownRef}>
          <div className="time-dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              onClick={toggleDropdown}
            >
              Select Time
            </button>
            {isDropdownVisible && (
              <div className="time-dropdown-menu">
                {timeSlots.map((time) => (
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
          minDate={new Date()} // Disable past dates
          onChange={handleDateChange} // Handle date change (if needed)
          selectRange={true} // Allow date range selection
          value={selectedDates} // Set the selected dates
          tileClassName={tileClassName} // Apply custom styles to each tile
          tileDisabled={tileDisabled}
        />

        {/* Modal for Reservation Conflict */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Reservation Conflict</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Reservation;
