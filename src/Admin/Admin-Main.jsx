import React from 'react';
import AdminSidebar from './AdminSidebar'; // Adjust the import path if necessary
import './styles/adminmain.css'; // Add styles for the AdminMain component
import { Bar, Pie } from 'react-chartjs-2'; // Import chart libraries
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminMain = ({ isAdmin }) => {
    console.log("isAdmin:", isAdmin); // Check if isAdmin is true

    // Empty data for charts
    const emptyData = {
        labels: ['No Data'],
        datasets: [
            {
                label: 'User Registrations',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [0], // No data yet
            },
        ],
    };

    const emptyPieData = {
        labels: ['Active Users', 'Inactive Users'],
        datasets: [
            {
                data: [0, 0], // No data yet
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    return (
        <div className="admin-main-container">
            {isAdmin ? (
                <div className="analytics-container">
                    <AdminSidebar /> {/* Sidebar rendered based on isAdmin */}
                    <div className="content-container">
                        <div className="admin-header text-center text-lg-start mt-4">
                            <h1 className="Maintext-Calendar animated slideInRight">Analytics Dashboard</h1>
                            <p className="Subtext-Calendar">Overview of the admin analytics.</p>
                        </div>

                        <section className="charts-section">
                            <div className="chart-container">
                                <h2>User Registrations</h2>
                                <Bar data={emptyData} options={{ responsive: true }} />
                            </div>
                            <div className="chart-container">
                                <h2>User Activity</h2>
                                <Pie data={emptyPieData} options={{ responsive: true }} />
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
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>Active Users</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>Inactive Users</td>
                                        <td>0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            ) : (
                <p>No access to sidebar.</p> // Display if isAdmin is false
            )}
        </div>
    );
};

export default AdminMain;
