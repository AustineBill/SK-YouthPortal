import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/usemod.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        firstname: '',
        lastname: '',
        birthday: '',
        sex: '',
        address: '',
        civilStatus: '',
        imageUrl: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [showModal, setShowModal] = useState(false); // Toggle for modal
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewUser((prev) => ({ ...prev, imageUrl: reader.result }));
        };
        if (file) reader.readAsDataURL(file);
    };

    // Add a new user
    const handleAddUser = () => {
        if (newUser.firstname && newUser.lastname) {
            const userId = users.length ? users[users.length - 1].id + 1 : 1;
            const userToAdd = { id: userId, ...newUser };
            setUsers([...users, userToAdd]);
            resetForm();
            setShowModal(false);
        }
    };

    // Edit an existing user
    const handleEdit = (userId) => {
        const user = users.find((u) => u.id === userId);
        setNewUser(user);
        setIsEditing(true);
        setEditUserId(userId);
        setShowModal(true);
    };

    // Update an existing user
    const handleUpdateUser = () => {
        setUsers(users.map((u) => (u.id === editUserId ? { id: u.id, ...newUser } : u)));
        resetForm();
        setShowModal(false);
    };

    // Delete a user
    const handleDelete = (userId) => {
        setUsers(users.filter((user) => user.id !== userId));
    };

    // Navigate to user details page
    const handleViewDetails = (userId) => {
        navigate(`/user/${userId}`);
    };

    // Reset form and state
    const resetForm = () => {
        setNewUser({
            firstname: '',
            lastname: '',
            birthday: '',
            sex: '',
            address: '',
            civilStatus: '',
            imageUrl: ''
        });
        setIsEditing(false);
        setEditUserId(null);
    };

    return (
        <div className="admin-user-modification-container">
            <div className="main-content">
                <div className="container">
                    <div className="text-center text-lg-start mt-4">
                        <h1 className="Maintext animated slideInRight">Admin User Modification</h1>
                        <p className="Subtext">Manage users</p>
                    </div>

                    {/* Add User Button */}
                    <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                        Add User
                    </button>

                    {/* User Table */}
                    <table className="table table-striped table-bordered mt-4">
                        <thead>
                            <tr>
                                <th>USERID</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">No users available</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td>
                                            <button
                                                className="btn btn-info me-2"
                                                onClick={() => handleViewDetails(user.id)}
                                            >
                                                View All Details
                                            </button>
                                            <button
                                                className="btn btn-warning me-2"
                                                onClick={() => handleEdit(user.id)}
                                            >
                                                Edit User
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete User
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Adding/Editing User */}
            {showModal && (
                <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Edit User' : 'Add User'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder="Firstname"
                                        value={newUser.firstname}
                                        onChange={handleChange}
                                        className="form-control mb-2"
                                    />
                                    <input
                                        type="text"
                                        name="lastname"
                                        placeholder="Lastname"
                                        value={newUser.lastname}
                                        onChange={handleChange}
                                        className="form-control mb-2"
                                    />
                                    <input
                                        type="date"
                                        name="birthday"
                                        placeholder="Birthday"
                                        value={newUser.birthday}
                                        onChange={handleChange}
                                        className="form-control mb-2"
                                    />
                                    <select
                                        name="sex"
                                        value={newUser.sex}
                                        onChange={handleChange}
                                        className="form-control mb-2"
                                    >
                                        <option value="">Select Sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={newUser.address}
                                        onChange={handleChange}
                                        className="form-control mb-2"
                                    />
                                    <select
                                        name="civilStatus"
                                        value={newUser.civilStatus}
                                        onChange={handleChange}
                                        className="form-control mb-2"
                                    >
                                        <option value="">Civil Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                    <input
                                        type="file"
                                        onChange={handleImageUpload}
                                        className="form-control mb-2"
                                    />
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={isEditing ? handleUpdateUser : handleAddUser}
                                >
                                    {isEditing ? 'Update User' : 'Add User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
