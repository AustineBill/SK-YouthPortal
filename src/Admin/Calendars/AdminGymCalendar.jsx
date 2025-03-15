import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { OverlayTrigger, Popover } from "react-bootstrap";
import axios from "axios";

const AdminGymCalendar = ({ blockedDates, generateTimeSlots }) => {
  const [calendarReservations, setCalendarReservations] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  useEffect(() => {
    const fetchCalendarReservations = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/ViewSched"
        );
        console.log("Fetched Reservations:", response.data);
        setCalendarReservations(response.data);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchCalendarReservations();
  }, []);

  const filterCalendarReservations = (date) => {
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);
    return calendarReservations.filter((res) => {
      const startDate = new Date(res.start_date).setHours(0, 0, 0, 0);
      const endDate = new Date(res.end_date).setHours(23, 59, 59, 999);

      // Ensure the reservation time slot matches exactly (e.g., "1:00 PM - 2:00 PM")
      const matchesTimeSlot = selectedTimeSlot
        ? res.time_slot.trim() === selectedTimeSlot.trim()
        : true;

      return (
        normalizedDate >= startDate &&
        normalizedDate <= endDate &&
        matchesTimeSlot // Ensure exact match of time slot
      );
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const today = new Date().setHours(0, 0, 0, 0);
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);
    if (normalizedDate < today) return "disabled";
    if (date.getDay() === 0) return "disabled";
    if (
      blockedDates.some((blocked) => {
        const start = new Date(blocked.start).setHours(0, 0, 0, 0);
        const end = new Date(blocked.end).setHours(23, 59, 59, 999);
        return normalizedDate >= start && normalizedDate <= end;
      })
    ) {
      return "blocked";
    }

    const dailyReservations = filterCalendarReservations(date);
    let totalReservations = 0;
    dailyReservations.forEach((res) => {
      if (res.reservation_type === "Group") {
        totalReservations += 5;
      } else {
        totalReservations += 1;
      }
    });

    if (totalReservations >= 5) return "unavailable";
    return "available";
  };

  return (
    <div>
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
          className={"gr-calendar rounded"}
          minDate={new Date()}
          tileClassName={tileClassName}
          tileDisabled={({ date, view }) =>
            view === "month" && date.getDay() === 0
          }
          tileContent={({ date, view }) => {
            if (view !== "month") return null;
            const dailyReservations = filterCalendarReservations(date);

            if (dailyReservations.length > 0) {
              return (
                <OverlayTrigger
                  trigger="click"
                  placement="top"
                  overlay={
                    <Popover id="popover-basic">
                      <Popover.Body>
                        {dailyReservations.map((res, index) => (
                          <div key={index}>
                            {res.username}{" "}
                            {res.reservation_type === "Group" ? "(Group)" : ""}
                          </div>
                        ))}
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <div className="overlay-content">
                    <div className="reservation-count">
                      {dailyReservations.length}
                    </div>
                  </div>
                </OverlayTrigger>
              );
            }
            return null;
          }}
        />
      </div>
    </div>
  );
};

export default AdminGymCalendar;
