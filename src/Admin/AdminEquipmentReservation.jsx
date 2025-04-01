import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Dropdown, Button } from "react-bootstrap";
import EquipmentCalendar from "./Calendars/EquipmentCalendar";
import "../WebStyles/Admin-CSS.css";

const AdminEquipmentReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const applySearchFilter = useCallback(
    (data) => {
      if (!searchTerm) return data;
      return data.filter((reservation) => {
        const refId = reservation.reservation_id.toString();
        return refId.includes(searchTerm);
      });
    },
    [searchTerm]
  );

  useEffect(() => {
    let filteredData = reservations;
    if (statusFilter !== "All") {
      filteredData = filteredData.filter(
        (reservation) => reservation.status === statusFilter
      );
    }
    setFilteredReservations(applySearchFilter(filteredData));
  }, [statusFilter, reservations, applySearchFilter]);

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

    setFilteredReservations(applySearchFilter(filteredData));
  }, [filterOption, reservations, applySearchFilter]);

  const handleCheckboxChange = (id) => {
    setSelectedReservations((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((reservationId) => reservationId !== id)
        : [...prevSelected, id]
    );
  };

  const handleStatusUpdate = async (status) => {
    try {
      await axios.post(`https://isked-backend.onrender.com/mark/${status}`, {
        ids: selectedReservations,
      });
      fetchTableReservations();
      setSelectedReservations([]);
    } catch (error) {
      console.error(`Error marking reservations as ${status}:`, error);
    }
  };

  const handleArchive = async (reservationId) => {
    try {
      await axios.delete(
        `https://isked-backend-ssmj.onrender.com/equipment/${reservationId}`
      );
      fetchTableReservations();
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

  const highlightSearchMatch = (text) => {
    if (!searchTerm) return text;
    const strText = text.toString();
    const index = strText.indexOf(searchTerm);
    if (index === -1) return strText;

    return (
      <>
        {strText.substring(0, index)}
        <span style={{ backgroundColor: "yellow" }}>
          {strText.substring(index, index + searchTerm.length)}
        </span>
        {strText.substring(index + searchTerm.length)}
      </>
    );
  };

  return (
    <div className="admin-equipment-reservation-container">
      <h2 className="admin-ereservation-label-h2 fst-italic">
        Equipment Reservation
      </h2>

      <EquipmentCalendar />

      <div className="admin-equipment-reservation-search-container d-flex justify-content-between align-items-center">
        <div className="button-group d-flex align-items-center">
          <Dropdown className="er-date-toggle-container me-2">
            <Dropdown.Toggle className="er-date-toggle">
              {filterOption}
            </Dropdown.Toggle>
            <Dropdown.Menu className="er-date-toggle-text">
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

          <Button
            disabled={!selectedReservations.length}
            onClick={() => handleStatusUpdate("Received")}
            className="bg-primary rounded me-2"
          >
            Received
          </Button>
          <Button
            disabled={!selectedReservations.length}
            onClick={() => handleStatusUpdate("Returned")}
            className="bg-success rounded me-2"
          >
            Returned
          </Button>
          <Button
            disabled={!selectedReservations.length}
            onClick={() => handleStatusUpdate("Not Returned")}
            className="bg-danger rounded me-2"
          >
            Not Returned
          </Button>
        </div>

        <div className="filter-group d-flex align-items-center">
          <input
            type="text"
            placeholder="Search Reservation ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-equipment-reservation-search-input rounded me-2"
          />

          <Dropdown>
            <Dropdown.Toggle>Status: {statusFilter}</Dropdown.Toggle>
            <Dropdown.Menu>
              {["All", "Pending", "Returned", "Not Returned", "Received"].map(
                (status) => (
                  <Dropdown.Item
                    key={status}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </Dropdown.Item>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="admin-ereservation-contents-container">
        <table className="admin-ereservation-table-container table-bordered">
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
                    selectedReservations.length > 0 &&
                    selectedReservations.length === filteredReservations.length
                  }
                />
              </th>
              <th>Reservation ID</th>
              <th>Equipment</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="admin-ereservation-body text-center">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No reservations found
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
                  <td>{highlightSearchMatch(reservation.reservation_id)}</td>
                  <td>
                    {reservation.reserved_equipment?.map((item) => (
                      <div key={item.id}>
                        {item.name} (Qty: {item.quantity})
                      </div>
                    ))}
                  </td>
                  <td>{formatDate(reservation.start_date)}</td>
                  <td>{formatDate(reservation.end_date)}</td>
                  <td>{reservation.status || "Pending"}</td>
                  <td>
                    <div className="admin-ereservation-action-button-container d-flex justify-content-center">
                      <Button
                        variant="danger"
                        className="admin-ereservation-archive-button rounded-pill"
                        onClick={() => handleArchive(reservation.id)}
                        disabled={reservation.status === "Not Returned"}
                      >
                        <i className="bi bi-archive"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEquipmentReservation;
