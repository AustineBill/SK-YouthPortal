import { useState } from 'react';
import AdminSidebar from './AdminSidebar'; // Adjust the path as necessary
import './styles/adminreports.css'; // New CSS file for AdminReports styling

const Reports = () => {
    const [activeContent, setActiveContent] = useState('reports');
    const [reports, setReports] = useState([]); // Empty initial state for reports

    const handleDelete = (reportId) => {
        setReports(reports.filter((report) => report.id !== reportId));
    };

    return (
        <div className="admin-reports-container">
            <AdminSidebar /> {/* Sidebar */}
            <div className="main-content">
                <div className="container">
                    <div className="text-center text-lg-start mt-4">
                        <h1 className="Maintext animated slideInRight">Admin Reports</h1>
                        <p className="Subtext">View and manage all reports</p>
                    </div>

                    <ul className="nav">
                        <li onClick={() => setActiveContent('reports')} className={activeContent === 'reports' ? 'active' : ''}>
                            Reports
                        </li>
                        <li onClick={() => setActiveContent('generateReport')} className={activeContent === 'generateReport' ? 'active' : ''}>
                            Generate Report
                        </li>
                    </ul>

                    <div className="component-contents">
                        {activeContent === 'reports' && (
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered mt-4">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Program</th>
                                            <th>User ID</th>
                                            <th>Time</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">No reports available</td>
                                            </tr>
                                        ) : (
                                            reports.map((report) => (
                                                <tr key={report.id}>
                                                    <td>{report.date}</td>
                                                    <td>{report.program}</td>
                                                    <td>{report.userId}</td>
                                                    <td>{report.time}</td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={() => handleDelete(report.id)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeContent === 'generateReport' && (
                            <div>
                                <h3>Generate New Report</h3>
                                <form>
                                    <input type="text" placeholder="Program Name" className="form-control mb-2" />
                                    <input type="date" className="form-control mb-2" />
                                    <input type="text" placeholder="User ID" className="form-control mb-2" />
                                    <input type="time" className="form-control mb-2" />
                                    <button type="submit" className="btn btn-primary">Generate</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
