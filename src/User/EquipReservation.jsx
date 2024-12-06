import React, { useState} from 'react';
import { useNavigate} from 'react-router-dom';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../WebStyles/UserStyle.css';
import StepIndicator from '../Classes/StepIndicator';

const EquipReservation = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date); // Set the selected date (only one date allowed)
  };
  
  const saveReservation = () => {
    if (!selectedDate) {
      alert('Please select a date before proceeding.');
      return;
    }
  
    // Retrieve reserved equipment data from session storage
    const reservedEquipment = JSON.parse(sessionStorage.getItem('reservedEquipment')) || [];
  
    // Check if the user has reserved any equipment
    if (reservedEquipment.length === 0) {
      alert('No equipment selected. Please select equipment before scheduling.');
      return;
    }

    const endDate = new Date(selectedDate);
    endDate.setDate(selectedDate.getDate() + 1); // Add one day

    // Retrieve userId from sessionStorage
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in sessionStorage');
      return false; // Indicate failure to save
    }
  
    // Prepare reservation data
    const reservationData = {
      user_id: userId,
      startDate: selectedDate,
      endDate: endDate,
      equipment: reservedEquipment, 
    };
    sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
    navigate('/ScheduleDetails', { state: { reservationData } });
    return reservationData; // Return data for the next step
  };

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Equipment Schedule</h1>
        <p className='Subtext'> Choose the Date</p>
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
          </div>

          <div className="selected-date after-small"> 
            <p>
              <strong>Selected Date:</strong> {selectedDate.toLocaleDateString()}
            </p>
          </div>
          <button className="apply-dates" onClick={saveReservation}>
            Apply Dates
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
