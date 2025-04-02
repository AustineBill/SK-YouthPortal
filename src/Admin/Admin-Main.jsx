import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
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
import "../WebStyles/Admin-CSS.css";

// Import your background image (replace with your actual image path)

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
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
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
        backgroundColor: "rgba(54, 162, 235, 0.6)",
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
        backgroundColor: "rgba(255, 159, 64, 0.6)",
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
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const handleExportToPDF = async () => {
    const input = dashboardRef.current;
    const adminUsername = sessionStorage.getItem("username") || "Admin";

    // Hide UI elements
    const elementsToHide = [
      input.querySelector(".admin-dashboard-header-labels"),
      pdfExportButtonRef.current,
      yearSelectRef.current,
      ...input.querySelectorAll(".copy-button"),
    ];

    elementsToHide.forEach((el) => {
      if (el) el.style.display = "none";
    });

    // Create A4 landscape container
    const pdfContent = document.createElement("div");
    pdfContent.style.width = "1123px";
    pdfContent.style.height = "794px";
    pdfContent.style.position = "relative";
    pdfContent.style.overflow = "hidden";

    // Add background image
    const bgImage = document.createElement("img");
    bgImage.src = require("../Asset/WebImages/bgreportsk.png");
    bgImage.style.position = "absolute";
    bgImage.style.top = "0";
    bgImage.style.left = "0";
    bgImage.style.width = "100%";
    bgImage.style.height = "100%";
    pdfContent.appendChild(bgImage);

    // Main content container (perfectly centered)
    const contentContainer = document.createElement("div");
    contentContainer.style.position = "absolute";
    contentContainer.style.top = "48%"; // Optimal center position
    contentContainer.style.left = "50%";
    contentContainer.style.transform = "translate(-50%, -50%)";
    contentContainer.style.width = "90%";

    // Tight 2x2 grid layout
    const chartsContainer = document.createElement("div");
    chartsContainer.style.display = "grid";
    chartsContainer.style.gridTemplateColumns = "1fr 1fr";
    chartsContainer.style.gap = "10px 30px";
    chartsContainer.style.marginBottom = "25px"; // Space before footer

    // Chart pairs configuration
    const chartPairs = [
      {
        left: { title: "User Distribution", ref: chartRefs.current[0] },
        right: { title: "Reservation Graph", ref: chartRefs.current[1] },
      },
      {
        left: {
          title: "Equipment Reservation Graph",
          ref: chartRefs.current[2],
        },
        right: {
          title: "Yearly Ratings Distribution",
          ref: chartRefs.current[3],
        },
      },
    ];

    // Create chart pairs
    chartPairs.forEach((pair) => {
      const pairContainer = document.createElement("div");
      pairContainer.style.display = "flex";
      pairContainer.style.justifyContent = "space-between";

      // Left chart in pair
      if (pair.left.ref) {
        const leftChart = createChartElement(
          pair.left.title,
          pair.left.ref,
          "250px",
          "160px"
        );
        pairContainer.appendChild(leftChart);
      }

      // Right chart in pair
      if (pair.right.ref) {
        const rightChart = createChartElement(
          pair.right.title,
          pair.right.ref,
          "250px",
          "160px"
        );
        pairContainer.appendChild(rightChart);
      }

      chartsContainer.appendChild(pairContainer);
    });

    contentContainer.appendChild(chartsContainer);

    // Footer - perfectly positioned
    const footer = document.createElement("div");
    footer.style.width = "100%";
    footer.style.display = "flex";
    footer.style.justifyContent = "space-between";
    footer.style.fontSize = "14px";
    footer.style.color = "#333";
    footer.style.marginTop = "10px"; // Perfect spacing from charts

    // Left-aligned info
    const infoSection = document.createElement("div");
    infoSection.innerHTML = `
      <div style="margin-bottom: 5px;"><strong>Generated by:</strong> ${adminUsername}</div>
      <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
    `;

    // Right-aligned signature
    const signatureSection = document.createElement("div");
    signatureSection.innerHTML = `
      <div style="margin-bottom: 5px;">Signature: __________________________</div>
      <div>Printed Name</div>
    `;

    footer.appendChild(infoSection);
    footer.appendChild(signatureSection);
    contentContainer.appendChild(footer);
    pdfContent.appendChild(contentContainer);

    document.body.appendChild(pdfContent);

    try {
      await new Promise((resolve) => {
        if (bgImage.complete) resolve();
        bgImage.onload = resolve;
        bgImage.onerror = resolve;
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      pdf.addImage(canvas, "PNG", 0, 0, 297, 210);
      pdf.save(`Admin-Dashboard-Report-${selectedYear}.pdf`);
    } finally {
      document.body.removeChild(pdfContent);
      elementsToHide.forEach((el) => {
        if (el) el.style.display = "";
      });
    }

    // Helper function to create chart elements
    function createChartElement(title, chartRef, width, height) {
      const chartWrapper = document.createElement("div");
      chartWrapper.style.display = "flex";
      chartWrapper.style.flexDirection = "column";
      chartWrapper.style.alignItems = "center";

      // Chart title
      const titleElement = document.createElement("div");
      titleElement.textContent = title;
      titleElement.style.fontSize = "14px";
      titleElement.style.fontWeight = "bold";
      titleElement.style.marginBottom = "5px";
      chartWrapper.appendChild(titleElement);

      // Chart canvas
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 300;
      canvas.style.width = width;
      canvas.style.height = height;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(chartRef.canvas, 0, 0, canvas.width, canvas.height);

      chartWrapper.appendChild(canvas);
      return chartWrapper;
    }
  };
  const copyChartToClipboard = async (chartIndex) => {
    try {
      const chartRef = chartRefs.current[chartIndex];
      if (!chartRef || !chartRef.canvas) return;

      const canvas = chartRef.canvas;

      // Create a temporary canvas with white background
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext("2d");

      // Fill with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original chart
      ctx.drawImage(canvas, 0, 0);

      const blob = await new Promise((resolve) =>
        tempCanvas.toBlob(resolve, "image/png")
      );
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
    } catch (err) {
      console.error("Failed to copy chart:", err);
      alert("Failed to copy chart. Please try again.");
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

      <div className="admin-dashboard-container-2 d-flex justify-content-between align-items-center">
        <div className="year-dropdown-container d-flex align-items-center m-0">
          <div
            className="year-selection-container d-flex align-items-center"
            ref={yearSelectRef}
          >
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

          <div className="export-button-container d-flex align-items-center">
            <button
              ref={pdfExportButtonRef}
              onClick={handleExportToPDF}
              className="admin-dashboard-export-data-button rounded"
            >
              Export to PDF
            </button>
          </div>
        </div>
      </div>

      <section className="admin-dashboard-charts-section">
        <div className="admin-dashboard-charts-container d-flex align-items-center justify-content-center text-center">
          {/* Donut Chart */}
          <div className="admin-chart-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="userd-label-h2">User Distribution</h2>
              <button
                onClick={() => copyChartToClipboard(0)}
                className="copy-chart-button rounded"
                title="Copy chart as image"
              >
                <i className="bi bi-copy"></i>
              </button>
            </div>
            <Doughnut
              ref={(el) => (chartRefs.current[0] = el)}
              data={donutChartData}
              className="piechart"
              options={{
                backgroundColor: "white",
                animation: {
                  onComplete: () => {
                    const chart = chartRefs.current[0];
                    if (chart && chart.canvas) {
                      chart.canvas.style.display = "block";
                    }
                  },
                },
              }}
            />
          </div>

          {/* Reservation Graph */}
          <div className="admin-chart-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="reservations-label-h2">Reservation Graph</h2>
              <button
                onClick={() => copyChartToClipboard(1)}
                className="copy-chart-button rounded"
                title="Copy chart as image"
              >
                <i className="bi bi-copy"></i>
              </button>
            </div>
            <Bar
              ref={(el) => (chartRefs.current[1] = el)}
              data={reservationChartData}
              className="chart"
              options={{
                backgroundColor: "white",
                animation: {
                  onComplete: () => {
                    const chart = chartRefs.current[1];
                    if (chart && chart.canvas) {
                      chart.canvas.style.display = "block";
                    }
                  },
                },
              }}
            />
          </div>

          {/* Equipment Reservation Graph */}
          <div className="admin-chart-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="equipment-label-h2">
                Equipment Reservation Graph
              </h2>
              <button
                onClick={() => copyChartToClipboard(2)}
                className="copy-chart-button rounded"
                title="Copy chart as image"
              >
                <i className="bi bi-copy"></i>
              </button>
            </div>
            <Bar
              ref={(el) => (chartRefs.current[2] = el)}
              data={equipmentChartData}
              className="chart"
              options={{
                backgroundColor: "white",
                animation: {
                  onComplete: () => {
                    const chart = chartRefs.current[2];
                    if (chart && chart.canvas) {
                      chart.canvas.style.display = "block";
                    }
                  },
                },
              }}
            />
          </div>

          {/* Yearly Ratings Graph */}
          <div className="admin-chart-container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="yearlyrd-label-h2">Yearly Ratings Distribution</h2>
              <button
                onClick={() => copyChartToClipboard(3)}
                className="copy-chart-button rounded m-0"
                title="Copy chart as image"
              >
                <i className="bi bi-copy"></i>
              </button>
            </div>
            <Bar
              ref={(el) => (chartRefs.current[3] = el)}
              data={ratingsChartData}
              options={{
                indexAxis: "y",
                backgroundColor: "white",
                animation: {
                  onComplete: () => {
                    const chart = chartRefs.current[3];
                    if (chart && chart.canvas) {
                      chart.canvas.style.display = "block";
                    }
                  },
                },
              }}
              className="chart"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminMain;
