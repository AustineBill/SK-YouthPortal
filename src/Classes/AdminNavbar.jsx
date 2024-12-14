import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import { useNavigate, Link } from "react-router-dom";
import iSKedLogo from '../Asset/WebImages/Logo.png';
import "../Admin/styles/AdminNavbar.css";

const AdminNavbar = () => {
    const { adminlogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSignout = () => {
        adminlogout();
        navigate("/userauth");
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false);
            }
        };

        handleResize(); // check on first render
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const sidebarLinks = [
        { to: "/admin", label: "Home" },
        { to: "/admin/manage-home", label: "Manage Home Page" },
        { to: "/admin/manage-about-us", label: "Manage About Us Page" },
        { to: "/admin/manage-program", label: "Manage Program Page" },
        { to: "/admin/manage-contact-us", label: "Manage Contact Us Page" },
        { to: "/admin/gym-reservation", label: "Gym Reservation" },
        { to: "/admin/equipment-reservation", label: "Equipment Reservation" },
        { to: "/admin/reports", label: "Reports" },
        { to: "/admin/users", label: "Users" }
    ];

    return (
        <>
            {/* Navbar */}
            <nav className='admin-navbar fixed-top d-flex align-items-center'>
                <div className='admin-navbar-details d-flex align-items-center justify-content-between mx-4'>
                    <div className='admin-navbar-left-side d-flex align-items-center'>
                        <img
                            src={iSKedLogo}
                            alt="iSKed Logo"
                            className='admin-iSKed-logo me-2 d-none d-md-block'
                        />
                        <h1 className='admin-iSKed-name fst-italic text-white h1 m-0 p-0 d-none d-md-block'>
                            iSKed - Admin Panel
                        </h1>

                        {/* Hamburger Menu */}
                        <div className="admin-hamburger-menu d-md-none">
                            <div className='admin-hamburger-menu-left d-flex align-items-center'>
                                <span
                                    className="admin-hamburger-nav bi-list m-0 p-0 me-2"
                                    onClick={toggleSidebar}
                                    aria-label="Toggle sidebar"
                                ></span>
                                <h4 className='admin-iSKed-name-h4 fst-italic text-white m-0 p-0'>
                                    iSKed - Admin Panel
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Sign-out Button */}
                    <button
                        className='admin-sign-out-button bg-danger rounded-pill'
                        onClick={handleSignout}
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            {/* Sidebar */}
            <div
                className={`admin-sidebar ${isSidebarOpen ? "admin-sidebar-open" : "admin-sidebar-closed"}`}
            >
                <ul className="admin-sidebar-ul list-unstyled">
                    {sidebarLinks.map((link) => (
                        <li key={link.to}>
                            <Link to={link.to} className="admin-sidebar-links text-white ms-4 mt-2 p-1 d-block">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default AdminNavbar;
