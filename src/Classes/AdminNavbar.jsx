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
        { to: "/admin/reservations", label: "Reservations" },
        { to: "/admin/reports", label: "Reports" },
        { to: "/admin/users", label: "Users" }
    ];

    return (
        <>
            <nav className='navbar fixed-top'>
                <div className='website-navbar d-flex align-items-center justify-content-between mx-4'>
                    <div className='navbar-left-side d-flex align-items-center'>
                        <img
                            src={iSKedLogo}
                            alt="iSKed Logo"
                            id='iSKed-logo'
                            className='d-none d-md-block me-2'
                        />
                        <h1 className='navbar-name-brand fst-italic text-white h1 d-none d-md-block'>
                            iSKed - Admin Panel
                        </h1>

                        {/* Hamburger Menu */}
                        <div className="hamburger-menu d-flex d-md-none">
                            <span
                                className="navbar-toggler-icon me-2"
                                onClick={toggleSidebar}
                            ></span>
                            <h4 className='navbar-name-brand fst-italic text-white h4 d-md-none'>
                                iSKed - Admin Panel
                            </h4>
                        </div>
                    </div>

                    {/* Sign-out Button */}
                    <button
                        className='sign-out-button bg-danger rounded-pill'
                        onClick={handleSignout}
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            {/* Sidebar */}
            <div
                className={`sidebar text-white ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
            >
                <ul className="list-unstyled">
                    {sidebarLinks.map(link => (
                        <li key={link.to}>
                            <Link to={link.to} className="sidebar-links text-white ms-4 d-block">
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
