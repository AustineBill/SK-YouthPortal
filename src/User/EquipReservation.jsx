import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import StepIndicator from "../Classes/StepIndicator";
import { Breadcrumb, Modal, Button } from "react-bootstrap";

const EquipReservation = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          "https://isked-backend-ssmj.onrender.com/ViewEquipment"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend.onrender.com/settings"
        );

        if (
          response.data.blocked_dates &&
          response.data.blocked_dates.length > 0
        ) {
          setBlockedDates(
            response.data.blocked_dates.map((date) => ({
              start: date.start_date,
              end: date.end_date,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const saveReservation = async () => {
    if (!selectedDate) {
      alert("Please select a date before proceeding.");
      return;
    }
    const today = new Date();
    const maxDate = new Date(today.setDate(today.getDate() + 7));

    if (selectedDate > maxDate) {
      alert(
        "Reservations are only allowed within a week from today. Please select a valid date."
      );
      return;
    }

    const reservedEquipment =
      JSON.parse(sessionStorage.getItem("reservedEquipment")) || [];
    if (reservedEquipment.length === 0) {
      alert(
        "No equipment selected. Please select equipment before scheduling."
      );
      return;
    }

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found in sessionStorage");
      return false;
    }

    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(selectedDate);
    endDate.setDate(startDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    try {
      const response = await fetch(
        "https://isked-backend-ssmj.onrender.com/CheckEquipment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            date: startDate.toISOString().split("T")[0],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check reservation");
      }

      const result = await response.json();
      if (result.exists) {
        setModalMessage(
          "You already have a booking on this date. The policy allows only one reservation per day."
        );
        setShowModal(true);
        return;
      }
      const reservationData = {
        user_id: userId,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        equipment: reservedEquipment,
      };

      sessionStorage.setItem(
        "reservationData",
        JSON.stringify(reservationData)
      );
      navigate("/ScheduleDetails", { state: { reservationData } });
      return reservationData;
    } catch (error) {
      console.error("Error checking or saving reservation:", error);
      alert("Error checking or saving reservation, please try again later.");
      return false;
    }
  };

  const filterReservations = (date) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_date).toDateString();
      const currentDate = date.toDateString();
      return startDate === currentDate;
    });
  };

  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isSunday = date.getDay() === 0;
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    if (date < today || isSunday) return true;

    return blockedDates.some((blocked) => {
      const start = new Date(blocked.start).setHours(0, 0, 0, 0);
      const end = new Date(blocked.end).setHours(23, 59, 59, 999);
      return normalizedDate >= start && normalizedDate <= end;
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isSunday = date.getDay() === 0;
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    if (date < today || isSunday) {
      return "unavailable";
    }

    if (
      blockedDates.some((blocked) => {
        const start = new Date(blocked.start).setHours(0, 0, 0, 0);
        const end = new Date(blocked.end).setHours(23, 59, 59, 999);
        return normalizedDate >= start && normalizedDate <= end;
      })
    ) {
      return "blocked"; // Blocked dates should be disabled
    }

    const dailyReservations = filterReservations(date);
    if (dailyReservations.length === 0) return "available";
    if (dailyReservations.length >= 5) return "unavailable";
    return "available";
  };

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/Equipment")}>
          Equipment
        </Breadcrumb.Item>
        <Breadcrumb.Item active> Reservation </Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Equipment Schedule</h1>
        <p className="Subtext">Choose the Date</p>
      </div>

      <div className="calendar-container">
        <StepIndicator currentStep={1} />

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
            <p className="text-center ms-4">* Every Sunday is Unavailable</p>
            <p className="text-center ms-5">
              <strong>Selected Date:</strong>{" "}
              {selectedDate.toLocaleDateString()}
            </p>
          </div>
          <button className="apply-dates" onClick={saveReservation}>
            Apply Dates
          </button>
        </div>

        <Calendar
          minDate={new Date()}
          maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
        />
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

export default EquipReservation;
