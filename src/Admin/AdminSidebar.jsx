import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeLogo from '../Asset/Admin/Home.png';
import ManageWebsiteLogo from '../Asset/Admin/Manage Website.png';
import ManageHomeLogo from '../Asset/Admin/Manage Home.png';
import ManageAboutUsLogo from '../Asset/Admin/Manage About Us.png';
import ManageProgramLogo from '../Asset/Admin/Manage Program.png';
import ManageContactUsLogo from '../Asset/Admin/Manage Contact Us.png';
import ReservationsLogo from '../Asset/Admin/Reservations.png';
import ReportsLogo from '../Asset/Admin/Reports.png';
import UsersLogo from '../Asset/Admin/Users.png';
// import './AdminSidebar.css'
import './styles/AdminSidebar.css';

const AdminSidebar = () => {
    const [manageWebsiteChildLinksOpen, setmanageWebsiteChildLinksOpen] = useState(false);

    return (
        <div className="sidebar-container">
            <div className="admin-sidebar">
                {/* <h2 className="sidebar-title">Admin Panel</h2> */}
                <ul className="sidebar-links">
                    <Link to="/admin">
                        <li>
                            <img src={HomeLogo} alt="Home Logo" id='sidebar-logos' />
                            Home
                        </li>
                    </Link>
                    <li className="manage-website-link-open" onClick={() => setmanageWebsiteChildLinksOpen(!manageWebsiteChildLinksOpen)}>
                        <img src={ManageWebsiteLogo} alt="Manage Website Logo" id='sidebar-logos' />
                        Manage Website
                    </li>
                    {manageWebsiteChildLinksOpen && (
                        <ul className="manage-website-nested-links">
                            <Link to="/admin/manage-home">
                                <li>
                                    <img src={ManageHomeLogo} alt="Manage Home Logo" id='sidebar-logos' />
                                    Manage Home Page
                                </li>
                            </Link>
                            <Link to="/admin/manage-about-us">
                                <li>
                                    <img src={ManageAboutUsLogo} alt="Manage About Us Logo" id='sidebar-logos' />
                                    Manage About Us Page
                                </li>
                            </Link>
                            <Link to="/admin/manage-program">
                                <li>
                                    <img src={ManageProgramLogo} alt="Manage Program Logo" id='sidebar-logos' />
                                    Manage Program Page
                                </li>
                            </Link>
                            <Link to="/admin/manage-contact-us">
                            <li>
                                <img src={ManageContactUsLogo} alt="Manage Contact Us Logo" id='sidebar-logos' />
                                Manage Contact Us Page
                            </li>
                            </Link>
                        </ul>
                    )}
                    <Link to="/admin/reservations">
                        <li>
                            <img src={ReservationsLogo} alt="Reservation Logo" id='sidebar-logos' />
                            Reservations
                        </li>
                    </Link>
                        {/* </ul>
                    )} */}
                    <Link to="/admin/reports">
                        <li>
                            <img src={ReportsLogo} alt="Reports Logo" id='sidebar-logos' />
                            Reports
                        </li>
                    </Link>
                    <Link to="/admin/users">
                        <li>
                            <img src={UsersLogo} alt="Users Logo" id='sidebar-logos' />
                            Users
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;
