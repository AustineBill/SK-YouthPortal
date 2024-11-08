// src/Admin/UserDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import './styles/UserDetails.css'; // Import the CSS file for styling

const UserDetails = () => {
    // eslint-disable-next-line no-unused-vars
    const { id } = useParams(); // Get the user ID from the route params

    // Placeholder for future data fetching based on `id`
    const user = {}; // This will be replaced with data from the database later

    if (!user) {
        return <p>User not found.</p>;
    }

    return (
        <div className="user-details-container">
            <div className="user-profile">
                <img 
                    src={user.imageUrl || 'https://via.placeholder.com/150'} // Placeholder image
                    alt={`${user.firstname || 'User'} ${user.lastname || 'Profile'}`} 
                    className="user-image" 
                />
                <div className="user-info">
                    <h2>{`${user.firstname || 'Firstname'} ${user.lastname || 'Lastname'}`}</h2>
                    <p><strong>Birthday:</strong> {user.birthday || 'Not Available'}</p>
                    <p><strong>Sex:</strong> {user.sex || 'Not Available'}</p>
                    <p><strong>Address:</strong> {user.address || 'Not Available'}</p>
                    <p><strong>Civil Status:</strong> {user.civilStatus || 'Not Available'}</p>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
