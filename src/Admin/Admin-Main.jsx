import React from 'react';
import AdminSidebar from './AdminSidebar'; // Adjust the import path

const AdminMain = ({ isAdmin }) => {
    return (
        <div className="admin-main-container">
            {isAdmin ? <AdminSidebar /> : null} {/* Render the sidebar only if isAdmin is true */}
            <h2>Admin Dashboard</h2>
            <p>Welcome to the Admin Dashboard.</p>
        </div>
    );
};

export default AdminMain;
