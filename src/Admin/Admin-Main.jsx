import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import './styles/adminmain.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminMain = () => {
    const { isAdmin } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalReservations: 0,
        totalEquipment: 0,
        totalReservedQuantity: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAdmin) {
            fetch('http://localhost:5000/admindashboard')
                .then((response) => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then((data) => {
                    setDashboardData({
                        totalUsers: data.total_users,
                        totalReservations: data.total_reservations,
                        totalEquipment: data.total_equipment,
                        totalReservedQuantity: data.total_reserved_quantity,
                    });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching dashboard data:', error);
                    setError('Error fetching data. Please try again later.');
                    setLoading(false);
                });
        }
    }, [isAdmin]);

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

    const equipmentChartData = {
        labels: ['Total Equipment'],
        datasets: [
            {
                label: 'Total Equipment',
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                data: [dashboardData.totalEquipment],
            },
        ],
    };

    const reservedEquipmentChartData = {
        labels: ['Total Reserved Equipment'],
        datasets: [
            {
                label: 'Total Reserved Equipment Quantity',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [dashboardData.totalReservedQuantity],
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
                        <section className="charts-section">
                            <div className="chart-container">
                                <h2>Total Reservations</h2>
                                <Bar data={reservationsChartData} options={{ responsive: true }} />
                            </div>
                            <div className="chart-container">
                                <h2>Total Equipment</h2>
                                <Bar data={equipmentChartData} options={{ responsive: true }} />
                            </div>
                            <div className="chart-container">
                                <h2>Total Reserved Equipment Quantity</h2>
                                <Bar data={reservedEquipmentChartData} options={{ responsive: true }} />
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
                                    <tr>
                                        <td>Total Reserved Equipment Quantity</td>
                                        <td>{dashboardData.totalReservedQuantity}</td>
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