import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Dropdown,
  Button,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import "./styles/AdminEquipmentReservation.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AdminEquipmentReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [calendarReservations, setCalendarReservations] = useState([]);

  // Fetch reservations for the calendar from /ViewEquipment endpoint
  const fetchCalendarReservations = async () => {
    try {
      const response = await fetch(
        "https://isked-backend-ssmj.onrender.com/ViewEquipment"
      );
      if (!response.ok) {
        throw new Error("Error fetching calendar reservations");
      }
      const data = await response.json();
      setCalendarReservations(data);
    } catch (error) {
      console.error("Error fetching calendar reservations:", error);
    }
  };

  // Fetch reservations for the table from /Allequipments endpoint
  const fetchTableReservations = async () => {
    try {
      const response = await axios.get(
        "https://isked-backend-ssmj.onrender.com/Allequipments"
      );
      setReservations(response.data);
      setFilteredReservations(response.data);
    } catch (error) {
      console.error("Error fetching table reservation data:", error);
    }
  };

  useEffect(() => {
    fetchCalendarReservations(); // Fetch data for the calendar
    fetchTableReservations(); // Fetch data for the table
  }, []);

  // Filter reservations based on selected option
  useEffect(() => {
    let filteredData = reservations;
    const now = new Date();

    if (filterOption === "Now") {
      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate.getTime() === now.getTime();
      });
    } else if (filterOption === "Week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate >= startOfWeek && reservationDate <= endOfWeek;
      });
    } else if (filterOption === "Month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      filteredData = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.start_date);
        return reservationDate >= startOfMonth && reservationDate <= endOfMonth;
      });
    }

    setFilteredReservations(filteredData);
  }, [filterOption, reservations]);

  const handleCheckboxChange = (id) => {
    setSelectedReservations((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((reservationId) => reservationId !== id)
        : [...prevSelected, id]
    );
  };

  const handleReturned = async () => {
    try {
      await axios.post("https://isked-backend-ssmj.onrender.com/markReturned", {
        ids: selectedReservations,
      });
      fetchTableReservations(); // Refresh the reservations list
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error("Error marking reservations as returned:", error);
    }
  };

  const handleNotReturned = async () => {
    try {
      await axios.post(
        "https://isked-backend-ssmj.onrender.com/markNotReturned",
        {
          ids: selectedReservations,
        }
      );
      fetchTableReservations(); // Refresh the reservations list
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error("Error marking reservations as not returned:", error);
    }
  };

  const handleArchive = async (reservationId) => {
    try {
      // Send the DELETE request with the reservation ID in the URL
      await axios.delete(
        `https://isked-backend-ssmj.onrender.com/equipment/${reservationId}`
      );

      // After archiving, fetch the updated reservations list
      fetchTableReservations(); // Refresh the reservations list

      // Optionally, you could filter the reservations locally by checking the is_archived flag
      const updatedReservations = filteredReservations.filter(
        (reservation) => reservation.id !== reservationId
      );

      setFilteredReservations(updatedReservations); // Update the state to reflect the change
      setSelectedReservations([]); // Clear selected reservations
    } catch (error) {
      console.error("Error archiving reservation:", error);
    }
  };

  const filterReservations = (date) => {
    return calendarReservations.filter((res) => {
      const startDate = new Date(res.start_date).toDateString();
      const currentDate = date.toDateString();
      return startDate === currentDate;
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isSunday = date.getDay() === 0;
    if (date < today || isSunday) {
      return "unavailable"; // Past dates and Sundays should always be unavailable
    }
    const dailyReservations = filterReservations(date);
    if (dailyReservations.length === 0) return "available";
    if (dailyReservations.length >= 5) return "unavailable";
    return "available";
  };

  const renderPopover = (dailyReservations) => (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Reservation Details</Popover.Header>
      <Popover.Body>
        {dailyReservations.map((res, index) => (
          <h5 key={index}>
            <strong>User:</strong> {res.username} <br />
            <strong>Item:</strong> {res.equipment_name} <br />
            <strong>Quantity:</strong> {res.quantity}
          </h5>
        ))}
      </Popover.Body>
    </Popover>
  );

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dailyReservations = filterReservations(date);
    if (dailyReservations.length > 0) {
      return (
        <OverlayTrigger
          trigger="click"
          placement="top"
          overlay={renderPopover(dailyReservations)} // Ensure the popover renders correctly
        >
          <div className="overlay-content">
            <span className="reservation-count">
              {dailyReservations.length}
            </span>
          </div>
        </OverlayTrigger>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="admin-equipment-reservation-container">
      <h2 className="admin-ereservation-label-h2 fst-italic">
        Equipment Reservation
      </h2>

      <div className="calendar-container">
        <Calendar
          className={"er-calendar rounded"}
          minDate={new Date()}
          selectRange={true}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>

      <div className="admin-ereservation-buttons-table-container">
        <div className="admin-er-toggle-buttons-container d-flex align-items-center">
          <Dropdown className="er-toggle-container">
            <Dropdown.Toggle className="er-toggle">
              {filterOption}
            </Dropdown.Toggle>
            <Dropdown.Menu className="er-toggle-text">
              <Dropdown.Item onClick={() => setFilterOption("Now")}>
                Now
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterOption("Week")}>
                Week
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterOption("Month")}>
                Month
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterOption("All")}>
                All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <button
            disabled={selectedReservations.length === 0}
            onClick={handleReturned}
            className="admin-er-return-button bg-success text-white rounded"
          >
            Mark as Returned
          </button>
          <button
            disabled={selectedReservations.length === 0}
            onClick={handleNotReturned}
            className="admin-er-not-returned-button bg-danger text-white rounded"
          >
            Mark as Not Returned
          </button>
        </div>

        <Table className="admin-ereservation-table-container table-bordered">
          <thead className="admin-ereservation-head text-center">
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReservations(
                        filteredReservations.map(
                          (reservation) => reservation.id
                        )
                      );
                    } else {
                      setSelectedReservations([]);
                    }
                  }}
                  checked={
                    selectedReservations.length === filteredReservations.length
                  }
                />
              </th>
              <th>Reservation ID</th>
              <th>Reserved Equipment</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th style={{ width: "120px" }}>Action</th>
            </tr>
          </thead>

          <tbody className="admin-ereservation-body text-center">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No Reservation Found.
                </td>
              </tr>
            ) : (
              filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReservations.includes(reservation.id)}
                      onChange={() => handleCheckboxChange(reservation.id)}
                    />
                  </td>
                  <td>{reservation.id}</td>
                  <td>
                    {Array.isArray(reservation.reserved_equipment) &&
                    reservation.reserved_equipment.length > 0 ? (
                      reservation.reserved_equipment.map((item) => (
                        <div key={item.id}>
                          {item.name} (Quantity: {item.quantity})
                        </div>
                      ))
                    ) : (
                      <span>No items reserved</span>
                    )}
                  </td>
                  <td>{formatDate(reservation.start_date)}</td>
                  <td>{formatDate(reservation.end_date)}</td>
                  <td>{reservation.status || "Pending"}</td>
                  <td className="admin-ereservation-action-button-container d-flex justify-content-center">
                    <Button
                      variant="danger"
                      className="admin-ereservation-delete-button rounded-pill"
                      onClick={() => handleArchive(reservation.id)} // Pass the reservation ID
                      disabled={
                        reservation.status === "Not Returned" ||
                        reservation.status === "Pending" ||
                        reservation.is_archived // Disable if archived
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminEquipmentReservation;
