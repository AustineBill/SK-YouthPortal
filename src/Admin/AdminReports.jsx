import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import "./styles/AdminReport.css";

const Reports = () => {
  const [activeTable, setActiveTable] = useState("users");
  const [dateSortOption, setDateSortOption] = useState("date");
  const [usersData, setUsersData] = useState([]);
  const [equipmentReservations, setEquipmentReservations] = useState([]);

  // Fetch data based on active table
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";
        if (activeTable === "users") {
          url = "http://localhost:5000/user-reports";
          const response = await axios.get(url);
          setUsersData(response.data);
        } else if (activeTable === "equipment") {
          url = "http://localhost:5000/equipment-reports";
          const response = await axios.get(url);
          setEquipmentReservations(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTable]);

  // Group data by date (date, monthly, or annual)
  const groupDataByDate = (data) => {
    const groupedData = data.reduce((acc, entry) => {
      const date = new Date(
        entry.created_at || entry.date || entry.start_date || entry.start_time
      );
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      let groupKey;
      if (dateSortOption === "annual") {
        groupKey = year;
      } else if (dateSortOption === "monthly") {
        groupKey = `${year}-${month.toString().padStart(2, "0")}`;
      } else {
        groupKey = `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
      }

      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(entry);
      return acc;
    }, {});
    return groupedData;
  };

  const groupedUsers = groupDataByDate(usersData);
  const groupedEquipmentReservations = groupDataByDate(equipmentReservations);

  // Generate PDF
  const generatePDF = () => {
    const input = document.getElementById("admin-reports-tables-container");

    const backgroundImage = `${process.env.PUBLIC_URL}/Asset/WebImages/NEW SK LETTER LEGAL SIZE.png`;

    // Wait for the data to be fully rendered
    setTimeout(() => {
      html2canvas(input, {
        useCORS: true,
        backgroundColor: "transparent",
        scale: 2, // Increase scale for better quality
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;

        // Add the background image
        pdf.addImage(backgroundImage, "PNG", 0, 0, pageWidth, pageHeight);

        // Add the content as an overlay
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

        // Save the PDF
        pdf.save(`${activeTable}-report.pdf`);
      });
    }, 500); // Delay by 500ms
  };

  return (
    <div className="admin-reports-container">
      <div className="admin-reports-label">
        <h2 className="admin-reports-label-h2 fst-italic">
          Reservation Reports
        </h2>
      </div>

      <div className="admin-reports-generate-classification-date-container d-flex">
        <div className="admin-reports-classification-container">
          {/* Dropdown for selecting table */}
          <select
            value={activeTable}
            onChange={(e) => setActiveTable(e.target.value)}
            className="admin-reports-classification rounded"
          >
            <option value="users">Users</option>
            <option value="equipment">Equipment Reservations</option>
          </select>
        </div>

        {/* Dropdown for selecting date sort option */}
        <div className="admin-reports-date-container">
          <select
            value={dateSortOption}
            onChange={(e) => setDateSortOption(e.target.value)}
            className="admin-reports-date rounded"
          >
            <option value="date">Date</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        {/* Generate PDF Button */}
        <div className="admin-reports-generate-pdf-container d-flex justify-content-end">
          <button
            className="admin-reports-generate-pdf-button rounded"
            onClick={generatePDF}
          >
            Generate PDF
          </button>
        </div>
      </div>

      {/* Show selected table */}
      <div
        id="admin-reports-tables-container"
        className="reports-list-container"
      >
        {/* Show selected table */}
        {activeTable === "users" && (
          <div className="admin-reports-users-table">
            <h2 className="reports-users-label-h2">Users</h2>
            <table className="admin-reports-users-table-container table-bordered">
              <thead className="admin-reports-users-head text-center">
                <tr>
                  <th>Date</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email Address</th>
                </tr>
              </thead>
              <tbody className="admin-reports-users-body text-center">
                {Object.entries(groupedUsers).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No records found
                    </td>
                  </tr>
                ) : (
                  Object.entries(groupedUsers).map(([date, users]) => (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>
                        {users.map((user) => (
                          <div key={user.id}>{user.id}</div>
                        ))}
                      </td>
                      <td>
                        {users.map((user) => (
                          <div key={user.id}>
                            {user.firstname} {user.lastname}
                          </div>
                        ))}
                      </td>
                      <td>
                        {users.map((user) => (
                          <div key={user.id}>{user.username}</div>
                        ))}
                      </td>
                      <td>
                        {users.map((user) => (
                          <div key={user.id}>{user.email_address}</div>
                        ))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTable === "equipment" && (
          <div className="admin-reports-equipment-table">
            <h2 className="reports-equipment-label-h2">
              Equipment Reservations
            </h2>
            <table className="admin-reports-equipment-table-container table-bordered">
              <thead className="admin-reports-equipment-head text-center">
                <tr>
                  <th>Date</th>
                  <th>User ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reserved Equipment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="admin-reports-equipment-body text-center">
                {Object.entries(groupedEquipmentReservations).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No records found
                    </td>
                  </tr>
                ) : (
                  Object.entries(groupedEquipmentReservations).map(
                    ([date, reservations]) => (
                      <tr key={date}>
                        <td>{date}</td>
                        <td>
                          {reservations.map((res) => (
                            <div key={res.id}>{res.user_id}</div>
                          ))}
                        </td>
                        <td>
                          {reservations.map((res) => (
                            <div key={res.id}>
                              {new Date(res.start_date).toLocaleString()}
                            </div>
                          ))}
                        </td>
                        <td>
                          {reservations.map((res) => (
                            <div key={res.id}>
                              {new Date(res.end_date).toLocaleString()}
                            </div>
                          ))}
                        </td>
                        <td>
                          {reservations.map((res) =>
                            res.reserved_equipment.map((equip, index) => (
                              <div key={index}>
                                {equip.name} (Quantity: {equip.quantity})
                              </div>
                            ))
                          )}
                        </td>
                        <td>
                          {reservations.map((res) => (
                            <div key={res.id}>{res.status}</div>
                          ))}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
