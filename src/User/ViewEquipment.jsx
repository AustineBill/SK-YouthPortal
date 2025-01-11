import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Breadcrumb, Popover, OverlayTrigger } from "react-bootstrap";
import "../WebStyles/CalendarStyles.css";

const ViewEquipment = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location; // Access the passed state
  const { programType } = state || {}; // Destructure programType from state

  // Fetch reservations from the backend
  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:5000/ViewEquipment");
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

  // Filter reservations by start_date
  const filterReservations = (date) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_date).toDateString();
      const currentDate = date.toDateString();
      return startDate === currentDate;
    });
  };

  // Render the popover with reservation details
  const renderPopover = (dailyReservations) => (
    <Popover id="reservation-popover">
      <Popover.Header as="h3">Reservation Details</Popover.Header>
      <Popover.Body>
        {dailyReservations.map((res, index) => (
          <h5 key={index}>
            <strong>User:</strong> {res.username} <br />
            <strong>Item:</strong> {res.equipment_name} <br />
            <strong>Quantity:</strong> {res.quantity}
          </h5>
        ))}
      </Popover.Body>
    </Popover>
  );

  // Assign classes to tiles based on reservation data
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return ""; // Apply styles only in month view

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time component for comparison

    const isSunday = date.getDay() === 0; // Check if the day is Sunday (0 represents Sunday)

    if (date < today || isSunday) {
      return "unavailable"; // Past dates and Sundays should always be unavailable
    }
    const dailyReservations = filterReservations(date);

    if (dailyReservations.length === 0) return "available";
    if (dailyReservations.length >= 5) return "unavailable";
    return "available";
  };

  // Tile content to show popover on click
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const dailyReservations = filterReservations(date);

    if (dailyReservations.length > 0) {
      return (
        <OverlayTrigger
          trigger="click"
          placement="top"
          overlay={renderPopover(dailyReservations)}
        >
          <div className="tile-content">
            <span className="reservation-count">
              {dailyReservations.length}
            </span>
          </div>
        </OverlayTrigger>
      );
    }
    return null;
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
        <Breadcrumb.Item active>View Equipment Reservation</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">
          View Equipment Schedule
        </h1>
        <p className="Subtext">Monitor Available Slots</p>
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
        </div>

        <Calendar
          minDate={new Date()}
          selectRange={false}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>
    </div>
  );
};

export default ViewEquipment;
