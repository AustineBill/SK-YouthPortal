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
    try {
      // Retrieve userId from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
          console.error('No userId found in localStorage');
          return;
      }
  
      // Ensure userId exists before proceeding
      if (!userId) {
        console.error('User ID is not available in localStorage.');
        alert('Please log in before making a reservation.');
        return; // Stop the function if userId is missing
      }
  
      // Reservation data object
      const reservationData = {
        user_id: userId,
        reservation_type: reservationType,
        start_date: selectedDates[0],
        end_date: selectedDates[1],
        time_slot: selectedTime,
      };
  
      // Send POST request to server
      await axios.post('http://localhost:5000/reservations', reservationData);
      
      // Navigate on success
      navigate('/ScheduleDetails', { state: { reservationType } });
    } catch (error) {
      console.error('Error saving reservation:', error);
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
            {selectedDates[0].toDateString() === selectedDates[1].toDateString()
              ? `Selected Date: ${selectedDates[0].toDateString()}`
              : `Selected Dates: ${selectedDates[0].toDateString()} to ${selectedDates[1].toDateString()}`}
            {selectedTime && <div>Selected Time: {selectedTime}</div>}
          </div>

          <button className="apply-dates" onClick={saveReservation}>
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
