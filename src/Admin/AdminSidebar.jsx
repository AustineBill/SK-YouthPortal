import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../WebStyles/Admin-CSS.css';

const AdminSidebar = () => {
    const [openedLinks, setOpenedLinks] = useState({});
    const location = useLocation();

    const toggleLink = (link) => {
        setOpenedLinks((prev) => ({
            ...prev,
            [link]: !prev[link],
        }));
    };

    const isActive = useCallback(
        (path) => location.pathname === path,
        [location.pathname]
    );

    useEffect(() => {
        const paths = {
            manageWebsite: [
                '/admin/manage-home',
                '/admin/manage-about-us',
                '/admin/manage-program',
                '/admin/manage-contact-us',
            ],
            reservations: [
                '/admin/gym-reservation',
                '/admin/equipment-reservation',
                '/admin/Inventory',
            ],
        };

        const initialOpenedLinks = {};

        for (const key in paths) {
            if (paths[key].some((path) => isActive(path))) {
                initialOpenedLinks[key] = true;
            }
        }

        setOpenedLinks(initialOpenedLinks);
    }, [isActive]);

    return (
        <div className="admin-bs-sidebar d-none d-md-block">
            <div className="admin-bs-sidebar-details">
                <ul className="admin-bs-sidebar-links list-unstyled mt-2">
                    <li className={`admin-bs-list ${isActive('/admin') ? 'active' : ''}`}>
                        <Link to="/admin" className="admin-sidebar-link d-flex align-items-center">
                            <i className="admin-sidebar-icon bi-house-fill"></i>
                            <p className='admin-sidebar-title m-0'>Home</p>
                        </Link>
                    </li>
                    <li
                        className="admin-bs-list d-flex align-items-center"
                        onClick={() => toggleLink('manageWebsite')}
                    >
                        <i className="admin-sidebar-icon bi-globe-central-south-asia"></i>
                        <p className='admin-sidebar-title m-0'>Manage Website</p>
                        {!openedLinks.manageWebsite && (
                            <i className='admin-sidebar-MW-close bi bi-caret-right-fill'></i>
                        )}
                        {openedLinks.manageWebsite && (
                            <i className='admin-sidebar-MW-open bi bi-caret-down-fill'></i>
                        )}
                    </li>
                    {openedLinks.manageWebsite && (
                        <ul className="admin-bs-manage-website-nested-links list-unstyled">
                            <li
                                className={`admin-bs-list ${isActive('/admin/manage-home') ? 'active' : ''}`}
                            >
                                <Link to="/admin/manage-home" className="admin-sidebar-link d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-house-gear-fill"></i>
                                    <p className='admin-sidebar-title m-0'>Manage Home Page</p>
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/manage-about-us') ? 'active' : ''}`}
                            >
                                <Link to="/admin/manage-about-us" className="admin-sidebar-link d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-person-fill"></i>
                                    <p className='admin-sidebar-title m-0'>Manage About Us Page</p>
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/manage-program') ? 'active' : ''}`}
                            >
                                <Link to="/admin/manage-program" className="admin-sidebar-link d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-activity"></i>
                                    <p className='admin-sidebar-title m-0'>Manage Program Page</p>
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/manage-contact-us') ? 'active' : ''}`}
                            >
                                <Link to="/admin/manage-contact-us" className="admin-sidebar-link d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-telephone-fill"></i>
                                    <p className='admin-sidebar-title m-0'>Manage Contact Us Page</p>
                                </Link>
                            </li>
                        </ul>
                    )}
                    <li
                        className="admin-bs-list d-flex align-items-center"
                        onClick={() => toggleLink('reservations')}
                    >
                        <i className="admin-sidebar-icon bi-calendar-week-fill"></i>
                        <p className='admin-sidebar-title m-0'>Reservations</p>
                        {!openedLinks.reservations && (
                            <i className='admin-sidebar-R-close bi bi-caret-right-fill'></i>
                        )}
                        {openedLinks.reservations && (
                            <i className='admin-sidebar-R-open bi bi-caret-down-fill'></i>
                        )}
                    </li>
                    {openedLinks.reservations && (
                        <ul className="admin-bs-reservations-nested-links list-unstyled">
                            <li
                                className={`admin-bs-list ${isActive('/admin/gym-reservation') ? 'active' : ''}`}
                            >
                                <Link to="/admin/gym-reservation" className="admin-sidebar-link d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-calendar-date-fill"></i>
                                    <p className='admin-sidebar-title m-0'>Gym Reservation</p>
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/equipment-reservation') ? 'active' : ''}`}
                            >
                                <Link to="/admin/equipment-reservation" className="admin-sidebar-link d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-calendar-day-fill"></i>
                                    <p className='admin-sidebar-title m-0'>Equipment Reservation</p>
                                </Link>
                            </li>
                            <li
                                className={`admin-bs-list ${isActive('/admin/Inventory') ? 'active' : ''}`}
                            >
                                <Link to="/admin/Inventory" className="admin-sidebar-link d-flex align-items-center">
                                    <i className="admin-sidebar-icon bi-calendar-day-fill me-2"></i>
                                    <p className='admin-sidebar-title m-0'>Inventory</p>
                                </Link>
                            </li>
                        </ul>
                    )}
                    <li className={`admin-bs-list ${isActive('/admin/reports') ? 'active' : ''}`}>
                        <Link to="/admin/reports" className="admin-sidebar-link d-flex align-items-center">
                            <i className="admin-sidebar-icon bi-database-fill"></i>
                            <p className='admin-sidebar-title m-0'>Reports</p>
                        </Link>
                    </li>
                    <li className={`admin-bs-list ${isActive('/admin/users') ? 'active' : ''}`}>
                        <Link to="/admin/users" className="admin-sidebar-link admin-link d-flex align-items-center">
                            <i className="admin-sidebar-icon bi-person-lines-fill"></i>
                            <p className='admin-sidebar-title m-0'>Users</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;
