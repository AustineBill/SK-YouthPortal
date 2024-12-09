import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../WebStyles/UserStyle.css';
import StepIndicator from '../Classes/StepIndicator';
import { Modal, Button} from 'react-bootstrap';


const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationType } = location.state || { reservationType: 'Solo' };

  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [selectedTime, setSelectedTime] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
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
    if (!selectedDates || !selectedTime) {
      alert('Please select both a date and a time slot before proceeding.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in sessionStorage');
      return;
    }
    // Backend validation
    try {
      const response = await fetch('http://localhost:5000/Checkreservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          date: selectedDates[0],
        }),
      });

      const result = await response.json();

      if (result.exists) {
        setModalMessage('You already have a booking on this date. The policy allows only one reservation per day.');
        setShowModal(true);
        return;
      }

      // Save reservation if no conflict
      const reservationData = {
        user_id: userId,
        reservation_type: reservationType,
        start_date: selectedDates[0],
        end_date: selectedDates[1],
        time_slot: selectedTime,
      };

      sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
      navigate('/ScheduleDetails', { state: { reservationData, reservationType } });
    } catch (error) {
      console.error('Error checking reservation:', error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Schedule</h1>
        <p className="Subtext">Selected Type: {reservationType}</p>
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

          <div className="selected-date large">
            <p>
              <strong>Selected Date:</strong>{' '}
              {selectedDates[0].toDateString() === selectedDates[1].toDateString()
                ? selectedDates[0].toLocaleDateString()
                : `${selectedDates[0].toLocaleDateString()} to ${selectedDates[1].toLocaleDateString()}`}
            </p>
            <p>
              <strong>Selected Time:</strong> {selectedTime || 'No time selected'}
            </p>
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
              onClick={toggleDropdown}
            >
              Select Time
            </button>
            {isDropdownVisible && (
              <div className="time-dropdown-menu">
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

export default Reservation;
