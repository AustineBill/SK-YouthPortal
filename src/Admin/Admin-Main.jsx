import React, { useContext, useEffect, useState, useCallback } from "react";
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
import "./styles/Admin-Main.css";
// import '../WebStyles/Admin-CSS.css';

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
          {/* Donut Chart */}
          <div className="admin-chart-container">
            <h2 className="userd-label-h2">User Distribution</h2>
            <Doughnut data={donutChartData} className="piechart" />
          </div>

          {/* Reservation Graph */}
          <div className="admin-chart-container">
            <h2 className="reservations-label-h2">Reservation Graph</h2>
            <Bar data={reservationChartData} className="chart" />
          </div>

          {/* Equipment Reservation Graph */}
          <div className="admin-chart-container">
            <h2 className="equipment-label-h2">Equipment Reservation Graph</h2>
            <Bar data={equipmentChartData} className="chart" />
          </div>

          {/* Yearly Ratings Graph */}
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

export default AdminMain;
