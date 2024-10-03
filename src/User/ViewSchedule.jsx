import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import '../WebStyles/UserStyle.css'


const ViewSchedule = () => {
    const navigate = useNavigate();
    
  // Initialize the selected date state as an array (for range selection)
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [selectedTime, setSelectedTime] = useState(''); // State for selected time

  // Handle date or date range changes
  const handleDateChange = (range) => {
    // If a single date is selected, set it as both start and end
    if (Array.isArray(range)) {
      setSelectedDates(range);
    } else {
      setSelectedDates([range, range]);
    }
  };


  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <div className="calendar-container">
       
        <div className="text-center text-lg-start mt-4 ">
          <h1 className="Maintext-Calendar animated slideInRight">View Schedule</h1>
            <p className='Subtext-Calendar'>Lorem ipsum</p> 
            
                <button className="book-button" onClick={() => navigate('/Reservation')}>
                    <i className="fa fa-bookmark"></i> Book Now
                </button>
        </div>

      
    
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
            <h3>hindi ko na alam</h3>
          </div>
        </div>

        <div className="selected-date">
          {selectedDates[0].toDateString() === selectedDates[1].toDateString()
            ? `Selected Date: ${selectedDates[0].toDateString()}`
            : `Selected Dates: ${selectedDates[0].toDateString()} to ${selectedDates[1].toDateString()}`}
          {selectedTime && <div>Selected Time: {selectedTime}</div>}
        </div>
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
        minDate={new Date()} // Prevent past dates from being selected
        onChange={handleDateChange} // Handle single or range selection
        selectRange={true} // Enable range selection
        value={selectedDates} // Current selected date or range
      />
    </div>
  );
};

export default ViewSchedule;
