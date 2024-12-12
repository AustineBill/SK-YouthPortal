import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AdminUsers.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        nameOfYouth: '',
        firstname: '',
        lastname: '',
        region: '',
        province: '',
        cityMunicipality: '',
        barangay: '',
        purokZone: '',
        sexAssignedAtBirth: '',
        age: '',
        birthday: '',
        emailAddress: '',
        contactNumber: '',
        civilStatus: '',
        youthClassification: '',
        youthAgeGroup: '',
        workStatus: '',
        educationalBackground: '',
        registeredSKVoter: '',
        registeredNationalVoter: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Fetch users from backend
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/users'); // Adjust endpoint as needed
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => {
            const updatedUser = { ...prev, [name]: value };
            console.log("Updated Form Data on Change:", updatedUser);  // Log the form data after each change
            return updatedUser;
        });
    };
    

    // Add a new user
    const handleAddUser = async () => {
        console.log("Form Data for Add User:", newUser);  // Print all the inputs when adding a user
        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser), 
            });
    
            if (response.ok) {
                const createdUser = await response.json();
                console.log("Created User:", createdUser);  // Debugging log to check createdUser object
                setUsers(prevUsers => [...prevUsers, createdUser]);
                resetForm();
                setShowModal(false);
            } else {
                console.error('Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
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
    const handleUpdateUser = async () => {
        console.log("Form Data for Update User:", newUser);  // Print all the inputs when updating a user
        try {
            const response = await fetch(`http://localhost:5000/users/${editUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
                setUsers(users.map((u) => (u.id === editUserId ? updatedUser : u)));
                console.log('User updated successfully:', updatedUser);
                resetForm();
                setShowModal(false);
            } else {
                console.error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Delete a user
    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(users.filter((user) => user.id !== userId));
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Navigate to user details page
    const handleViewDetails = (userId) => {
        navigate(`/users/${userId}`);
    };

    // Reset form and state
    const resetForm = () => {
        setNewUser({
            nameOfYouth: '',
            firstname: '',
            lastname: '',
            region: '',
            province: '',
            cityMunicipality: '',
            barangay: '',
            purokZone: '',
            sexAssignedAtBirth: '',
            age: '',
            birthday: '',
            emailAddress: '',
            contactNumber: '',
            civilStatus: '',
            youthClassification: '',
            youthAgeGroup: '',
            workStatus: '',
            educationalBackground: '',
            registeredSKVoter: '',
            registeredNationalVoter: ''
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
                                    <label>Name of Youth</label>
                                    <input
                                        type="text"
                                        name="nameOfYouth"
                                        value={newUser.nameOfYouth}
                                        onChange={handleChange}
                                        placeholder="Name of Youth"
                                        required
                                    />
                                    <label>Firstname</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={newUser.firstname}
                                        onChange={handleChange}
                                        placeholder="Firstname"
                                        required
                                    />
                                    <label>Lastname</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={newUser.lastname}
                                        onChange={handleChange}
                                        placeholder="Lastname"
                                        required
                                    />
                                    <label>Region</label>
                                    <input
                                        type="text"
                                        name="region"
                                        value={newUser.region}
                                        onChange={handleChange}
                                        placeholder="Region"
                                        required
                                    />
                                    <label>Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={newUser.province}
                                        onChange={handleChange}
                                        placeholder="Province"
                                        required
                                    />
                                    <label>City/Municipality</label>
                                    <input
                                        type="text"
                                        name="cityMunicipality"
                                        value={newUser.cityMunicipality}
                                        onChange={handleChange}
                                        placeholder="City/Municipality"
                                        required
                                    />
                                    <label>Barangay</label>
                                    <input
                                        type="text"
                                        name="barangay"
                                        value={newUser.barangay}
                                        onChange={handleChange}
                                        placeholder="Barangay"
                                        required
                                    />
                                    <label>Purok/Zone</label>
                                    <input
                                        type="text"
                                        name="purokZone"
                                        value={newUser.purokZone}
                                        onChange={handleChange}
                                        placeholder="Purok/Zone"
                                        required
                                    />
                                    <label>Sex Assigned at Birth</label>
                                    <select
                                        name="sexAssignedAtBirth"
                                        value={newUser.sexAssignedAtBirth}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={newUser.age}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        required
                                    />
                                    <label>Birthday</label>
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={newUser.birthday}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label>E-mail Address</label>
                                    <input
                                        type="email"
                                        name="emailAddress"
                                        value={newUser.emailAddress}
                                        onChange={handleChange}
                                        placeholder="E-mail Address"
                                        required
                                    />
                                    <label>Contact Number</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={newUser.contactNumber}
                                        onChange={handleChange}
                                        placeholder="Contact Number"
                                        required
                                    />
                                    <label>Civil Status</label>
                                    <select
                                        name="civilStatus"
                                        value={newUser.civilStatus}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                    <label>Youth Classification</label>
                                    <input
                                        type="text"
                                        name="youthClassification"
                                        value={newUser.youthClassification}
                                        onChange={handleChange}
                                        placeholder="Youth Classification"
                                        required
                                    />
                                    <label>Youth Age Group</label>
                                    <input
                                        type="text"
                                        name="youthAgeGroup"
                                        value={newUser.youthAgeGroup}
                                        onChange={handleChange}
                                        placeholder="Youth Age Group"
                                        required
                                    />
                                    <label>Work Status</label>
                                    <select
                                        name="workStatus"
                                        value={newUser.workStatus}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Employed">Employed</option>
                                        <option value="Unemployed">Unemployed</option>
                                    </select>
                                    <label>Educational Background</label>
                                    <input
                                        type="text"
                                        name="educationalBackground"
                                        value={newUser.educationalBackground}
                                        onChange={handleChange}
                                        placeholder="Educational Background"
                                        required
                                    />
                                    <label>Registered SK Voter?</label>
                                    <select
                                        name="registeredSKVoter"
                                        value={newUser.registeredSKVoter}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    <label>Registered National Voter?</label>
                                    <select
                                        name="registeredNationalVoter"
                                        value={newUser.registeredNationalVoter}
                                        onChange={handleChange}
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
