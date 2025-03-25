/*import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../WebStructure/AuthContext";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import '../WebStyles/Admin-CSS.css';

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminMain = () => {
  const { isAdmin } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalReservations: 0,
    totalEquipment: 0,
    monthlyReservations: new Array(12).fill(0),
    monthlyEquipmentReservations: new Array(12).fill(0),
    yearlyRatings: new Array(5).fill(0),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);

  const currentYear = new Date().getFullYear(); // Get current year dynamically

  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    fetch(
      `https://isked-backend-ssmj.onrender.com/admindashboard?year=${selectedYear}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setDashboardData({
          totalUsers: data.total_users,
          totalReservations: data.total_reservations,
          totalEquipment: data.total_equipment,
          activeUsers: data.active_users,
          inactiveUsers: data.inactive_users,
          monthlyReservations:
            data.monthly_reservations || new Array(12).fill(0),
          monthlyEquipmentReservations:
            data.monthly_equipment_reservations || new Array(12).fill(0),
          yearlyRatings: data.yearly_ratings || new Array(5).fill(0),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setError(
          error.message || "Error fetching data. Please try again later."
        );
        setLoading(false);
      });
  }, [selectedYear]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin, selectedYear, fetchDashboardData]);

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  // Create an array of years from the current year to the max year (e.g., 2078)
  const years = [];
  for (let year = currentYear; year <= 2078; year++) {
    years.push(year);
  }

  // Donut Chart for Total Users Distribution
  const donutChartData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [dashboardData.activeUsers, dashboardData.inactiveUsers],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart for Monthly Reservations
  const reservationChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Reservations",
        data: dashboardData.monthlyReservations,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart for Monthly Equipment Reservations
  const equipmentChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Equipment Reservations",
        data: dashboardData.monthlyEquipmentReservations,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Yearly Ratings Chart Data
  const ratingsChartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Yearly Ratings Distribution",
        data: dashboardData.yearlyRatings,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (!isAdmin) {
    return <div>Access Denied. You must be an admin to view this page.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header-labels">
        <h2 className="admin-dashboard-label-h2 fst-italic">
          Analytics Dashboard
        </h2>
        <p className="admin-dashboard-label-p">
          Overview of the admin analytics.
        </p>
      </div>

      <div className="year-dropdown-container d-flex align-items-center">
        <div className="year-selection-container d-flex align-items-center">
          <label className="year-selection-label m-0" htmlFor="year-select">
            Select Year:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className="year-select rounded"
          >
            {years.map((year) => (
              <option
                key={year}
                value={year}
                disabled={year > currentYear} // Disable future years
                style={{
                  color: year > currentYear ? "gray" : "black",
                  cursor: year > currentYear ? "not-allowed" : "pointer",
                }}
              >
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="admin-dashboard-charts-section">
        <div className="admin-dashboard-charts-container d-flex align-items-center justify-content-center text-center">
          {/* Donut Chart }
          <div className="admin-chart-container">
            <h2 className="userd-label-h2">User Distribution</h2>
            <Doughnut data={donutChartData} className="piechart" />
          </div>

          {/* Reservation Graph }
          <div className="admin-chart-container">
            <h2 className="reservations-label-h2">Reservation Graph</h2>
            <Bar data={reservationChartData} className="chart" />
          </div>

          {/* Equipment Reservation Graph }
          <div className="admin-chart-container">
            <h2 className="equipment-label-h2">Equipment Reservation Graph</h2>
            <Bar data={equipmentChartData} className="chart" />
          </div>

          {/* Yearly Ratings Graph }
          <div className="admin-chart-container">
            <h2 className="yearlyrd-label-h2">Yearly Ratings Distribution</h2>
            <Bar
              data={ratingsChartData}
              options={{ indexAxis: "y" }}
              className="chart"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminMain; */

import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { AuthContext } from "../WebStructure/AuthContext";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import '../WebStyles/Admin-CSS.css';

