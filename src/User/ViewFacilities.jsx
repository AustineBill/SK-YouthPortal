import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Popover, OverlayTrigger } from "react-bootstrap";
import "../WebStyles/CalendarStyles.css";

const ViewFacilities = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch reservations from the backend
  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:5000/ViewSched");
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

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const selectTime = (time) => {
    setSelectedTimeSlot(time);
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

  // Filter reservations by date
  const filterReservations = (date) => {
    return reservations.filter((res) => {
      const startDate = new Date(res.start_date);
      const endDate = new Date(res.end_date);
      const selectedDate = new Date(date);

      return selectedDate >= startDate && selectedDate <= endDate;
    });
  };

  // Count solo and group reservations
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return ""; // Apply styles only in month view

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time component for comparison

    const isSunday = date.getDay() === 0; // Check if the day is Sunday (0 represents Sunday)

    if (date < today || isSunday) {
      return "unavailable"; // Past dates and Sundays should always be unavailable
    }

    const dailyReservations = filterReservations(date);

    if (dailyReservations.length === 0) {
      return "available"; // No reservations: Vacant
    }

    const soloReservationsCount = dailyReservations.filter(
      (res) => res.reservation_type === "Solo"
    ).length;

    const hasGroupReservation = dailyReservations.some(
      (res) => res.reservation_type === "Group"
    );
    const isFullyBooked = soloReservationsCount >= 5;

    if (hasGroupReservation || isFullyBooked) {
      return "unavailable"; // Fully booked: Unavailable
    }

    return "available"; // Partially booked
  };

  // Render a popover with reservation details
  const renderPopover = (dailyReservations) => (
    <Popover id="popover-basic">
      <Popover.Body>
        {dailyReservations.map((res, index) => (
          <div key={index}>
            {res.username} {res.reservation_type === "Group" ? "(Group)" : ""}
          </div>
        ))}
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">
          View Facilities Schedules
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

          <div className="dropdown-container" ref={dropdownRef}>
            <div className="time-dropdown">
              <button
                className="btn-db dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                onClick={toggleDropdown}
              >
                {selectedTimeSlot || "Select Time"}
              </button>
              {isDropdownVisible && (
                <div
                  className="time-dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {[
                    "9:00 am - 10:00 am",
                    "10:00 am - 11:00 am",
                    "11:00 am - 12:00 nn",
                    "12:00 nn - 1:00 pm",
                    "1:00 pm - 2:00 pm",
                    "2:00 pm - 3:00 pm",
                  ].map((time) => (
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
        </div>

        <Calendar
          minDate={new Date()}
          selectRange={true}
          tileClassName={tileClassName}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const dailyReservations = filterReservations(date);

            if (dailyReservations.length > 0) {
              const displayCount = dailyReservations.some(
                (res) => res.reservation_type === "Group"
              )
                ? 5
                : dailyReservations.length;

              return (
                <OverlayTrigger
                  trigger="click"
                  placement="top"
                  overlay={renderPopover(dailyReservations)}
                >
                  <div className="overlay-content">
                    {displayCount > 0 && (
                      <div className="reservation-count">{displayCount}</div>
                    )}
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

export default ViewFacilities;
