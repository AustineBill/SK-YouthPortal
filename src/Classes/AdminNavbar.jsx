import React, { useContext } from 'react';
import { AuthContext } from '../WebStructure/AuthContext';
import { useNavigate } from "react-router-dom";
import iSKedLogo from '../Asset/WebImages/Logo.png';
import "../Admin/styles/AdminNavbar.css";


const AdminNavbar = () => {
    const { adminlogout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignout = () => {
        adminlogout();
        navigate("/userauth");
    }

    return (
        <nav className="admin-navbar">
            <div className='admin-panel'>
                <img src={iSKedLogo} alt="iSKed Logo" id='iSKed-logo' />
                <h1>iSKed - Admin Panel</h1>
            </div>
            <button onClick={handleSignout}>
                Sign out
            </button>
        </nav>
    );
}

export default AdminNavbar;