// Import your background image (replace with your actual image path)
import backgroundImage from '../Asset/WebImages/ampochi.jpg'
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminMain = () => {
  const { isAdmin } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalReservations: 0,
    totalEquipment: 0,
    monthlyReservations: new Array(12).fill(0),
    monthlyEquipmentReservations: new Array(12).fill(0),
    yearlyRatings: new Array(5).fill(0),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dashboardRef = useRef(null);
  const pdfExportButtonRef = useRef(null);
  const yearSelectRef = useRef(null);
  const chartRefs = useRef([]);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    chartRefs.current = chartRefs.current.slice(0, 4);
  }, []);

  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    fetch(
      `https://isked-backend-ssmj.onrender.com/admindashboard?year=${selectedYear}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setDashboardData({
          totalUsers: data.total_users,
          totalReservations: data.total_reservations,
          totalEquipment: data.total_equipment,
          activeUsers: data.active_users,
          inactiveUsers: data.inactive_users,
          monthlyReservations:
            data.monthly_reservations || new Array(12).fill(0),
          monthlyEquipmentReservations:
            data.monthly_equipment_reservations || new Array(12).fill(0),
          yearlyRatings: data.yearly_ratings || new Array(5).fill(0),
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setError(
          error.message || "Error fetching data. Please try again later."
        );
        setLoading(false);
      });
  }, [selectedYear]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin, selectedYear, fetchDashboardData]);

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  // Donut Chart for Total Users Distribution
  const donutChartData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [dashboardData.activeUsers, dashboardData.inactiveUsers],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart for Monthly Reservations
  const reservationChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Monthly Reservations",
        data: dashboardData.monthlyReservations,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart for Monthly Equipment Reservations
  const equipmentChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Monthly Equipment Reservations",
        data: dashboardData.monthlyEquipmentReservations,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Yearly Ratings Chart Data
  const ratingsChartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Yearly Ratings Distribution",
        data: dashboardData.yearlyRatings,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleExportToPDF = async () => {
    const input = dashboardRef.current;
    const adminUsername = sessionStorage.getItem("username") || "Admin";
    
    // Hide elements that shouldn't appear in the PDF
    const header = input.querySelector('.admin-dashboard-header-labels');
    const button = pdfExportButtonRef.current;
    const yearSelectContainer = input.querySelector('.year-selection-container');
    
    if (header) header.style.display = 'none';
    if (button) button.style.display = 'none';
    if (yearSelectContainer) yearSelectContainer.style.display = 'none';

    // Create a temporary div for PDF content
    const pdfContent = document.createElement('div');
    pdfContent.style.position = 'relative';
    pdfContent.style.padding = '20px';
    pdfContent.style.width = '100%';
    pdfContent.style.minHeight = '100vh';
    
    // Add background image
    const bgImg = document.createElement('img');
    bgImg.src = backgroundImage;
    bgImg.style.position = 'absolute';
    bgImg.style.top = '0';
    bgImg.style.left = '0';
    bgImg.style.width = '100%';
    bgImg.style.height = '100%';
    bgImg.style.objectFit = 'cover';
    bgImg.style.opacity = '0.1'; // Adjust opacity as needed
    bgImg.style.zIndex = '-1';
    pdfContent.appendChild(bgImg);

    // Add content container
    const contentContainer = document.createElement('div');
    contentContainer.style.position = 'relative';
    contentContainer.style.zIndex = '1';
    
    // Add title and year
    const title = document.createElement('h1');
    title.textContent = `Admin Dashboard Report`;
    title.style.textAlign = "center";
    title.style.marginBottom = "10px";
    title.style.fontSize = "24px";
    title.style.color = "#333";
    contentContainer.appendChild(title);
    
    const yearText = document.createElement('h2');
    yearText.textContent = `Year: ${selectedYear}`;
    yearText.style.textAlign = "center";
    yearText.style.marginBottom = "20px";
    yearText.style.fontSize = "20px";
    yearText.style.color = "#555";
    contentContainer.appendChild(yearText);

    // Clone the charts container
    const chartsContainer = input.querySelector('.admin-dashboard-charts-container');
    if (chartsContainer) {
      contentContainer.appendChild(chartsContainer.cloneNode(true));
    }

    // Add footer space
    const footerSpace = document.createElement('div');
    footerSpace.style.height = '50px';
    contentContainer.appendChild(footerSpace);

    pdfContent.appendChild(contentContainer);
    document.body.appendChild(pdfContent);

    try {
      const canvas = await html2canvas(pdfContent, {
        useCORS: true,
        scale: 2,
        logging: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(
        (pageWidth - 20) / imgWidth,
        (pageHeight - 50) / imgHeight
      );
      const pdfWidth = imgWidth * ratio;
      const pdfHeight = imgHeight * ratio;
      const marginX = (pageWidth - pdfWidth) / 2;
      const marginY = 10;

      pdf.addImage(imgData, "PNG", marginX, marginY, pdfWidth, pdfHeight);

      // Add footer
      const currentDate = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0); // Black text for footer
      
      pdf.text(`Generated by: ${adminUsername}`, 15, pageHeight - 20);
      pdf.text(`Date: ${currentDate}`, 15, pageHeight - 15);
      
      pdf.text("Signature:", pageWidth - 60, pageHeight - 20);
      pdf.line(pageWidth - 60, pageHeight - 18, pageWidth - 15, pageHeight - 18);
      pdf.text("Printed Name", pageWidth - 55, pageHeight - 12);

      pdf.save(`Admin-Dashboard-Report-${selectedYear}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Clean up
      document.body.removeChild(pdfContent);
      if (header) header.style.display = '';
      if (button) button.style.display = '';
      if (yearSelectContainer) yearSelectContainer.style.display = '';
    }
  };

  const copyChartToClipboard = async (chartIndex) => {
    try {
      const canvas = chartRefs.current[chartIndex].canvas;
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      alert('Chart copied to clipboard as PNG!');
    } catch (err) {
      console.error('Failed to copy chart:', err);
      alert('Failed to copy chart. Please try again.');
    }
  };

  const years = [];
  for (let year = currentYear; year <= currentYear + 10; year++) {
    years.push(year);
  }

  if (!isAdmin) {
    return <div>Access Denied. You must be an admin to view this page.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-dashboard-container" ref={dashboardRef}>
      <div className="admin-dashboard-header-labels">
        <h2 className="admin-dashboard-label-h2 fst-italic">
          Analytics Dashboard
        </h2>
        <p className="admin-dashboard-label-p">
          Overview of the admin analytics.
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="year-dropdown-container d-flex align-items-center">
          <div className="year-selection-container d-flex align-items-center" ref={yearSelectRef}>
            <label className="year-selection-label m-0" htmlFor="year-select">
              Select Year:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={handleYearChange}
              className="year-select rounded"
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                  disabled={year > currentYear}
                  style={{
                    color: year > currentYear ? "gray" : "black",
                    cursor: year > currentYear ? "not-allowed" : "pointer",
                  }}
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          ref={pdfExportButtonRef}
          onClick={handleExportToPDF}
          className="btn btn-primary"
        >
          Export to PDF
        </button>
      </div>

      <section className="admin-dashboard-charts-section">
        <div className="admin-dashboard-charts-container d-flex align-items-center justify-content-center text-center">
          {/* Donut Chart */}
          <div className="admin-chart-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="userd-label-h2">User Distribution</h2>
              <button 
                onClick={() => copyChartToClipboard(0)}
                className="btn btn-sm btn-outline-secondary"
                title="Copy chart as image"
              >
                Copy
              </button>
            </div>
            <Doughnut 
              ref={el => chartRefs.current[0] = el} 
              data={donutChartData} 
              className="piechart" 
            />
          </div>

          {/* Reservation Graph */}
          <div className="admin-chart-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="reservations-label-h2">Reservation Graph</h2>
              <button 
                onClick={() => copyChartToClipboard(1)}
                className="btn btn-sm btn-outline-secondary"
                title="Copy chart as image"
              >
                Copy
              </button>
            </div>
            <Bar 
              ref={el => chartRefs.current[1] = el}
              data={reservationChartData} 
              className="chart" 
            />
          </div>

          {/* Equipment Reservation Graph */}
          <div className="admin-chart-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="equipment-label-h2">Equipment Reservation Graph</h2>
              <button 
                onClick={() => copyChartToClipboard(2)}
                className="btn btn-sm btn-outline-secondary"
                title="Copy chart as image"
              >
                Copy
              </button>
            </div>
            <Bar 
              ref={el => chartRefs.current[2] = el}
              data={equipmentChartData} 
              className="chart" 
            />
          </div>

          {/* Yearly Ratings Graph */}
          <div className="admin-chart-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="yearlyrd-label-h2">Yearly Ratings Distribution</h2>
              <button 
                onClick={() => copyChartToClipboard(3)}
                className="btn btn-sm btn-outline-secondary"
                title="Copy chart as image"
              >
                Copy
              </button>
            </div>
            <Bar
              ref={el => chartRefs.current[3] = el}
              data={ratingsChartData}
              options={{ indexAxis: "y" }}
              className="chart"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminMain;