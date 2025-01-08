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
  const [schedules, setSchedules] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [adminName, setAdminName] = useState(""); // State for admin's name
  const [adminDate, setAdminDate] = useState(""); // State for the current date

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
        } else if (activeTable === "schedules") {
          url = "http://localhost:5000/schedule-reports";
          const response = await axios.get(url);
          setSchedules(response.data);
        } else if (activeTable === "inventory") {
          url = "http://localhost:5000/inventory-reports";
          const response = await axios.get(url);
          setInventory(response.data);
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
  const groupedSchedules = groupDataByDate(schedules);
  const groupedInventory = groupDataByDate(inventory);

  // Generate PDF
  const generatePDF = () => {
    const input = document.getElementById("admin-reports-tables-container");
    const backgroundImage = `${process.env.PUBLIC_URL}/Asset/WebImages/NEW SK LETTER LEGAL SIZE.png`;
  
    html2canvas(input, {
      useCORS: true,
      backgroundColor: "transparent",
      scale: 3, // Increase scale for better rendering quality
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF({
        orientation: "landscape", // Use landscape for better table fitting
        unit: "mm",
        format: [355.6, 215.9], // Legal paper size in landscape (355.6mm x 215.9mm)
      });
  
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
  
      // Add the background image to the first page
      pdf.addImage(backgroundImage, "PNG", 0, 0, pageWidth, pageHeight);
  
      const margin = 15; // Add margin to prevent content cutoff
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
  
      // Define the signature box position at the lower-right corner
      const signatureBoxX = pageWidth - 65; // X position (right side)
      const signatureBoxY = pageHeight - 30; // Y position (bottom side)
      const signatureBoxHeight = 15; // Height of the signature box
  
      const maxHeightPerPage = pageHeight - margin * 2 - 40; // Adjusted space for table (keeping some space for header/footer)
      let currentYPosition = margin + 50; // Starting position of content (below the header)
  
      // Check if content fits on one page
      let contentRemainingHeight = contentHeight;
  
      // Add content for the first page
      if (contentRemainingHeight <= maxHeightPerPage) {
        pdf.addImage(imgData, "PNG", margin, currentYPosition, contentWidth, contentRemainingHeight);
      } else {
        // If content exceeds one page, split it across multiple pages
        while (contentRemainingHeight > 0) {
          const currentPageHeight = Math.min(contentRemainingHeight, maxHeightPerPage);
  
          // If the content is close to the signature box area, start a new page
          if (currentYPosition + currentPageHeight + signatureBoxHeight >= pageHeight - margin) {
            pdf.addPage(); // Add new page
            pdf.addImage(backgroundImage, "PNG", 0, 0, pageWidth, pageHeight);
            currentYPosition = margin + 50; // Reset Y position for the new page
          }
  
          // Add the current page content (table data)
          pdf.addImage(imgData, "PNG", margin, currentYPosition, contentWidth, currentPageHeight);
  
          // Decrease remaining content height and adjust Y position for the next page
          contentRemainingHeight -= currentPageHeight;
          currentYPosition += currentPageHeight;
        }
      }
  
      // Automatically set the current date
      const currentDate = new Date().toLocaleDateString();
  
      // Add the admin's name and date at the upper-left corner
      pdf.setFontSize(12);
      pdf.text(`Admin: ${adminName}`, margin, margin + 40); // Admin name at the top-left
      pdf.text(`Date: ${currentDate}`, margin, margin + 50); // Date below the admin name
  
      // Add the signature box at the lower-right corner
      pdf.rect(signatureBoxX, signatureBoxY, 50, signatureBoxHeight); // Signature box position
      pdf.text("Signature:", signatureBoxX + 5, signatureBoxY + 10); // Adjusted position for the text
  
      // Save the PDF
      pdf.save(`${activeTable}-report.pdf`);
    });
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
            <option value="schedules">Schedules</option>
            <option value="inventory">Inventory</option>
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

        {/* Admin Name and Date Input Fields */}
        <div className="admin-reports-info-container">
          <input
            type="text"
            placeholder="Enter Admin Name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="admin-reports-input rounded"
          />
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
      <div id="admin-reports-tables-container" className="reports-list-container">
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

        {activeTable === "schedules" && (
          <div className="admin-reports-schedules-table">
            <h2 className="reports-schedules-label-h2">Schedules</h2>
            <table className="admin-reports-schedules-table-container table-bordered">
              <thead className="admin-reports-schedules-head text-center">
                <tr>
                  <th>Date</th>
                  <th>Event Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody className="admin-reports-schedules-body text-center">
                {Object.entries(groupedSchedules).length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No records found
                    </td>
                  </tr>
                ) : (
                  Object.entries(groupedSchedules).map(([date, events]) => (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>
                        {events.map((event) => (
                          <div key={event.id}>{event.name}</div>
                        ))}
                      </td>
                      <td>
                        {events.map((event) => (
                          <div key={event.id}>
                            {new Date(event.start_date).toLocaleString()}
                          </div>
                        ))}
                      </td>
                      <td>
                        {events.map((event) => (
                          <div key={event.id}>
                            {new Date(event.end_date).toLocaleString()}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTable === "inventory" && (
          <div className="admin-reports-inventory-table">
            <h2 className="reports-inventory-label-h2">Inventory</h2>
            <table className="admin-reports-inventory-table-container table-bordered">
              <thead className="admin-reports-inventory-head text-center">
                <tr>
                  <th>Date</th>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="admin-reports-inventory-body text-center">
                {Object.entries(groupedInventory).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No records found
                    </td>
                  </tr>
                ) : (
                  Object.entries(groupedInventory).map(([date, items]) => (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>
                        {items.map((item) => (
                          <div key={item.id}>{item.id}</div>
                        ))}
                      </td>
                      <td>
                        {items.map((item) => (
                          <div key={item.id}>{item.name}</div>
                        ))}
                      </td>
                      <td>
                        {items.map((item) => (
                          <div key={item.id}>{item.quantity}</div>
                        ))}
                      </td>
                      <td>
                        {items.map((item) => (
                          <div key={item.id}>{item.status}</div>
                        ))}
                      </td>
                    </tr>
                  ))
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
