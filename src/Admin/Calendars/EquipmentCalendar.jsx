import React, { useEffect, useState } from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const EquipmentCalendar = () => {
  const [calendarReservations, setCalendarReservations] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);

  // Fetch reservations for the calendar
  const fetchCalendarReservations = async () => {
    try {
      const response = await fetch(
        "https://isked-backend-ssmj.onrender.com/ViewEquipment"
      );
      if (!response.ok) {
        throw new Error("Error fetching calendar reservations");
      }
      const data = await response.json();
      setCalendarReservations(data);
    } catch (error) {
      console.error("Error fetching calendar reservations:", error);
    }
  };

  useEffect(() => {
    fetchCalendarReservations(); // Fetch data for the calendar
  }, []);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/date-settings"
        );

        // Process the blocked dates to only include the date portion, without time
        setBlockedDates(
          response.data.map((date) => ({
            start: new Date(date.start_date).setHours(0, 0, 0, 0), // Only the date, no time
            end: new Date(date.end_date).setHours(23, 59, 59, 999), // Ensure end date includes full day
          }))
        );
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      }
    };

    fetchBlockedDates();
  }, []);

  const filterReservations = (date) => {
    return calendarReservations.filter((res) => {
      const startDate = new Date(res.start_date).toDateString();
      const currentDate = date.toDateString();
      return startDate === currentDate;
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isSunday = date.getDay() === 0;
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    if (date < today || isSunday) {
      return "disabled";
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

  const renderPopover = (dailyReservations) => (
    <Popover id="popover-basic">
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

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isSunday = date.getDay() === 0;
    const isPast = date < today;

    if (isPast || isSunday) return null; // Prevent hover on disabled tiles

    const dailyReservations = filterReservations(date);
    if (dailyReservations.length > 0) {
      return (
        <OverlayTrigger
          trigger="click"
          placement="top"
          overlay={renderPopover(dailyReservations)}
        >
          <div className="overlay-content">
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
          <div className="legend-item">
            <span className="circle blocked"></span>
            <h3>Blocked</h3>
          </div>
        </div>
      </div>

      <Calendar
        className="er-calendar rounded"
        minDate={new Date()}
        selectRange={false} // Prevent range selection
        tileClassName={tileClassName}
        tileContent={tileContent}
        tileDisabled={tileDisabled} // Disable past, Sundays, and blocked dates
      />
    </div>
  );
};

export default EquipmentCalendar;
