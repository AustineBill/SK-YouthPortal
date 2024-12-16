import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../WebStyles/UserStyle.css';

const ViewFacilities = () => {
    const [reservations, setReservations] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const dropdownRef = useRef(null);

    // Fetch reservations from the backend
    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:5000/ViewSched');
            if (!response.ok) {
                throw new Error('Error fetching reservations');
            }
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownVisible((prev) => !prev);
    };

    const selectTime = (time) => {
        setSelectedTimeSlot(time); // Set the selected time slot
        setIsDropdownVisible(false); // Hide the dropdown
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

    // Filter reservations by date and time slot
    const filterReservations = (date) => {
        return reservations.filter((res) => {
            const startDate = new Date(res.start_date);
            const endDate = new Date(res.end_date);
            const matchesDate = date >= startDate && date <= endDate;
            return matchesDate; // Remove the time slot filtering
        });
    };
    

    // Display usernames and reservation details on tiles
    const tileContent = ({ date, view }) => {
        if (view !== 'month') return null; // Render content only for month view
    
        const dailyReservations = filterReservations(date);
    
        return dailyReservations.length > 0 ? (
            <div className="reservation-tile-content">
                <ul className="reservation-usernames">
                    {dailyReservations.map((res, index) => (
                        <li key={index} className="username">
                            {res.username} {/* Display username */}
                        </li>
                    ))}
                </ul>
            </div>
        ) : null;
    };
    

    // Assign classes to tiles based on reservation data
    const tileClassName = ({ date, view }) => {
        if (view !== 'month') return ''; // Apply styles only in month view

        const dailyReservations = filterReservations(date);

        if (dailyReservations.length === 0) return 'vacant';
        if (dailyReservations.length >= 5) return 'unavailable';
        return 'available';
    };

    return (
        <div className="container-fluid">
            <div className="text-center text-lg-start m-4 mv-8 mb-3">
                <h1 className="Maintext animated slideInRight">View Facilities Schedules</h1>
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
                        <div className="legend-item">
                            <span className="circle vacant"></span>
                            <h3>Vacant</h3>
                        </div>
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
                            {selectedTimeSlot || 'Select Time'}
                        </button>
                        {isDropdownVisible && (
                            <div className="time-dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {[
                                    '9:00 am - 10:00 am',
                                    '10:00 am - 11:00 am',
                                    '11:00 am - 12:00 nn',
                                    '12:00 nn - 1:00 pm',
                                    '1:00 pm - 2:00 pm',
                                    '2:00 pm - 3:00 pm',
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

                <Calendar
                    minDate={new Date()}
                    selectRange={true}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                />
            </div>
        </div>
    );
};

export default ViewFacilities;