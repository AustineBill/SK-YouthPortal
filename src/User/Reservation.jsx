import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styling
import '../user-style.css'; // Import your custom styling

const Reservation = () => {
  // Example arrays for fully booked and pencil booked dates
  const fullyBookedDates = ['2024-09-26', '2024-10-04', '2024-10-11'];
  const pencilBookedDates = ['2024-09-27', '2024-10-05', '2024-10-12'];

  // Initialize the selected date state as an array (for range selection)
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);

  // Check if a date is fully booked (unavailable)
  const isUnavailable = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return fullyBookedDates.includes(formattedDate);
  };

  // Handle date or date range changes
  const handleDateChange = (range) => {
    const [start, end] = range;
    // Ensure both start and end dates are available before setting
    if (!isUnavailable(start) && !isUnavailable(end)) {
      setSelectedDates(range);
    } else {
      alert('One or more dates in the range are unavailable.');
    }
  };

  // Action when applying the selected dates
  const applyDates = () => {
    console.log('Selected Dates: ', selectedDates);
    // You can add an API call here or any other action with the selected dates
  };

  return (
    <div className="calendar-container">
      <h1>Gym Reservations</h1>

      {/* Legend for color codes */}
      <div className="legend">
        <span className="pencil-booked">Pencil Booked</span>
        <span className="reserved">Reserved</span>
      </div>

      {/* Calendar Component */}
      <Calendar
        minDate={new Date()} // Prevent past dates from being selected
        onChange={handleDateChange} // Handle single or range selection
        selectRange={true} // Enable range selection
        value={selectedDates} // Current selected date or range
        tileClassName={({ date, view }) => {
          const formattedDate = date.toISOString().split('T')[0];
          if (fullyBookedDates.includes(formattedDate)) {
            return 'reserved'; // Mark as reserved (fully booked)
          } else if (pencilBookedDates.includes(formattedDate)) {
            return 'pencil-booked'; // Mark as pencil booked (partially booked)
          }
          return null; // Default for available dates
        }}
      />

      {/* Display Selected Date(s) */}
      <div className="selected-date">
        Selected Dates: {selectedDates[0].toDateString()} to {selectedDates[1].toDateString()}
      </div>

      {/* Button to apply selected dates */}
      <button className="apply-dates" onClick={applyDates}>
        Apply Dates
      </button>
    </div>
  );
};

export default Reservation;
