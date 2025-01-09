import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../WebStyles/CalendarStyles.css";
import StepIndicator from "../Classes/StepIndicator";
import { Modal, Button } from "react-bootstrap";

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationType } = location.state || { reservationType: "Solo" };

  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const dropdownRef = useRef(null);

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

    // Ensure start and end dates are at local midnight
    const startDate = new Date(selectedDates[0]);
    startDate.setHours(23, 59, 59, 999); // Set to local midnight

    const endDate = new Date(selectedDates[1]);
    endDate.setHours(23, 59, 59, 999); // Include the end day completely

    const reservationData = {
      user_id: userId,
      reservation_type: reservationType,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      time_slot: selectedTime,
    };

    try {
      // Validate the reservation
      const response = await fetch(
        "http://localhost:5000/ValidateReservation",
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
      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Schedule</h1>
        <p className="Subtext">Selected Type: {reservationType}</p>
      </div>

      <div className="row">
        {/* Left Section: Legend and Selected Info */}
        <div className="col-lg-3 col-md-4">
          <div className="left-section">
            <div className="legend mb-4">
              <h2>Legend</h2>
              <div className="legend-item">
                <span className="circle available"></span>
                <h3>Available</h3>
              </div>
              <div className="legend-item">
                <span className="circle unavailable"></span>
                <h3>Unavailable</h3>
              </div>
              <div className="legend-item">
                <span className="circle maximize"></span>
                <h3>Maximize Capacity</h3>
              </div>
            </div>

            {/* Selected Dates and Time */}
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
          </div>
        </div>

        {/* Center Section: Calendar */}
        <div className="col-lg-6 col-md-8">
          <div className="calendar-section">
            {/* Step Indicator */}
            <StepIndicator currentStep={1} />

            {/* Calendar */}
            <Calendar
              minDate={new Date()}
              onChange={handleDateChange}
              selectRange={true}
              value={selectedDates}
            />
          </div>
        </div>

        <div className="col-lg-3 col-md-4">
          <div className="right-section">
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

            <div className="legend">
              <button
                className="apply-dates btn btn-primary m-3"
                onClick={saveReservation}
              >
                Apply Dates
              </button>
            </div>

            <div className="legend">
              <button className="apply-dates btn btn-primary">
                Exception Day
              </button>
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default Reservation;
