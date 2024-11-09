import React from 'react';
import './styles/adminmain.css'; // Import updated CSS for flexible layout
// import './styles/Admin-Main.css';
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
    const emptyData = {
        labels: ['No Data'],
        datasets: [
            {
                label: 'User Registrations',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [0],
            },
        ],
    };

    const emptyPieData = {
        labels: ['Active Users', 'Inactive Users'],
        datasets: [
            {
                data: [0, 0],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    return (
        <div className="admin-main-wrapper">
            <div className="admin-main-container">
                {isAdmin ? (
                    <div className="analytics-container">
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
                    <p>No access to analytics.</p> 
                )}
            </div>
        </div>
    );
};

export default AdminMain;
