import React, { useEffect, useState } from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const EquipmentCalendar = ({ blockedDates }) => {
  const [calendarReservations, setCalendarReservations] = useState([]);

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
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);
    const isSunday = date.getDay() === 0;

    if (date < today || isSunday) {
      return "disabled"; // Past dates and Sundays should always be disabled
    }

    // Check if the date is blocked
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
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);
    const isSunday = date.getDay() === 0;

    // Disable past dates, Sundays, and blocked dates
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
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    // Check if the date is disabled (past, Sunday, or blocked)
    const isSunday = date.getDay() === 0;
    const isPast = normalizedDate < today;
    const isBlocked = blockedDates.some((blocked) => {
      const start = new Date(blocked.start).setHours(0, 0, 0, 0);
      const end = new Date(blocked.end).setHours(23, 59, 59, 999);
      return normalizedDate >= start && normalizedDate <= end;
    });

    if (isPast || isSunday || isBlocked) return null; // Prevent hover on disabled tiles

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
