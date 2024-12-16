import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import './styles/adminmain.css'; // Import updated CSS for flexible layout
import { Bar } from 'react-chartjs-2'; // Import chart libraries
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminMain = () => {
    const { isAdmin } = useContext(AuthContext);
    
    // Local state to store fetched user data
    const [userData, setUserData] = useState({
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // To handle errors during data fetching

    // Fetch user data from backend
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
                    setUserData({
                        totalUsers: data.total_users,
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
                label: 'User Registrations',
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
                data: [userData.totalUsers], // Use actual data
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
                                        <td>{userData.totalUsers}</td>
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
