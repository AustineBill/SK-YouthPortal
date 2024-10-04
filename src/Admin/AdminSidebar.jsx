import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css'

const AdminSidebar = () => {
    const [openDropdown, setOpenDropdown] = React.useState(0);

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? 0 : index);
    };

    return (
        <div className="sidebar-container">
            <div className="admin-sidebar">
                <h2 className="sidebar-title">Admin Panel</h2>
                <ul className="sidebar-links">
                    <li>
                        <img src='#' alt="Home icon" />
                        <Link to="/admin-dashboard">Home</Link>
                    </li>
                    <li className="clickable-link" onClick={() => toggleDropdown(1)}>
                        <img src='#' alt="Manage Website icon" />
                        Manage Website
                        {openDropdown === 1 && (
                            <ul className="dropdown">
                                <li>
                                    <img src='#' alt="Manage Home Page icon" />
                                    <Link to="/manage-home-page">Manage Home Page</Link>
                                </li>
                                <li>
                                    <img src='#' alt="Manage About Us Page icon" />
                                    <Link to="/manage-about-us">Manage About Us Page</Link>
                                </li>
                                <li>
                                    <img src='#' alt="Manage Program Page icon" />
                                    <Link to="/manage-program">Manage Program Page</Link>
                                </li>
                                <li>
                                    <img src='#' alt="Manage Contact Us Page icon" />
                                    <Link to="/manage-contact-us">Manage Contact Us Page</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="clickable-link" onClick={() => toggleDropdown(2)}>
                        <img src='#' alt="Manage Requests icon" />
                        Manage Requests
                        {openDropdown === 2 && (
                            <ul className="dropdown">
                                <li>
                                    <img src='#' alt="Reservation icon" />
                                    <Link to="/admin/reservation">Reservation</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <img src='#' alt="Reports icon" />
                        <Link to="/reports">Reports</Link>
                    </li>
                    <li>
                        <img src='#' alt="Users icon" />
                        <Link to="/users">Users</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;

