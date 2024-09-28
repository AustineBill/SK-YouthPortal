import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    }

    return ( 
        <div className="admin-sidebar">
            <ul className="sidebar-links">
                <li>
                    <img src='#'/>
                    <Link to="/admin-dashboard">Home</Link>
                </li>
                <li className="clickable-link" onClick={() => toggleDropdown(1)}>
                    <img src='#'/>
                    Manage Website
                    {openDropdown === 1 && (
                        <ul className="dropdown">
                            <li>
                                <img src='#'/>
                                <Link to="/manage-home-page">Manage Home Page</Link>
                            </li>
                            <li>
                                <img src='#'/>
                                <Link to="/manage-about-us-page">Manage About Us Page</Link>
                            </li>
                            <li>
                                <img src='#'/>
                                <Link to="/manage-program-page">Manage Program Page</Link>
                            </li>
                            <li>
                                <img src='#'/>
                                <Link to="/manage-contact-us-page">Manage Contact Us Page</Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="clickable-link" onClick={() => toggleDropdown(2)}>
                    <img src='#'/>
                    Manage Requests
                    {openDropdown === 2 && (
                        <ul className="dropdown">
                            <li>
                                <img src='#'/>
                                <Link to="/reservations">Reservations</Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li>
                    <img src='#'/>
                    <Link to="/reports">Reports</Link></li>
                <li>
                    <img src='#'/>
                    <Link to="/users">Users</Link></li>
            </ul>
        </div>
    );
}

export default AdminSidebar;