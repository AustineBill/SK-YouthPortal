import React from 'react'; // Make sure to import React
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const AdminSidebar = () => {
    const [openDropdown, setOpenDropdown] = React.useState(0); // State for dropdown toggle

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? 0 : index);
    };

    return ( 
        <div className="admin-sidebar">
            <ul className="sidebar-links">
                <li>
                    <img src='#' alt="Home icon" />
                    <Link to="/admin-dashboard">Home</Link>
                </li>
                <li className="clickable-link" onClick={() => toggleDropdown(1)}>
                    <img src='#' alt="Manage Website icon" />
                    Manage Website
                    {openDropdown === 1 && (
                        <ul className="dropdown">
                            <li>
                                <img src='#' alt="Manage Home Page icon" />
                                <Link to="/manage-home-page">Manage Home Page</Link>
                            </li>
                            {/* Add alt attributes for other images as well */}
                        </ul>
                    )}
                </li>
                {/* Continue for the rest of your sidebar items */}
            </ul>
        </div>
    );
};

export default AdminSidebar; // Export the component
