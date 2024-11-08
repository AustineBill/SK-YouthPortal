import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeLogo from '../Asset/Admin/Home.png';
import ManageWebsiteLogo from '../Asset/Admin/Manage Website.png';
import ManageHomeLogo from '../Asset/Admin/Manage Home.png';
import ManageAboutUsLogo from '../Asset/Admin/Manage About Us.png';
import ManageProgramLogo from '../Asset/Admin/Manage Program.png';
import ManageContactUsLogo from '../Asset/Admin/Manage Contact Us.png';
import ManageRequestsLogo from '../Asset/Admin/Manage Requests.png';
import ReservationsLogo from '../Asset/Admin/Reservations.png';
import ReportsLogo from '../Asset/Admin/Reports.png';
import UsersLogo from '../Asset/Admin/Users.png';
// import './AdminSidebar.css'
import './styles/AdminSidebar.css';

const AdminSidebar = () => {
    const [manageWebsiteChildLinksOpen, setmanageWebsiteChildLinksOpen] = useState(false);
    const [manageRequestsChildLinksOpen, setmanageRequestsChildLinksOpen] = useState(false);

    return (
        <div className="sidebar-container">
            <div className="admin-sidebar">
                {/* <h2 className="sidebar-title">Admin Panel</h2> */}
                <ul className="sidebar-links">
                    <li>
                        <img src={HomeLogo} alt="Home Logo" id='sidebar-logos' />
                        <Link to="/admin">Home</Link>
                    </li>

                    <li className="manage-website-link-open" onClick={() => setmanageWebsiteChildLinksOpen(!manageWebsiteChildLinksOpen)}>
                        <img src={ManageWebsiteLogo} alt="Manage Website Logo" id='sidebar-logos' />
                        Manage Website
                    </li>
                    {manageWebsiteChildLinksOpen && (
                        <ul className="manage-website-nested-links">
                            <li>
                                <img src={ManageHomeLogo} alt="Manage Home Logo" id='sidebar-logos' />
                                <Link to="/admin/manage-home">Manage Home Page</Link>
                            </li>
                            <li>
                                <img src={ManageAboutUsLogo} alt="Manage About Us Logo" id='sidebar-logos' />
                                <Link to="/admin/manage-about-us">Manage About Us Page</Link>
                            </li>
                            <li>
                                <img src={ManageProgramLogo} alt="Manage Program Logo" id='sidebar-logos' />
                                <Link to="/admin/manage-program">Manage Program Page</Link>
                            </li>
                            <li>
                                <img src={ManageContactUsLogo} alt="Manage Contact Us Logo" id='sidebar-logos' />
                                <Link to="/admin/manage-contact-us">Manage Contact Us Page</Link>
                            </li>
                        </ul>
                    )}
                    <li className="manage-requests-link-open" onClick={() => setmanageRequestsChildLinksOpen(!manageRequestsChildLinksOpen)}>
                        <img src={ManageRequestsLogo} alt="Manage Requests Logo" id='sidebar-logos' />
                        Manage Requests
                    </li>
                    {manageRequestsChildLinksOpen && (
                        <ul className="manage-requests-nested-links">
                            <li>
                                <img src={ReservationsLogo} alt="Reservation Logo" id='sidebar-logos' />
                                <Link to="/admin/reservation">Reservation</Link>
                            </li>
                        </ul>
                    )}
                    <li>
                        <img src={ReportsLogo} alt="Reports Logo" id='sidebar-logos' />
                        <Link to="/admin/reports">Reports</Link>
                    </li>
                    <li>
                        <img src={UsersLogo} alt="Users Logo" id='sidebar-logos' />
                        <Link to="/admin/users">Users</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;
