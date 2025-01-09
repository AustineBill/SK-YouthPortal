/*import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
// import './styles/adminmain.css';
import './styles/Admin-Main.css';
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
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-header-labels">
                <h2 className='admin-dashboard-label-h2 fst-italic'>Analytics Dashboard</h2>
                <p className="admin-dashboard-label-p">Overview of the admin analytics.</p>
            </div>

            <div className="admin-dashboard-filters-container d-flex flex-column">
                <div className="month-dropdown d-flex align-items-center">
                    <label className='month-dropdown-label' htmlFor="month">Select Month:</label>
                    <select
                        id="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className='month-classification rounded'
                    >
                        {months.map((month, index) => (
                            <option key={index} value={index + 1}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="year-dropdown d-flex align-items-center">
                    <label className='year-dropdown-label' htmlFor="year">Select Year:</label>
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className='year-classification rounded'
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

            <section className="admin-dashboard-charts-section">
                <div className='reservations-users-container d-flex justify-content-around'>
                    <div className="reservations-chart-container">
                        <h2 className='reservations-label-h2'>Total Reservations</h2>
                        <Bar data={reservationsChartData} options={{ responsive: true }} />
                    </div>

                    <div className="users-chart-container">
                        <h2 className='users-label-h2'>Total Users</h2>
                        <Pie data={usersPieChartData} options={{ responsive: true }} />
                    </div>
                </div>

                <div className="equipment-chart-container">
                    <h2 className='equipment-label-h2'>Total Equipment</h2>
                    <Line data={equipmentLineChartData} options={{ responsive: true }} />
                </div>
            </section>

            <section className="dashboard-summary-table-container">
                <div className='admin-dashboard-sm-label-container'>
                    <h2 className='sm-label-h2'>Summary Table</h2>
                </div>

                <table className="dashboard-summary-table table-bordered">
                    <thead className='admin-summary-table-head text-center'>
                        <tr>
                            <th>Description</th>
                            <th>Value</th>
                        </tr>
                    </thead>

                    <tbody className='admin-summary-table-body text-center'>
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
    );
};

export default AdminMain;
*/

