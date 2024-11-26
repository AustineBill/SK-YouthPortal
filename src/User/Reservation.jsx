import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../WebStyles/UserStyle.css';
import StepIndicator from '../Classes/StepIndicator';

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationType } = location.state || { reservationType: 'Solo' };

  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

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

  const saveReservation = async () => {
    setLoading(true); // Set loading state to true
    try {
      // Validate if both date and time are selected
      if (!selectedDates || !selectedTime) {
        alert('Please select both a date and a time slot before proceeding.');
        return; 
      }

      // Retrieve userId from sessionStorage
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        console.error('No userId found in sessionStorage');
        return;
      }
      // Prepare reservation data
      const reservationData = {
        user_id: userId,
        reservation_type: reservationType,
        start_date: selectedDates[0],
        end_date: selectedDates[1],
        time_slot: selectedTime,
      };

      // Save reservation data to sessionStorage
      sessionStorage.setItem('reservationData', JSON.stringify(reservationData));

      // Send reservation data to the backend
      await axios.post('http://localhost:5000/reservations', reservationData);

      navigate('/ScheduleDetails', { state: { reservationData, reservationType } });
    } catch (error) {
      console.error('Error saving reservation:', error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Schedule</h1>
        <p className='Subtext'>Selected Type: {reservationType}</p>
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
            <div className="legend-item">
              <span className="circle maximize"></span>
              <h3>Maximize Capacity</h3>
            </div>
            <div className="legend-item">
              <span className="circle unknown"></span>
              <h3>Unknown</h3>
            </div>
          </div>

          <div className="selected-date">
            {/* Format the selected dates and times properly */}
            {selectedDates[0].toDateString() === selectedDates[1].toDateString()
              ? `Selected Date: ${selectedDates[0].toLocaleDateString()} ${selectedTime}`
              : `Selected Dates: ${selectedDates[0].toLocaleDateString()} to ${selectedDates[1].toLocaleDateString()} ${selectedTime}`}
          </div>

          <button className="apply-dates" onClick={saveReservation}>
            Apply Dates
          </button>
        </div>

        {loading && (
          <div className="loading-spinner">
            <p>Loading...</p> {/* You can replace this with a spinner component */}
          </div>
        )}

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
                {['9:00 am - 10:00 am', '10:00 am - 11:00 am', '11:00 am - 12:00 nn', '12:00 nn - 1:00 pm', '1:00 pm - 2:00 pm', '2:00 pm - 3:00 pm'].map((time) => (
                  <h6 key={time} className="dropdown-item" onClick={() => selectTime(time)}>
                    {time}
                  </h6>
                ))}
              </div>
            )}
          </div>
        </div>

        <Calendar
          minDate={new Date()}
          onChange={handleDateChange}
          selectRange={true}
          value={selectedDates}
        />
      </div>
    </div>
  );
};

export default Reservation;
