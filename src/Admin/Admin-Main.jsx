
/*import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import './styles/adminmain.css'; // Import updated CSS for flexible layout
import { Bar, Pie, Line } from 'react-chartjs-2'; // Import Line chart library
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Import ArcElement for Pie chart
    PointElement, // Import PointElement for Line chart
    LineElement, // Import LineElement for Line chart
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Register ArcElement for Pie chart
    PointElement, // Register PointElement for Line chart
    LineElement // Register LineElement for Line chart
);

const AdminMain = () => {
    const { isAdmin } = useContext(AuthContext);
    
    // Local state to store fetched data
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalSchedules: 0,
        totalEquipment: 0, // Add equipment data
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // To handle errors during data fetching

    // Fetch dashboard data from backend
    useEffect(() => {
        if (isAdmin) {
            fetch('http://localhost:5000/admindashboard') // Ensure this matches your backend endpoint
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    setDashboardData({
                        totalUsers: data.total_users,
                        totalSchedules: data.total_schedules,
                        totalEquipment: data.total_equipment, // Store total equipment
                    });
                    setLoading(false); // Stop loading after data is fetched
                })
                .catch((error) => {
                    console.error('Error fetching dashboard data:', error);
                    setError('Error fetching data. Please try again later.');
                    setLoading(false); // Stop loading in case of error
                });
        }
    }, [isAdmin]);

    // Fallback data for charts while loading or in case of no data
    const emptyData = {
        labels: ['No Data'],
        datasets: [
            {
                label: 'No Data',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [0],
            },
        ],
    };

    // If not an admin, display access denied message
    if (!isAdmin) {
        return <div>Access Denied. You must be an admin to view this page.</div>;
    }

    // If data is still loading, show a loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there was an error, display error message
    if (error) {
        return <div>{error}</div>;
    }

    // Chart Data for User Registrations
    const barChartData = {
        labels: ['User Registrations'],
        datasets: [
            {
                label: 'User Registrations',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [dashboardData.totalUsers], // Use actual data
            },
        ],
    };

    // Pie Chart Data for Total Reservations
    const pieChartData = {
        labels: ['Total Reservations'],
        datasets: [
            {
                label: 'Total Reservations',
                data: [dashboardData.totalSchedules], // Just show the total schedule
                backgroundColor: ['rgba(75, 192, 192, 0.6)'], // Only one segment
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    // Line Chart Data for Equipment
    const lineChartData = {
        labels: ['Equipment'], // Add a simple label for demonstration
        datasets: [
            {
                label: 'Total Equipment',
                data: [dashboardData.totalEquipment], // Use actual data
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
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

                        <section className="charts-section">
                            <div className="chart-container">
                                <h2>User Registrations</h2>
                                <Bar data={barChartData} options={{ responsive: true }} />
                            </div>

                            <div className="chart-container">
                                <h2>Total Reservations</h2>
                                <Pie data={pieChartData} options={{ responsive: true }} />
                            </div>

                            <div className="chart-container">
                                <h2>Total Equipment</h2>
                                <Line data={lineChartData} options={{ responsive: true }} />
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
                                        <td>{dashboardData.totalSchedules}</td>
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

export default AdminMain;*/

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import './styles/adminmain.css'; // Import updated CSS for flexible layout
import { Bar, Pie, Line } from 'react-chartjs-2'; // Import Line chart library
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Import ArcElement for Pie chart
    PointElement, // Import PointElement for Line chart
    LineElement, // Import LineElement for Line chart
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Register ArcElement for Pie chart
    PointElement, // Register PointElement for Line chart
    LineElement // Register LineElement for Line chart
);

const AdminMain = () => {
    const { isAdmin } = useContext(AuthContext);
    
    // Local state to store fetched data
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalReservations: 0, // Total reservations from schedules
        totalEquipment: 0, // Total equipment from equipment table
        totalReservedQuantity: 0, // Total reserved equipment quantity
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data from backend
    useEffect(() => {
        if (isAdmin) {
            fetch('http://localhost:5000/admindashboard')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    setDashboardData({
                        totalUsers: data.total_users,
                        totalReservations: data.total_reservations, // Set total reservations from schedules
                        totalEquipment: data.total_equipment, // Set total equipment from the equipment table
                        totalReservedQuantity: data.total_reserved_quantity, // Set reserved quantity
                    });
                    setLoading(false); // Stop loading after data is fetched
                })
                .catch((error) => {
                    console.error('Error fetching dashboard data:', error);
                    setError('Error fetching data. Please try again later.');
                    setLoading(false); // Stop loading in case of error
                });
        }
    }, [isAdmin]);

    // Fallback data for charts while loading or in case of no data
    const emptyData = {
        labels: ['No Data'],
        datasets: [
            {
                label: 'No Data',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [0],
            },
        ],
    };

    // If not an admin, display access denied message
    if (!isAdmin) {
        return <div>Access Denied. You must be an admin to view this page.</div>;
    }

    // If data is still loading, show a loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there was an error, display error message
    if (error) {
        return <div>{error}</div>;
    }

    // Chart Data for Total Reservations
    const reservationsChartData = {
        labels: ['Total Reservations'],
        datasets: [
            {
                label: 'Total Reservations',
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                data: [dashboardData.totalReservations],  // Use actual data for reservations
            },
        ],
    };

    // Chart Data for Total Equipment
    const equipmentChartData = {
        labels: ['Total Equipment'],
        datasets: [
            {
                label: 'Total Equipment',
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                data: [dashboardData.totalEquipment],  // Use actual data for equipment
            },
        ],
    };

    // Chart Data for Total Reserved Equipment Quantity
    const reservedEquipmentChartData = {
        labels: ['Total Reserved Equipment'],
        datasets: [
            {
                label: 'Total Reserved Equipment Quantity',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [dashboardData.totalReservedQuantity],  // Use actual data for reserved equipment quantity
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
