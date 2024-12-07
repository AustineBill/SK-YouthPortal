import { useState } from 'react';
import './styles/adminreports.css'; // New CSS file for AdminReports styling

const Reports = () => {
    const [activeContent, setActiveContent] = useState('reports');
    const [reports, setReports] = useState([]); // Empty initial state for reports

    const handleDelete = (reportId) => {
        setReports(reports.filter((report) => report.id !== reportId));
    };

    return (
        <div className="admin-reports-container">
            <div className='admin-reports-label'>
                <h2 className='admin-reports-label-h2 fst-italic'>Reservation Reports</h2>
            </div>

            {/* Navigation tabs */}
            <ul className="admin-reports-nav-tabs list-unstyled d-flex">
                <li
                    className={activeContent === "reports" ? "active-tab" : ""}
                    onClick={() => setActiveContent("reports")}
                >
                    Reports
                </li>
                <li
                    className={activeContent === "generateReport" ? "active-tab" : ""}
                    onClick={() => setActiveContent("generateReport")}
                >
                    Generate Report
                </li>
            </ul>

            <div className="admin-reports-contents-container d-flex justify-content-center">
                {/* All Reservation Reports Section */}
                {activeContent === 'reports' && (
                    <div className="admin-reservation-reports-details-container d-flex justify-content-center">
                        <table className="admin-reservation-reports-table table-striped table-bordered">
                            <thead className='all-reservation-reports-th text-center'>
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

                {/* Generate Reports Section */}
                {activeContent === 'generateReport' && (
                    <div className="admin-generate-report-container d-flex justify-content-center">
                        {/* <h3>Generate New Report</h3> */}
                        <form className="admin-generate-report-group d-flex flex-column align-items-center">
                            <div className='generate-report-form'>
                                <label className='admin-generate-report-label'>Program Name</label>
                                <input
                                    type="text"
                                    placeholder="Program Name"
                                    className="form-control"
                                />
                            </div>

                            <div className='generate-report-date-time d-flex justify-content-center'>
                                <div className='generate-report-date flex-column'>
                                    <label className='admin-generate-report-label'>Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                    />
                                </div>

                                <div className='generate-report-time flex-column'>
                                    <label className='admin-generate-report-label'>Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className='generate-report-form'>
                                <label className='admin-generate-report-label'>User ID</label>
                                <input
                                    type="text"
                                    placeholder="User ID"
                                    className="form-control"
                                />
                            </div>

                            <button
                                type="submit"
                                className="admin-generate-report-button bg-primary rounded-pill">
                                Generate Report
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
