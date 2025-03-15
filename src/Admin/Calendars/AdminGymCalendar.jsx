import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { OverlayTrigger, Popover, Modal, Button } from "react-bootstrap";
import axios from "axios";

const AdminGymCalendar = () => {
  const [calendarReservations, setCalendarReservations] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeGap, setTimeGap] = useState(1);
  const [showTimeGapModal, setShowTimeGapModal] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [startBlockDate, setStartBlockDate] = useState("");
  const [endBlockDate, setEndBlockDate] = useState("");

  useEffect(() => {
    const fetchCalendarReservations = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/ViewSched"
        );
        setCalendarReservations(response.data);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    fetchCalendarReservations();
  }, []);

  const filterCalendarReservations = (date) => {
    return calendarReservations.filter((res) => {
      const startDate = new Date(res.start_date);
      const endDate = new Date(res.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    if (date.getDay() === 0) return "disabled"; // Disable Sundays

    // Normalize the date to ensure time is not affecting the comparison
    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    // Check if the date is in the blocked range
    if (
      blockedDates.some((blocked) => {
        const start = new Date(blocked.start).setHours(0, 0, 0, 0);
        const end = new Date(blocked.end).setHours(23, 59, 59, 999);
        return normalizedDate >= start && normalizedDate <= end;
      })
    ) {
      return "blocked"; // This adds the CSS class to fully block the date
    }

    const dailyReservations = filterCalendarReservations(date);
    return dailyReservations.length > 0 ? "reserved" : "available";
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour += timeGap) {
      let start = `${hour}:00 ${hour < 12 ? "AM" : "PM"}`;
      let end = `${hour + timeGap}:00 ${hour + timeGap < 12 ? "AM" : "PM"}`;
      if (hour + timeGap <= 17) {
        slots.push(`${start} - ${end}`);
      }
    }
    return slots;
  };

  return (
    <div>
      <div className="admin-controls d-flex justify-content-between align-items-center">
        <div className="dropdown-container text-center justify-center">
          <select
            className="form-select text-center"
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            <option className="btn btn-info me-2" value="">
              Select Time
            </option>
            {generateTimeSlots().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button
            className="btn btn-warning me-2"
            onClick={() => setShowTimeGapModal(true)}
          >
            Customize Time Gap
          </button>
          <button
            className="btn btn-info me-2"
            onClick={() => setShowBlockModal(true)}
          >
            Block Dates
          </button>
        </div>
      </div>

      {/* Modal for selecting time gap */}
      <Modal show={showTimeGapModal} onHide={() => setShowTimeGapModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Customize Time Gap</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Select Time Gap:</label>
          <select
            className="form-select"
            value={timeGap}
            onChange={(e) => setTimeGap(Number(e.target.value))}
          >
            <option value={1}>1 Hour</option>
            <option value={2}>2 Hours</option>
            <option value={3}>3 Hours</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowTimeGapModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowTimeGapModal(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for blocking dates */}
      <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Block Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control"
            onChange={(e) => setStartBlockDate(e.target.value)}
          />
          <label>End Date:</label>
          <input
            type="date"
            className="form-control"
            onChange={(e) => setEndBlockDate(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!startBlockDate || !endBlockDate) return; // Prevent empty values

              const start = new Date(startBlockDate);
              const end = new Date(endBlockDate);

              // Ensure the end date is included fully
              end.setHours(23, 59, 59, 999);

              setBlockedDates([...blockedDates, { start, end }]);
              setShowBlockModal(false);
            }}
          >
            Block Date Range
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="calendar-container">
        <Calendar
          className={"gr-calendar rounded"}
          minDate={new Date()}
          tileClassName={tileClassName}
          tileDisabled={({ date, view }) =>
            view === "month" && date.getDay() === 0
          }
          tileContent={({ date, view }) => {
            if (view !== "month") return null;
            if (
              blockedDates.some(
                (blocked) => date >= blocked.start && date <= blocked.end
              )
            ) {
              return <div className="blocked-date">Blocked</div>;
            }
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
