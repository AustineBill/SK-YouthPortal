import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css'

const AdminSidebar = () => {
    const [manageWebsiteChildLinksOpen, setmanageWebsiteChildLinksOpen] = useState(false);
    const [manageRequestsChildLinksOpen, setmanageRequestsChildLinksOpen] = useState(false);

    return (
        <div className="sidebar-container">
            <div className="admin-sidebar">
                <h2 className="sidebar-title">Admin Panel</h2>
                <ul className="sidebar-links">
                    <li>
                        <img src='#' alt="Home icon" />
                        <Link to="/admin-dashboard">Home</Link>
                    </li>

                    <li className="manage-website-link-open" onClick={() => setmanageWebsiteChildLinksOpen(!manageWebsiteChildLinksOpen)}>
                        <img src='#' alt="Manage Website icon" />
                        Manage Website
                    </li>
                    {manageWebsiteChildLinksOpen && (
                        <ul className="manage-website-nested-links">
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
                    <li className="manage-requests-link-open" onClick={() => setmanageRequestsChildLinksOpen(!manageRequestsChildLinksOpen)}>
                        <img src='#' alt="Manage Requests icon" />
                        Manage Requests
                    </li>
                    {manageRequestsChildLinksOpen && (
                        <ul className="manage-requests-nested-links">
                            <li>
                                <img src='#' alt="Reservation icon" />
                                <Link to="/admin/reservation">Reservation</Link>
                            </li>
                        </ul>
                    )}
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
