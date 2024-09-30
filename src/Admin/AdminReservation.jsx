import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styling
import './styles/Admin-Style.css'; // Adjust path based on where you place the CSS


import StepIndicator from '../Classes/StepIndicator';

const AdminReservation = () => {
  const navigate = useNavigate();

  // Initialize state for managing reservations and time slots
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [selectedTime, setSelectedTime] = useState('');
  const [reservations, setReservations] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch reservations data (replace with actual data fetching logic)
  useEffect(() => {
    // Simulate fetching reservation data from an API or database
    const fetchedReservations = [
      { date: new Date(), time: '9:00 am - 10:00 am', status: 'Booked' },
      { date: new Date(), time: '10:00 am - 11:00 am', status: 'Available' }
    ];
    setReservations(fetchedReservations);
  }, []);

  const handleDateChange = (range) => {
    if (Array.isArray(range)) {
      setSelectedDates(range);
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
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleReservationAction = (action, reservation) => {
    // Implement logic to approve, cancel, or edit reservations
    console.log(`${action} reservation for ${reservation.time} on ${reservation.date}`);
  };

  return (
    <div className="admin-calendar-container">
      <div className="text-center text-lg-start mt-4 ">
        <h1 className="Maintext-Calendar animated slideInRight">Admin Schedule Management</h1>
        <p className="Subtext-Calendar">Manage venue reservations and availability</p>
      </div>

      <StepIndicator currentStep={2} />

      <div className="grid-container">
        <div className="legend">
          <h2>Legend</h2>
          <div className="legend-item">
            <span className="circle available"></span>
            <h3>Available</h3>
          </div>
          <div className="legend-item">
            <span className="circle booked"></span>
            <h3>Booked</h3>
          </div>
          <div className="legend-item">
            <span className="circle cancelled"></span>
            <h3>Cancelled</h3>
          </div>
        </div>

        <div className="reservation-list">
          <h2>Reservations</h2>
          {reservations.length === 0 ? (
            <p>No reservations for the selected date range.</p>
          ) : (
            reservations.map((reservation, index) => (
              <div key={index} className="reservation-item">
                <p>
                  {reservation.date.toDateString()} - {reservation.time} ({reservation.status})
                </p>
                <button onClick={() => handleReservationAction('Edit', reservation)}>Edit</button>
                <button onClick={() => handleReservationAction('Cancel', reservation)}>Cancel</button>
                <button onClick={() => handleReservationAction('Approve', reservation)}>Approve</button>
              </div>
            ))
          )}
        </div>

        <div className="selected-date">
          {selectedDates[0].toDateString() === selectedDates[1].toDateString()
            ? `Selected Date: ${selectedDates[0].toDateString()}`
            : `Selected Dates: ${selectedDates[0].toDateString()} to ${selectedDates[1].toDateString()}`}
          {selectedTime && <div>Selected Time: {selectedTime}</div>}
        </div>

        <button className="apply-dates" onClick={() => navigate('/AdminScheduleDetails')}>
          Apply Dates
        </button>
      </div>

      <div className="dropdown-container" ref={dropdownRef}>
        <div className="time-dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            onClick={toggleDropdown}
          >
            Select Time
          </button>
          {isDropdownVisible && (
            <div className="time-dropdown-menu" aria-labelledby="dropdownMenuButton">
              <h6 className="dropdown-item" onClick={() => selectTime('9:00 am - 10:00 am')}>
                9:00 am - 10:00 am
              </h6>
              <h6 className="dropdown-item" onClick={() => selectTime('10:00 am - 11:00 am')}>
                10:00 am - 11:00 am
              </h6>
              <h6 className="dropdown-item" onClick={() => selectTime('11:00 am - 12:00 nn')}>
                11:00 am - 12:00 nn
              </h6>
              <h6 className="dropdown-item" onClick={() => selectTime('12:00 nn - 1:00 pm')}>
                12:00 nn - 1:00 pm
              </h6>
              <h6 className="dropdown-item" onClick={() => selectTime('1:00 pm - 2:00 pm')}>
                1:00 pm - 2:00 pm
              </h6>
              <h6 className="dropdown-item" onClick={() => selectTime('2:00 pm - 3:00 pm')}>
                2:00 pm - 3:00 pm
              </h6>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar
        minDate={new Date()}
        onChange={handleDateChange}
        selectRange={true}
        value={selectedDates}
      />
    </div>
  );
};

export default AdminReservation;
