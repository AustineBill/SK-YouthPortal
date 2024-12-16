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
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month

    // Months list for the dropdown
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        if (isAdmin) {
            fetchDashboardData(selectedMonth);
        }
    }, [isAdmin, selectedMonth]);

    const fetchDashboardData = (month) => {
        setLoading(true);
        fetch(`http://localhost:5000/admindashboard?month=${month}`)
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
                setError('Error fetching data. Please try again later.');
                setLoading(false);
            });
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

    const reservationsChartData = {
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

    const usersPieChartData = {
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

    const equipmentLineChartData = {
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

    return (
        <div className="admin-main-wrapper">
            <div className="admin-main-container">
                <div className="analytics-container">
                    <div className="content-container">
                        <div className="admin-header text-center text-lg-start mt-4">
                            <h1 className="Maintext-Calendar animated slideInRight">Analytics Dashboard</h1>
                            <p className="Subtext-Calendar">Overview of the admin analytics.</p>
                        </div>

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
