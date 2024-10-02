import React from 'react';
import AdminSidebar from './AdminSidebar'; // Adjust the import path if necessary

const AdminMain = ({ isAdmin }) => {
    console.log("isAdmin:", isAdmin); // Check if isAdmin is true
    return (
        <div className="admin-main-container">
            {isAdmin ? <AdminSidebar /> : <p>No access to sidebar.</p>} {/* Sidebar rendered based on isAdmin */}
        </div>
    );
};

export default AdminMain;
