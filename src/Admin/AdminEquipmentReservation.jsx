import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Dropdown, Button } from "react-bootstrap";
import EquipmentCalendar from "./Calendars/EquipmentCalendar";
import "./styles/AdminEquipmentReservation.css";

const AdminEquipmentReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);

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
    fetchTableReservations();
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
      fetchTableReservations();
      setSelectedReservations([]);
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
      fetchTableReservations();
      setSelectedReservations([]);
    } catch (error) {
      console.error("Error marking reservations as not returned:", error);
    }
  };

  const handleArchive = async (reservationId) => {
    try {
      await axios.delete(
        `https://isked-backend-ssmj.onrender.com/equipment/${reservationId}`
      );

      fetchTableReservations();
      const updatedReservations = filteredReservations.filter(
        (reservation) => reservation.id !== reservationId
      );

      setFilteredReservations(updatedReservations);
      setSelectedReservations([]);
    } catch (error) {
      console.error("Error archiving reservation:", error);
    }
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

      <EquipmentCalendar />

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
                  <td>{reservation.reservation_id}</td>
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
                      <i className="bi bi-trash"></i>
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
