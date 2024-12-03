import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../WebStyles/UserStyle.css';

const EquipReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationType } = location.state || { reservationType: 'Solo' };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date); // Set the selected date (only one date allowed)
  };

  const saveReservation = async () => {
    if (!selectedDate) {
      alert('Please select a date before proceeding.');
      return false; // Indicate failure to save
    }

    // Retrieve userId from sessionStorage
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in sessionStorage');
      return false; // Indicate failure to save
    }

    // Prepare reservation data
    const reservationData = {
      user_id: userId,
      reservation_type: reservationType,
      date: selectedDate,
    };

    // Save reservation data to sessionStorage
    sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
    navigate('/ScheduleDetails', { state: { reservationData, reservationType } });
    return reservationData; // Return data for the next step
  };

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Reservation</h1>
        <p className='Subtext'> Borrowers </p>
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
            <div className="legend-item">
              <span className="circle maximize"></span>
              <h3>Maximize Capacity</h3>
            </div>
          </div>

          <div className="selected-date after-small"> 
            <p>
              <strong>Selected Date:</strong> {selectedDate.toLocaleDateString()}
            </p>
          </div>

          <button className="apply-dates" onClick={saveReservation}>
            Apply Date
          </button>
        </div>

        <Calendar
          minDate={new Date()}
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>
    </div>
  );
};

export default EquipReservation;
