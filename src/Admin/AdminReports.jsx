import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import "../WebStyles/Admin-CSS.css";

const Reports = () => {
  const [activeTable, setActiveTable] = useState("users");
  const [dateSortOption, setDateSortOption] = useState("date");
  const [usersData, setUsersData] = useState([]);
  const [equipmentReservations, setEquipmentReservations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [inventory, setInventory] = useState([]);
  const adminUsername = sessionStorage.getItem("username"); // here

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";
        if (activeTable === "users") {
          url = "https://isked-backend-ssmj.onrender.com/user-reports";
          const response = await axios.get(url);
          setUsersData(response.data);
        } else if (activeTable === "equipment") {
          url = "https://isked-backend-ssmj.onrender.com/equipment-reports";
          const response = await axios.get(url);
          setEquipmentReservations(response.data);
        } else if (activeTable === "schedules") {
          url = "https://isked-backend-ssmj.onrender.com/schedule-reports";
          const response = await axios.get(url);
          setSchedules(response.data);
        } else if (activeTable === "inventory") {
          url = "https://isked-backend-ssmj.onrender.com/inventory-reports";
          const response = await axios.get(url);
          setInventory(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTable]);

  const groupDataByDate = (data) => {
    const groupedData = data.reduce((acc, entry) => {
      const date = new Date(entry.created_at || entry.date || entry.start_date);
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

  const generatePDF = () => {
    const input = document.getElementById("admin-reports-tables-container");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [330.6, 216.9], // Legal paper size in landscape
      });

      pdf.addImage(imgData, "PNG", 10, 10, 280, 180);

      // Define missing variables
      const adminFontSize = 12;
      const dateFontSize = 10;
      const signatureFontSize = 12;
      const margin = 15;
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;

      pdf.setFont("times", "Bold");
      pdf.setFontSize(adminFontSize);
      const adminNameYPosition = pageHeight - 50;
      pdf.text(`Printed by: ${adminUsername || "N/A"}`, 15, adminNameYPosition);

      pdf.setFontSize(dateFontSize);
      const currentDate = new Date().toLocaleDateString();
      const dateYPosition = adminNameYPosition + 5;
      pdf.text(`Printed date: ${currentDate}`, margin, dateYPosition);

      pdf.setFontSize(signatureFontSize);
      const signatureXPosition = pageWidth - margin - 90;
      const signatureYPosition = pageHeight - 45;
      pdf.line(
        signatureXPosition,
        signatureYPosition,
        signatureXPosition + 85,
        signatureYPosition
      );

      const centeredXPosition =
        signatureXPosition +
        (85 -
          (pdf.getStringUnitWidth("Signature over Printed Name") *
            pdf.getFontSize()) /
            pdf.internal.scaleFactor) /
          2;

      pdf.text(
        "Signature over Printed Name",
        centeredXPosition,
        signatureYPosition + 10
      );

      pdf.save(`${activeTable}-report.pdf`);
    });
  };

  return (
    <div className="admin-reports-container">
      <div className="admin-reports-label">
        <h2 className="admin-reports-label-h2 fst-italic">Reports</h2>
      </div>

      <div className="admin-reports-generate-classification-date-container d-flex align-items-center">
        <div className="admin-reports-classification-container">
          <select
            value={activeTable}
            onChange={(e) => setActiveTable(e.target.value)}
            className="admin-reports-classification rounded"
          >
            <option value="users">Users</option>
            <option value="equipment">Equipment Reservations</option>
            <option value="schedules">Schedules</option>
            <option value="inventory">Inventory</option>
          </select>
        </div>

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

        {/* Admin Name and Date Input Fields */}
        <div className="admin-reports-info-container d-flex align-items-center">
          {/* Show admin username */}
          {adminUsername && (
            <span className="text-white me-3">
              {adminUsername} {/* Display admin's username */}
            </span>
          )}
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
        {activeTable === "users" && (
          <div className="admin-reports-users-table">
            <h2 className="reports-users-label-h2">Users</h2>
            <table className="admin-reports-users-table-container table-bordered">
              <thead className="admin-reports-users-head text-center">
                <tr>
                  <th>Date</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Youth Classification</th>{" "}
                  {/* Added Youth Classification column */}
                  <th>Username</th>
                  <th>Email Address</th>
                </tr>
              </thead>

              <tbody className="admin-reports-users-body text-center">
                {Object.entries(groupedUsers).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
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
                        {" "}
                        {/* Youth Classification */}
                        {users.map((user) => (
                          <div key={user.id}>
                            {user.youth_age_group || "N/A"}
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
          <div>
            <h2>Equipment Reservations</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Equipment Name</th>
                  <th>Reserved By</th>
                </tr>
              </thead>
              <tbody>
                {equipmentReservations.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.equipment_name}</td>
                    <td>{item.reserved_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
