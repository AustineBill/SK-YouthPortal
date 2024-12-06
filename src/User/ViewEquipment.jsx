import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../WebStyles/UserStyle.css';

const ViewEquipment = () => {
    const [reservations, setReservations] = useState([]);

    // Fetch reservations from the backend
    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:5000/ViewEquipment');
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

    // Check if the reservation exceeds two days
    const validateReservationDuration = (dates) => {
        if (dates.length > 2) {
            alert('You can only reserve the equipment for a maximum of two days.');
            return false;
        }
        return true;
    };

    const handleDateSelection = (dates) => {
        if (!validateReservationDuration(dates)) return;
        // Removed the state update for selectedDates
    };

    // Filter reservations by date and time slot
    const filterReservations = (date) => {
        return reservations.filter((res) => {
            const startDate = new Date(res.start_date);
            const endDate = new Date(res.end_date);
            const matchesDate = date >= startDate && date <= endDate;
            return matchesDate;
        });
    };

    // Display usernames and reservation details on tiles
    const tileContent = ({ date, view }) => {
        if (view !== 'month') return null; // Render content only for month view

        const dailyReservations = filterReservations(date);

        return dailyReservations.length > 0 ? (
            <div className="reservation-tile-content">
                <div className="reservation-count">
                    <strong>{dailyReservations.length}</strong>
                </div>
                <ul className="reservation-usernames">
                    {dailyReservations.map((res, index) => (
                        <li key={index} className="username">
                            {res.username}
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
                <h1 className="Maintext animated slideInRight">View Equipment Schedule</h1>
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


                <Calendar
                    minDate={new Date()}
                    selectRange={true}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    onChange={handleDateSelection}
                />
            </div>
        </div>
    );
};

export default ViewEquipment;