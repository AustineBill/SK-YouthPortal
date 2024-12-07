import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/AdminSidebar.css';

const AdminSidebar = () => {
    const [openedLinks, setOpenedLinks] = useState({});
    const location = useLocation(); // Get the current location

    const toggleLink = (link) => {
        setOpenedLinks((prev) => ({
            ...prev,
            [link]: !prev[link],
        }));
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-bs-sidebar d-none d-md-block">
            <div className="admin-bs-sidebar-details">
                <ul className="admin-bs-sidebar-links list-unstyled mt-2">
                    <li className={`admin-bs-list ${isActive('/admin') ? 'active' : ''}`}>
                        <Link to="/admin" className="d-flex align-items-center">
                            <i className="admin-sidebar-icon bi-house-fill ms-4 me-2"></i>
                            Home
                        </Link>
                    </li>
                    <li
                        className="admin-bs-list d-flex align-items-center"
                        onClick={() => toggleLink('manageWebsite')}
                    >
                        <i className="admin-sidebar-icon bi-globe-central-south-asia ms-4 me-2"></i>
                        Manage Website
                    </li>
                    {openedLinks.manageWebsite && (
                        <ul className="admin-bs-manage-website-nested-links list-unstyled ms-4">
                            <li
                                className={`admin-bs-list ${isActive('/admin/manage-home') ? 'active' : ''}`}
                            >
                                <Link to="/admin/manage-home" className="d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-house-gear-fill me-2"></i>
                                    Manage Home Page
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/manage-about-us') ? 'active' : ''}`}
                            >
                                <Link to="/admin/manage-about-us" className="d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-person-fill me-2"></i>
                                    Manage About Us Page
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/manage-program') ? 'active' : ''}`}
                            >
                                <Link to="/admin/manage-program" className="d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-activity me-2"></i>
                                    Manage Program Page
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/manage-contact-us') ? 'active' : ''}`}
                            >
                                <Link to="/admin/manage-contact-us" className="d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-telephone-fill me-2"></i>
                                    Manage Contact Us Page
                                </Link>
                            </li>
                        </ul>
                    )}
                    <li
                        className="admin-bs-list d-flex align-items-center"
                        onClick={() => toggleLink('reservations')}
                    >
                        <i className="admin-sidebar-icon bi-calendar-week-fill ms-4 me-2"></i>
                        Reservations
                    </li>
                    {openedLinks.reservations && (
                        <ul className="admin-bs-reservations-nested-links list-unstyled ms-4">
                            <li
                                className={`admin-bs-list ${isActive('/admin/gym-reservation') ? 'active' : ''}`}
                            >
                                <Link to="/admin/gym-reservation" className="d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-calendar-date-fill me-2"></i>
                                    Gym Reservation
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/equipment-reservation') ? 'active' : ''}`}
                            >
                                <Link to="/admin/equipment-reservation" className="d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-calendar-day-fill me-2"></i>
                                    Equipment Reservation
                                </Link>
                            </li>
                        </ul>
                    )}
                    <li className={`admin-bs-list ${isActive('/admin/reports') ? 'active' : ''}`}>
                        <Link to="/admin/reports" className="d-flex align-items-center">
                            <i className="admin-sidebar-icon bi-database-fill ms-4 me-2"></i>
                            Reports
                        </Link>
                    </li>
                    <li className={`admin-bs-list ${isActive('/admin/users') ? 'active' : ''}`}>
                        <Link to="/admin/users" className="admin-link d-flex align-items-center">
                            <i className="admin-sidebar-icon bi-person-lines-fill ms-4 me-2"></i>
                            Users
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;
