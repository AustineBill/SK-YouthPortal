import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import './styles/adminmain.css';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const AdminMain = () => {
    const { isAdmin } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalReservations: 0,
        totalEquipment: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null); // For invalid selection errors
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

    // Months list for the dropdown
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate years dynamically for dropdown (100 years in the past and 50 years in the future)
    const years = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - 100 + i);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        // Validate selected year and month
        if (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth > currentMonth)) {
            setValidationError('You cannot select a future date.');
            // Display placeholder data for charts
            setDashboardData({
                totalUsers: 0,
                totalReservations: 0,
                totalEquipment: 0,
            });
        } else {
            setValidationError(null);
            if (isAdmin) {
                fetchDashboardData(parseInt(selectedMonth, 10), parseInt(selectedYear, 10));
            }
        }
    }, [isAdmin, selectedMonth, selectedYear]);

    const fetchDashboardData = (month, year) => {
        setLoading(true);
        fetch(`http://localhost:5000/admindashboard?month=${month}&year=${year}`)
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => {
                setDashboardData({
                    totalUsers: data.total_users,
                    totalReservations: data.total_reservations,
                    totalEquipment: data.total_equipment,
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
                setError(error.message || 'Error fetching data. Please try again later.');
                setLoading(false);
            });
    };

    // Chart placeholders for invalid selections
    const placeholderChartData = {
        labels: ['No Data Available'],
        datasets: [
            {
                label: 'No Data',
                backgroundColor: 'rgba(200, 200, 200, 0.6)',
                borderColor: 'rgba(200, 200, 200, 1)',
                data: [0],
            },
        ],
    };

    // Conditionally display the chart data or placeholder data
    const reservationsChartData = validationError
        ? placeholderChartData
        : {
            labels: ['Total Reservations'],
            datasets: [
                {
                    label: 'Total Reservations',
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    data: [dashboardData.totalReservations],
                },
            ],
        };

    const usersPieChartData = validationError
        ? placeholderChartData
        : {
            labels: ['Total Users'],
            datasets: [
                {
                    label: 'Total Users',
                    data: [dashboardData.totalUsers],
                    backgroundColor: ['rgba(75, 192, 192, 0.6)'],
                    borderColor: ['rgba(75, 192, 192, 1)'],
                    borderWidth: 1,
                },
            ],
        };

    const equipmentLineChartData = validationError
        ? placeholderChartData
        : {
            labels: ['Total Equipment'],
            datasets: [
                {
                    label: 'Total Equipment',
                    data: [dashboardData.totalEquipment],
                    fill: false,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    tension: 0.1,
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
        <div className="admin-main-wrapper">
            <div className="admin-main-container">
                <div className="analytics-container">
                    <div className="content-container">
                        <div className="admin-header text-center text-lg-start mt-4">
                            <h1 className="Maintext-Calendar animated slideInRight">Analytics Dashboard</h1>
                            <p className="Subtext-Calendar">Overview of the admin analytics.</p>
                        </div>

                        <div className="filters">
                            <div className="month-dropdown">
                                <label htmlFor="month">Select Month:</label>
                                <select
                                    id="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {months.map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="year-dropdown">
                                <label htmlFor="year">Select Year:</label>
                                <select
                                    id="year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {years.map((year, index) => (
                                        <option key={index} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {validationError && (
                            <div className="validation-error">{validationError}</div>
                        )}

                        <section className="charts-section">
                            <div className="chart-container">
                                <h2>Total Reservations</h2>
                                <Bar data={reservationsChartData} options={{ responsive: true }} />
                            </div>
                            <div className="chart-container">
                                <h2>Total Users</h2>
                                <Pie data={usersPieChartData} options={{ responsive: true }} />
                            </div>
                            <div className="chart-container">
                                <h2>Total Equipment</h2>
                                <Line data={equipmentLineChartData} options={{ responsive: true }} />
                            </div>
                        </section>

                        <section className="summary-table">
                            <h2>Summary Table</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Total Users</td>
                                        <td>{dashboardData.totalUsers}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Reservations</td>
                                        <td>{dashboardData.totalReservations}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Equipment</td>
                                        <td>{dashboardData.totalEquipment}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMain;
