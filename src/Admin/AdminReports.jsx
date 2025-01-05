import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './styles/adminreports.css'; // New CSS file for AdminReports styling

const Reports = () => {
    const [activeTable, setActiveTable] = useState('users');
    const [dateSortOption, setDateSortOption] = useState('date');
    const [usersData, setUsersData] = useState([]);
    const [equipmentReservations, setEquipmentReservations] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [inventory, setInventory] = useState([]);

    // Fetch data based on active table
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = '';
                if (activeTable === 'users') {
                    url = 'http://localhost:5000/user-reports';
                    const response = await axios.get(url);
                    setUsersData(response.data);
                } else if (activeTable === 'equipment') {
                    url = 'http://localhost:5000/equipment-reports';
                    const response = await axios.get(url);
                    setEquipmentReservations(response.data);
                } else if (activeTable === 'schedules') {
                    url = 'http://localhost:5000/schedule-reports';
                    const response = await axios.get(url);
                    setSchedules(response.data);
                } else if (activeTable === 'inventory') {
                    url = 'http://localhost:5000/inventory-reports';
                    const response = await axios.get(url);
                    setInventory(response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [activeTable]);

    // Group data by date (date, monthly, or annual) using created_at for users, equipment, schedules, and inventory
    const groupDataByDate = (data) => {
        const groupedData = data.reduce((acc, entry) => {
            const date = new Date(entry.created_at || entry.date || entry.start_date || entry.start_time);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            let groupKey;
            if (dateSortOption === 'annual') {
                groupKey = year;
            } else if (dateSortOption === 'monthly') {
                groupKey = `${year}-${month.toString().padStart(2, '0')}`;
            } else {
                groupKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            }

            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(entry);
            return acc;
        }, {});
        return groupedData;
    };

    const groupedUsers = groupDataByDate(usersData);
    const groupedEquipmentReservations = groupDataByDate(equipmentReservations);
    const groupedSchedules = groupDataByDate(schedules);
    const groupedInventory = groupDataByDate(inventory);

    // Generate PDF
    const generatePDF = () => {
        const input = document.getElementById('admin-reports-table');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${activeTable}-report.pdf`);
        });
    };

    return (
        <div className="admin-reports-container">
            <div className="row">
                {/* Dropdown for selecting table */}
                <div className="col-md-6 mb-3">
                    <select
                        className="form-select"
                        value={activeTable}
                        onChange={(e) => setActiveTable(e.target.value)}
                    >
                        <option value="users">Users</option>
                        <option value="equipment">Equipment Reservations</option>
                        <option value="schedules">Gym Reservations</option>
                        <option value="inventory">Inventory</option>
                    </select>
                </div>

                {/* Dropdown for selecting date sort option */}
                <div className="col-md-6 mb-3">
                    <select
                        className="form-select"
                        value={dateSortOption}
                        onChange={(e) => setDateSortOption(e.target.value)}
                    >
                        <option value="date">Date</option>
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                    </select>
                </div>
            </div>

            {/* Generate PDF Button */}
            <div className="text-end mb-3">
                <button className="btn btn-primary" onClick={generatePDF}>
                    Generate PDF
                </button>
            </div>

            {/* Show selected table */}
            <div id="admin-reports-table">
                {activeTable === 'users' && (
                    <div className="admin-reports-users-table">
                        <h3 className="text-center mb-3">Users</h3>
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedUsers).length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">No records found</td>
                                    </tr>
                                ) : (
                                    Object.entries(groupedUsers).map(([date, users]) => (
                                        <tr key={date}>
                                            <td>{date}</td>
                                            <td>{users.map(user => <div key={user.id}>{user.id}</div>)}</td>
                                            <td>{users.map(user => <div key={user.id}>{user.firstname} {user.lastname}</div>)}</td>
                                            <td>{users.map(user => <div key={user.id}>{user.username}</div>)}</td>
                                            <td>{users.map(user => <div key={user.id}>{user.email_address}</div>)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTable === 'equipment' && (
                    <div className="admin-reports-equipment-table">
                        <h3 className="text-center mb-3">Equipment Reservations</h3>
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User ID</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Reserved Equipment</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedEquipmentReservations).length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">No records found</td>
                                    </tr>
                                ) : (
                                    Object.entries(groupedEquipmentReservations).map(([date, reservations]) => (
                                        <tr key={date}>
                                            <td>{date}</td>
                                            <td>{reservations.map(res => <div key={res.id}>{res.user_id}</div>)}</td>
                                            <td>{reservations.map(res => <div key={res.id}>{new Date(res.start_date).toLocaleString()}</div>)}</td>
                                            <td>{reservations.map(res => <div key={res.id}>{new Date(res.end_date).toLocaleString()}</div>)}</td>
                                            <td>
                                                {reservations.map(res => (
                                                    res.reserved_equipment.map((equip, index) => (
                                                        <div key={index}>
                                                            {equip.name} (Quantity: {equip.quantity})
                                                        </div>
                                                    ))
                                                ))}
                                            </td>
                                            <td>{reservations.map(res => <div key={res.id}>{res.status}</div>)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTable === 'schedules' && (
                    <div className="admin-reports-schedules-table">
                        <h3 className="text-center mb-3">Gym Reservations</h3>
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Reservation ID</th>
                                    <th>User ID</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedSchedules).length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">No gym reservations found</td>
                                    </tr>
                                ) : (
                                    Object.entries(groupedSchedules).map(([date, reservations]) => (
                                        <tr key={date}>
                                            <td>{date}</td>
                                            <td>
                                                {reservations.map(reservation => (
                                                    <div key={reservation.id}>{reservation.id}</div>
                                                ))}
                                            </td>
                                            <td>
                                                {reservations.map(reservation => (
                                                    <div key={reservation.id}>{reservation.user_id}</div>
                                                ))}
                                            </td>
                                            <td>
                                                {reservations.map(reservation => (
                                                    <div key={reservation.id}>
                                                        {new Date(reservation.start_time).toLocaleString()}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {reservations.map(reservation => (
                                                    <div key={reservation.id}>
                                                        {new Date(reservation.end_time).toLocaleString()}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {reservations.map(reservation => (
                                                    <div key={reservation.id}>{reservation.status}</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTable === 'inventory' && (
                    <div className="admin-reports-inventory-table">
                        <h3 className="text-center mb-3">Inventory</h3>
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Specification</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedInventory).length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">No inventory records found</td>
                                    </tr>
                                ) : (
                                    Object.entries(groupedInventory).map(([date, items]) => (
                                        <tr key={date}>
                                            <td>{date}</td>
                                            <td>{items.map(item => <div key={item.id}>{item.id}</div>)}</td>
                                            <td>{items.map(item => <div key={item.id}>{item.name}</div>)}</td>
                                            <td>{items.map(item => <div key={item.id}>{item.quantity}</div>)}</td>
                                            <td>{items.map(item => <div key={item.id}>{item.specification}</div>)}</td>
                                            <td>{items.map(item => <div key={item.id}>{item.status}</div>)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
