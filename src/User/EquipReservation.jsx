import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../WebStyles/UserStyle.css';
import StepIndicator from '../Classes/StepIndicator';
import { Modal, Button} from 'react-bootstrap';

const EquipReservation = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  


  const handleDateChange = (date) => {
    setSelectedDate(date); // Set the selected date (only one date allowed)
  };

 const saveReservation = async () => {
  if (!selectedDate) {
    alert('Please select a date before proceeding.');
    return;
  }

  const reservedEquipment = JSON.parse(sessionStorage.getItem('reservedEquipment')) || [];
  if (reservedEquipment.length === 0) {
    alert('No equipment selected. Please select equipment before scheduling.');
    return;
  }

  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    console.error('No userId found in sessionStorage');
    return false; // Indicate failure to save
  }

  // Set startDate to the clicked date at 12:00 AM (local time)
  const startDate = new Date(selectedDate);
  startDate.setHours(0, 0, 0, 0); // Ensure time is set to 12:00 AM
  

  // Set endDate to the next day at 12:00 AM (local time)
  const endDate = new Date(selectedDate);
  endDate.setDate(startDate.getDate() + 1); // Add 1 day
  endDate.setHours(0, 0, 0, 0); // Ensure time is set to 12:00 AM

  try {
    const response = await fetch('http://localhost:5000/CheckEquipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, date: startDate.toLocaleDateString() }),
    });

    if (!response.ok) {
      throw new Error('Failed to check reservation');
    }

    const result = await response.json();
    if (result.exists) {
      setModalMessage('You already have a booking on this date. The policy allows only one reservation per day.');
      setShowModal(true);
      return;
    }

    // Prepare reservation data
    const reservationData = {
      user_id: userId,
      startDate: startDate.toString(), // Save the local date and time as a string
      endDate: endDate.toString(),
      equipment: reservedEquipment,
    };

    sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
    navigate('/ScheduleDetails', { state: { reservationData } });
    return reservationData; // Return data for the next step
  } catch (error) {
    console.error('Error checking or saving reservation:', error);
    alert('Error checking or saving reservation, please try again later.');
    return false; // Handle failure
  }
};

  
  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Equipment Schedule</h1>
        <p className="Subtext">Choose the Date</p>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reservation Conflict</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EquipReservation;
