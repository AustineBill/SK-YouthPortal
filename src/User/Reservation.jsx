import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../WebStyles/CalendarStyles.css";
import StepIndicator from "../Classes/StepIndicator";
import { Breadcrumb, Modal, Button } from "react-bootstrap";
import axios from "axios";

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { programType } = state || {};
  const { reservationType } = location.state || { reservationType: "Solo" };
  const [reservations, setReservations] = useState([]);
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeGap, setTimeGap] = useState(1);
  const [blockedDates, setBlockedDates] = useState([]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchReservations();
    fetchSettings();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        "https://isked-backend-ssmj.onrender.com/ViewSched"
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const [dateRes, timeRes] = await Promise.all([
        axios.get("https://isked-backend-ssmj.onrender.com/settings"),
        axios.get("https://isked-backend-ssmj.onrender.com/time-settings"),
      ]);

      setBlockedDates(
        dateRes.data.blocked_dates.map((date) => ({
          start: new Date(date.start_date), // Convert to Date object
          end: new Date(date.end_date),
        }))
      );

      setTimeGap(timeRes.data?.time_gap || 1); // Defaults to 1 if empty
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    let startTime = 9; // Start at 9 AM
    let endTime = 19; // End at 7 PM (24-hour format)

    for (let hour = startTime; hour < endTime; hour += timeGap) {
      let startHour = hour;
      let endHour = hour + timeGap;

      if (endHour > endTime) break; // Stop if the end exceeds the available hours

      let startLabel =
        startHour < 12
          ? `${startHour}:00 AM`
          : startHour === 12
          ? `12:00 PM`
          : `${startHour - 12}:00 PM`;
      let endLabel =
        endHour < 12
          ? `${endHour}:00 AM`
          : endHour === 12
          ? `12:00 PM`
          : `${endHour - 12}:00 PM`;

      slots.push(`${startLabel} - ${endLabel}`);
    }

    return slots;
  };

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

  const filterReservations = (date) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_date);
      const endDate = new Date(res.end_date);
      const selectedDate = new Date(date);

      return selectedDate >= startDate && selectedDate <= endDate;
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today || date.getDay() === 0) {
      return "unavailable";
    }

    // Check if date is within any group reservation period
    const isWithinGroupReservation = reservations.some((res) => {
      if (res.reservation_type === "Group") {
        const startDate = new Date(res.start_date).setHours(0, 0, 0, 0);
        const endDate = new Date(res.end_date).setHours(23, 59, 59, 999);
        return date >= startDate && date <= endDate;
      }
      return false;
    });

    if (isWithinGroupReservation) {
      return "unavailable";
    }

    const dailyReservations = filterReservations(date);
    const soloReservationsCount = dailyReservations.filter(
      (res) => res.reservation_type === "Solo"
    ).length;

    const isFullyBooked = soloReservationsCount >= 5;

    // Check if the date is blocked
    const isBlocked = blockedDates.some(({ start, end }) => {
      const startDate = new Date(start).setHours(0, 0, 0, 0);
      const endDate = new Date(end).setHours(23, 59, 59, 999);
      return date >= startDate && date <= endDate;
    });

    if (isBlocked || isFullyBooked) {
      return "unavailable";
    }

    return "available";
  };

  const tileDisabled = ({ date }) => {
    if (date.getDay() === 0) return true;

    // Block all dates that fall within any group reservation period
    const isWithinGroupReservation = reservations.some((res) => {
      if (res.reservation_type === "Group") {
        const startDate = new Date(res.start_date).setHours(0, 0, 0, 0);
        const endDate = new Date(res.end_date).setHours(23, 59, 59, 999);
        return date >= startDate && date <= endDate;
      }
      return false;
    });

    if (isWithinGroupReservation) {
      return true;
    }

    const dailyReservations = filterReservations(date);
    const soloReservationsCount = dailyReservations.filter(
      (res) => res.reservation_type === "Solo"
    ).length;
    const isFullyBooked = soloReservationsCount >= 5;

    const isBlocked = blockedDates.some(({ start, end }) => {
      const startDate = new Date(start).setHours(0, 0, 0, 0);
      const endDate = new Date(end).setHours(23, 59, 59, 999);
      return date >= startDate && date <= endDate;
    });

    return isBlocked || isFullyBooked;
  };

  const saveReservation = async () => {
    if (!selectedDates || !selectedTimeSlot) {
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
      time_slot: selectedTimeSlot,
    };

    try {
      // Validate the reservation
      const response = await fetch(
        "https://isked-backend-ssmj.onrender.com/ValidateReservation",
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
              {selectedTimeSlot || "No time selected"}
            </p>
          </div>

          <button className="apply-dates" onClick={saveReservation}>
            Apply Dates
          </button>
        </div>

        <StepIndicator currentStep={1} />

        <div className="dropdown-container mb-3" ref={dropdownRef}>
          <div className="time-dropdown">
            <select
              className="btn-db dropdown-toggle"
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
            >
              <option value="">Select Time</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Calendar
          minDate={new Date()}
          onChange={handleDateChange}
          selectRange={true}
          value={selectedDates}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
        />

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
