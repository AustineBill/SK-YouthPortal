import React, { useState } from 'react';
import './styles/usemod.css'; // Adjust the path as needed

const Users = () => {
    const [users, setUsers] = useState([]); // State for user data
    const [newUser, setNewUser] = useState({ name: '', role: '', status: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    const handleAddUser = () => {
        if (newUser.name && newUser.role && newUser.status) {
            const userId = users.length ? users[users.length - 1].id + 1 : 1; // Assign an ID
            const userToAdd = { id: userId, ...newUser };
            setUsers([...users, userToAdd]);
            setNewUser({ name: '', role: '', status: '' });
        }
    };

    const handleEdit = (userId) => {
        const user = users.find((u) => u.id === userId);
        setNewUser({ name: user.name, role: user.role, status: user.status });
        setIsEditing(true);
        setEditUserId(userId);
    };

    const handleUpdateUser = () => {
        setUsers(users.map((u) => (u.id === editUserId ? { id: u.id, ...newUser } : u)));
        resetForm();
    };

    const handleDelete = (userId) => {
        setUsers(users.filter((user) => user.id !== userId));
    };

    const resetForm = () => {
        setIsEditing(false);
        setNewUser({ name: '', role: '', status: '' });
        setEditUserId(null);
    };

    return (
        <div className="admin-user-modification-container">

            <div className="main-content">
                <div className="container">
                    <div className="text-center text-lg-start mt-4">
                        <h1 className="Maintext animated slideInRight">Admin User Modification</h1>
                        <p className="Subtext">Manage users and their roles</p>
                    </div>

                    <div className="user-form">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Status"
                            value={newUser.status}
                            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                        />
                        <button 
                            className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`} 
                            onClick={isEditing ? handleUpdateUser : handleAddUser}
                        >
                            {isEditing ? 'Update User' : 'Add User'}
                        </button>
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
            </div>
        </div>
    );
};

export default Users;
