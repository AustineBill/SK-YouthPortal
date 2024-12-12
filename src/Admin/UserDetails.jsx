import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/UserDetails.css'; // Import the CSS file for styling

const UserDetails = () => {
    const { id } = useParams(); // Get the user ID from the route params
    const [user, setUser] = useState(null); // State to store user data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/Users/${id}`);
                if (!response.ok) {
                    throw new Error('User not found');
                }
                const data = await response.json();
                setUser(data); // Set the user data into state
            } catch (err) {
                setError(err.message); // Set the error if any
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUserData(); // Call the fetch function
    }, [id]); // The useEffect hook will run whenever the id changes

    if (loading) {
        return <p>Loading...</p>; // Display loading message while fetching data
    }

    if (error) {
        return <p>{error}</p>; // Display error message if something went wrong
    }

    if (!user) {
        return <p>User not found.</p>; // If no user is found, show this message
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
