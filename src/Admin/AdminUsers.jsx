import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './styles/usemod.css';
import './styles/AdminUsers.css';

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
        <div className="admin-users-container">
            <div className='user-label'>
                <h2>Manage Users</h2>
            </div>

            <div className="users-component-container">
                <button id="add-new-user-form" onClick={() => setShowModal(true)}>
                    Add User
                </button>

                <div className="users-list-container">
                    {/* <table className="table table-striped table-bordered mt-4"> */}
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

            

            {/* <div className="main-content">
                <div className="container">
                    <div className="text-center text-lg-start mt-4">
                        <h1 className="Maintext animated slideInRight">Admin User Modification</h1>
                        <p className="Subtext">Manage users</p>
                    </div> */}

                    {/* Add User Button */}
                    {/* <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                        Add User
                    </button> */}

                    {/* User Table */}
                    {/* <table className="table table-striped table-bordered mt-4">
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
            </div> */}

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
                                    <label>Name of Youth</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder="Firstname"
                                    />

                                    <label>Address</label>

                                    <label>Region</label>
                                    <input
                                        type="text"
                                        name="region"
                                        placeholder="Region"
                                        required
                                    />

                                    <label>Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        placeholder="Province"
                                        required
                                    />
                                    
                                    <label>City/Municipality</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City/Municipality"
                                        required
                                    />

                                    <label>Baragay</label>
                                    <input
                                        type="text"
                                        name="barangay"
                                        placeholder="Barangay"
                                        required
                                    />
                                    
                                    <label>Purok/Zone</label>
                                    <input
                                        type="text"
                                        name="zone"
                                        placeholder="Purok/Zone"
                                        required
                                    />

                                    <label>Sex Assigned at Birth</label>
                                    <select
                                        name="sex"
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>

                                    <label>Age</label>
                                    <input
                                        type="text"
                                        name="age"
                                        placeholder="Age"
                                        required
                                    />

                                    <label>Birthday</label>
                                    {/* Rej, pakilagyan nung calendar dito para sa bday. */}

                                    <label>E-mail Address</label>
                                    <input
                                        type="text"
                                        name="e-mail"
                                        placeholder="E-mail Address"
                                        required
                                    />

                                    <label>Contact Number</label>
                                    <input
                                        type="text"
                                        name="contact-number"
                                        placeholder="Contact Number"
                                        required
                                    />

                                    <label>Civil Status</label>
                                    <select
                                        name="civil-status"
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Annulled">Annulled</option>
                                        <option value="Unknown">Unknown</option>
                                        <option value="Live-in">Live-in</option>
                                    </select>

                                    <label>Youth Classification</label>
                                    <label>Youth Age Group</label>
                                    <select
                                        name="youth-age-group"
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Child Youth">Child Youth(15-17 yrs old)</option>
                                        <option value="Core Youth">Core Youth(18-24 yrs old)</option>
                                        <option value="Young Adult">Young Adult(25-30 yrs old)</option>
                                    </select>

                                    <label>Work Status</label>
                                    <select
                                        name="work-status"
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Employed">Employed</option>
                                        <option value="Unemployed">Unemployed</option>
                                        <option value="Self-Employed">Self-Employed</option>
                                        <option value="Currently looking for a job">Currently looking for a job</option>
                                        <option value="Not interested looking for a job">Not interested looking for a job</option>
                                    </select>

                                    <label>Educational Background</label>
                                    <select
                                        name="educational-background"
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Elementary Level">Elementary Level</option>
                                        <option value="Elementary Grad">Elementary Grad</option>
                                        <option value="High School Level">High School Level</option>
                                        <option value="High School Grad">High School Grad</option>
                                        <option value="Vocational Grad">Vocational Grad</option>
                                        <option value="College Level">College Level</option>
                                        <option value="College Grad">College Grad</option>
                                        <option value="Masters Level">Masters Level</option>
                                        <option value="Masters Grad">Masters Grad</option>
                                    </select>

                                    <label>Registered SK Voter?</label>
                                    <select
                                        name="registered-sk-voter"
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Male">Yes</option>
                                        <option value="Female">No</option>
                                    </select>

                                    <label>Registered National Voter?</label>
                                    <select
                                        name="registered-national-voter"
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
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
