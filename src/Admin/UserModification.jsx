import React, { useState, useEffect } from 'react';
import './styles/Admin-Style.css'; // Adjust the path as needed

const UserModification = () => {
  // Placeholder state for user data, to be replaced by data from your DB later
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulate fetching user data (replace this with actual API or DB call later)
    const fetchedUsers = [
      { id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Jane Smith', role: 'User', status: 'Inactive' },
    ];
    setUsers(fetchedUsers);
  }, []);

  const handleEdit = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
    // Add actual edit logic here
  };

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
    // Add actual delete logic here
  };

  return (
    <div className="admin-user-modification-container">
      <div className="text-center text-lg-start mt-4">
        <h1 className="Maintext animated slideInRight">Admin User Modification</h1>
        <p className="Subtext">Manage users and their roles</p>
      </div>

      <table className="table table-striped table-bordered mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No users available</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => handleEdit(user.id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserModification;
