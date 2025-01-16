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
  const { state } = location;
  const { programType } = state || {};
  const { reservationType } = state || { reservationType: "Solo" };
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
      const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

      if (diffDays > 4) {
        setModalMessage("You can select a maximum of 4 days.");
        setShowModal(true);
        setSelectedDates([start, start]);
      } else {
        setSelectedDates(range);
      }
    } else {
      setSelectedDates([range, range]);
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

  // Filter reservations for a specific date
  const filterReservations = (date) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_date);
      const selectedDate = new Date(date);

      return selectedDate.toDateString() === startDate.toDateString();
    });
  };

  // Apply styles to calendar tiles
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return ""; // Only apply styles in month view

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isSunday = date.getDay() === 0;

    if (date < today || isSunday) {
      return "unavailable";
    }

    const dailyReservations = filterReservations(date);

    if (dailyReservations.length > 0) {
      return "reserved-start"; // Highlight start date only
    }

    return "available"; // No reservations: Vacant
  };

  // Check if a date should be disabled
  const tileDisabled = ({ date }) => {
    return date.getDay() === 0; // Disable Sundays
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

    const formatDateToYYYYMMDD = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const startDate = formatDateToYYYYMMDD(selectedDates[0]);
    const endDate = formatDateToYYYYMMDD(selectedDates[1]);

    const reservationData = {
      user_id: userId,
      reservation_type: reservationType,
      start_date: startDate,
      end_date: endDate,
      time_slot: selectedTime,
    };

    try {
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
        setModalMessage(result.message);
        setShowModal(true);
        return;
      }

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
        <Calendar
          minDate={new Date()}
          onChange={handleDateChange}
          selectRange={true}
          value={selectedDates}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
        />
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
        <button className="apply-dates" onClick={saveReservation}>
          Apply Dates
        </button>
      </div>

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
