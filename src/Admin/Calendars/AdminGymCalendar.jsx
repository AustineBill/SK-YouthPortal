import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { OverlayTrigger, Popover } from "react-bootstrap";
import axios from "axios";

const AdminGymCalendar = () => {
  const [calendarReservations, setCalendarReservations] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeGap, setTimeGap] = useState(1);
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    const fetchCalendarReservations = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend.onrender.com/ViewSched"
        );
        setCalendarReservations(response.data);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchCalendarReservations();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [dateRes, timeRes] = await Promise.all([
          axios.get("https://isked-backend.onrender.com/settings"),
          axios.get("https://isked-backend.onrender.com/time-settings"),
        ]);

        setBlockedDates(
          dateRes.data.blocked_dates.map((date) => ({
            start: date.start_date,
            end: date.end_date,
          }))
        );
        setTimeGap(timeRes.data?.time_gap || 1); // Defaults to 1 if empty
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSettings();
  }, []);

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

  const filterCalendarReservations = (date) => {
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    return calendarReservations.filter((res) => {
      const startDate = new Date(res.start_date).setHours(0, 0, 0, 0);
      const endDate = new Date(res.end_date).setHours(23, 59, 59, 999);

      if (!(normalizedDate >= startDate && normalizedDate <= endDate)) {
        return false;
      }

      if (!selectedTimeSlot) {
        return true; // No time filter applied
      }

      // Normalize time slot format before comparison
      const normalizeTimeSlot = (slot) =>
        slot
          .replace(/\s+/g, "") // Remove spaces
          .toLowerCase(); // Convert to lowercase

      return (
        normalizeTimeSlot(res.time_slot) === normalizeTimeSlot(selectedTimeSlot)
      );
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const today = new Date().setHours(0, 0, 0, 0);
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    if (normalizedDate < today) return "disabled";
    if (date.getDay() === 0) return "disabled";

    // Check if date is within any group reservation period
    const isWithinGroupReservation = calendarReservations.some((res) => {
      if (res.reservation_type === "Group") {
        const startDate = new Date(res.start_date).setHours(0, 0, 0, 0);
        const endDate = new Date(res.end_date).setHours(23, 59, 59, 999);
        return normalizedDate >= startDate && normalizedDate <= endDate;
      }
      return false;
    });

    if (isWithinGroupReservation) {
      return "unavailable"; // Red means unavailable due to Group reservation
    }

    if (
      blockedDates.some((blocked) => {
        const start = new Date(blocked.start).setHours(0, 0, 0, 0);
        const end = new Date(blocked.end).setHours(23, 59, 59, 999);
        return normalizedDate >= start && normalizedDate <= end;
      })
    ) {
      return "blocked"; // Another unavailable status
    }

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
          tileDisabled={({ date, view }) => {
            if (view !== "month") return false;

            const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

            // Disable Sundays
            if (date.getDay() === 0) return true;

            // Disable all blocked dates
            return blockedDates.some((blocked) => {
              if (!blocked.start || !blocked.end) return false;

              const start = new Date(blocked.start).setHours(0, 0, 0, 0);
              const end = new Date(blocked.end).setHours(23, 59, 59, 999);

              return normalizedDate >= start && normalizedDate <= end;
            });
          }}
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