/*import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import './styles/Admin-Main.css';
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
    const [selectedYear, setSelectedYear] = useState(2025); // Default to 2025
    const [isFutureYearSelected, setIsFutureYearSelected] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            fetchDashboardData();
        }
    }, [isAdmin, selectedYear]);

    const fetchDashboardData = () => {
        setLoading(true);
        fetch(`http://localhost:5000/admindashboard?year=${selectedYear}`)
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => {
                // Set the data for the year selected
                if (selectedYear > 2025) {
                    setDashboardData({
                        totalUsers: 0, // Reset for future years
                        totalReservations: 0,
                        totalEquipment: 0,
                    });
                } else {
                    setDashboardData({
                        totalUsers: data.total_users,
                        totalReservations: data.total_reservations,
                        totalEquipment: data.total_equipment,
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
                setError(error.message || 'Error fetching data. Please try again later.');
                setLoading(false);
            });
    };

    const handleYearChange = (event) => {
        const year = parseInt(event.target.value);
        setSelectedYear(year);

        if (year > 2025) {
            setIsFutureYearSelected(true);
            // Reset data for future years
            setDashboardData({
                totalUsers: 0, // No data for future years
                totalReservations: 0,
                totalEquipment: 0,
            });
        } else {
            setIsFutureYearSelected(false);
            fetchDashboardData();
        }
    };

    const currentMonth = new Date().getMonth(); // Gets the current month (0 for January, 11 for December)

    // Total Reservations Chart Data
    const reservationsChartData = {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Total Reservations',
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                data: Array(12).fill(0).map((_, index) => (index === currentMonth ? dashboardData.totalReservations : 0)),
            },
        ],
    };

    // Total Users Pie Chart Data
    const usersPieChartData = {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Total Users',
                data: Array(12).fill(0).map((_, index) => (index === currentMonth ? dashboardData.totalUsers : 0)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',  // Red
                    'rgba(54, 162, 235, 0.6)',  // Blue
                    'rgba(255, 206, 86, 0.6)',  // Yellow
                    'rgba(75, 192, 192, 0.6)',  // Green
                    'rgba(153, 102, 255, 0.6)', // Purple
                    'rgba(255, 159, 64, 0.6)',  // Orange
                    'rgba(255, 99, 71, 0.6)',   // Tomato
                    'rgba(0, 255, 255, 0.6)',   // Cyan
                    'rgba(255, 20, 147, 0.6)',  // Deep Pink
                    'rgba(0, 128, 0, 0.6)',     // Green
                    'rgba(255, 165, 0, 0.6)',   // Orange
                    'rgba(138, 43, 226, 0.6)'   // Blue Violet
                ],
                borderColor: Array(12).fill('rgba(75, 192, 192, 1)'),
                borderWidth: 1,
            },
        ],
    };

    // Total Equipment Line Chart Data
    const equipmentLineChartData = {
        labels: ['Total Equipment'],
        datasets: [
            {
                label: 'Total Equipment',
                data: [dashboardData.totalEquipment],
                borderColor: 'rgb(255, 255, 255)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    // Chart Options
    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Total Reservations Per Month',
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            filler: {
                propagate: false,
            },
            title: {
                display: true,
                text: 'Total Equipment Line Chart',
            },
        },
        interaction: {
            intersect: false,
        },
        elements: {
            line: {
                tension: 0.4,
            },
        },
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

    const currentYear = new Date().getFullYear();

    // Generate Year Options (2025 to 2078)
    const yearOptions = [];
    for (let i = 2025; i <= 2078; i++) {
        yearOptions.push(i);
    }

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-header-labels">
                <h2 className='admin-dashboard-label-h2 fst-italic'>Analytics Dashboard</h2>
                <p className="admin-dashboard-label-p">Overview of the admin analytics.</p>
            </div>

    
            <div className="year-dropdown-container">
                <label htmlFor="year-select">Select Year:</label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{
                        filter: isFutureYearSelected ? 'grayscale(100%)' : 'none',
                        cursor: isFutureYearSelected ? 'not-allowed' : 'pointer',
                    }}
                >
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <section className="admin-dashboard-charts-section">
                <div className="reservations-users-container d-flex flex-wrap justify-content-between gap-4">
          
                    <div className="reservations-chart-container chart-container">
                        <h2 className="reservations-label-h2 text-center">Total Reservations Per Month</h2>
                        <Bar 
                            data={reservationsChartData} 
                            options={barChartOptions} 
                            width={300} 
                            height={250} 
                        />
                    </div>

                 
                    <div className="users-chart-container chart-container">
                        <h2 className="users-label-h2 text-center">Total Users</h2>
                        <Pie 
                            data={usersPieChartData} 
                            options={{ responsive: true, maintainAspectRatio: true }} 
                            width={300} 
                            height={250} 
                        />
                    </div>
                </div>

               
                <div className="equipment-chart-container chart-container">
                    <h2 className="equipment-label-h2 text-center">Total Equipment</h2>
                    <Line 
                        data={equipmentLineChartData} 
                        options={lineChartOptions} 
                        width={600} 
                        height={300} 
                    />
                </div>
            </section>

            <section className="dashboard-summary-table-container">
                <div className='admin-dashboard-sm-label-container'>
                    <h2 className='sm-label-h2'>Summary Table</h2>
                </div>

                <table className="dashboard-summary-table table-bordered">
                    <thead className='admin-summary-table-head text-center'>
                        <tr>
                            <th>Description</th>
                            <th>Value</th>
                        </tr>
                    </thead>

                    <tbody className='admin-summary-table-body text-center'>
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
    );
};

export default AdminMain;*/

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import './styles/Admin-Main.css';
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
    const [selectedYear, setSelectedYear] = useState(2025); // Default to 2025
    const [isFutureYearSelected, setIsFutureYearSelected] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            fetchDashboardData();
        }
    }, [isAdmin, selectedYear]);

    const fetchDashboardData = () => {
        setLoading(true);
        fetch(`http://localhost:5000/admindashboard?year=${selectedYear}`)
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => {
                // Set the data for the year selected
                if (selectedYear > 2025) {
                    setDashboardData({
                        totalUsers: 0, // Reset for future years
                        totalReservations: 0,
                        totalEquipment: 0,
                    });
                } else {
                    setDashboardData({
                        totalUsers: data.total_users,
                        totalReservations: data.total_reservations,
                        totalEquipment: data.total_equipment,
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
                setError(error.message || 'Error fetching data. Please try again later.');
                setLoading(false);
            });
    };

    const handleYearChange = (event) => {
        const year = parseInt(event.target.value);
        setSelectedYear(year);

        if (year > 2025) {
            setIsFutureYearSelected(true);
            // Reset data for future years
            setDashboardData({
                totalUsers: 0, // No data for future years
                totalReservations: 0,
                totalEquipment: 0,
            });
        } else {
            setIsFutureYearSelected(false);
            fetchDashboardData();
        }
    };

    const currentMonth = new Date().getMonth(); // Gets the current month (0 for January, 11 for December)

    // Total Reservations Chart Data
    const reservationsChartData = {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Total Reservations',
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                data: Array(12).fill(0).map((_, index) => (index === currentMonth ? dashboardData.totalReservations : 0)),
            },
        ],
    };

    // Total Users Pie Chart Data
    const usersPieChartData = {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Total Users',
                data: Array(12).fill(0).map((_, index) => (index === currentMonth ? dashboardData.totalUsers : 0)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',  // Red
                    'rgba(54, 162, 235, 0.6)',  // Blue
                    'rgba(255, 206, 86, 0.6)',  // Yellow
                    'rgba(75, 192, 192, 0.6)',  // Green
                    'rgba(153, 102, 255, 0.6)', // Purple
                    'rgba(255, 159, 64, 0.6)',  // Orange
                    'rgba(255, 99, 71, 0.6)',   // Tomato
                    'rgba(0, 255, 255, 0.6)',   // Cyan
                    'rgba(255, 20, 147, 0.6)',  // Deep Pink
                    'rgba(0, 128, 0, 0.6)',     // Green
                    'rgba(255, 165, 0, 0.6)',   // Orange
                    'rgba(138, 43, 226, 0.6)'   // Blue Violet
                ],
                borderColor: Array(12).fill('rgba(75, 192, 192, 1)'),
                borderWidth: 1,
            },
        ],
    };

    // Total Equipment Line Chart Data
    const equipmentLineChartData = {
        labels: ['Total Equipment'],
        datasets: [
            {
                label: 'Total Equipment',
                data: [dashboardData.totalEquipment],
                borderColor: 'rgb(255, 255, 255)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    // Chart Options
    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Total Reservations Per Month',
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            filler: {
                propagate: false,
            },
            title: {
                display: true,
                text: 'Total Equipment Line Chart',
            },
        },
        interaction: {
            intersect: false,
        },
        elements: {
            line: {
                tension: 0.4,
            },
        },
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

    const currentYear = new Date().getFullYear();

    // Generate Year Options (2025 to 2078)
    const yearOptions = [];
    for (let i = 2025; i <= 2078; i++) {
        yearOptions.push(i);
    }

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-header-labels">
                <h2 className='admin-dashboard-label-h2 fst-italic'>Analytics Dashboard</h2>
                <p className="admin-dashboard-label-p">Overview of the admin analytics.</p>
            </div>

    
            <div className="year-dropdown-container">
                <label htmlFor="year-select">Select Year:</label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{
                        filter: isFutureYearSelected ? 'grayscale(100%)' : 'none',
                        cursor: isFutureYearSelected ? 'not-allowed' : 'pointer',
                    }}
                >
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <section className="admin-dashboard-charts-section">
                <div className="reservations-users-container d-flex flex-wrap justify-content-between gap-4">
          
                    <div className="reservations-chart-container chart-container">
                        <h2 className="reservations-label-h2 text-center">Total Reservations Per Month</h2>
                        <Bar 
                            data={reservationsChartData} 
                            options={barChartOptions} 
                            width={300} 
                            height={250} 
                        />
                    </div>

                 
                    <div className="users-chart-container chart-container">
                        <h2 className="users-label-h2 text-center">Total Users</h2>
                        <Pie 
                            data={usersPieChartData} 
                            options={{ responsive: true, maintainAspectRatio: true }} 
                            width={300} 
                            height={250} 
                        />
                    </div>
                </div>

               
                <div className="equipment-chart-container chart-container">
                    <h2 className="equipment-label-h2 text-center">Total Equipment</h2>
                    <Line 
                        data={equipmentLineChartData} 
                        options={lineChartOptions} 
                        width={600} 
                        height={300} 
                    />
                </div>
            </section>

            <section className="dashboard-summary-table-container">
                <div className='admin-dashboard-sm-label-container'>
                    <h2 className='sm-label-h2'>Summary Table</h2>
                </div>

                <table className="dashboard-summary-table table-bordered">
                    <thead className='admin-summary-table-head text-center'>
                        <tr>
                            <th>Description</th>
                            <th>Value</th>
                        </tr>
                    </thead>

                    <tbody className='admin-summary-table-body text-center'>
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
    );
};

export default AdminMain;

