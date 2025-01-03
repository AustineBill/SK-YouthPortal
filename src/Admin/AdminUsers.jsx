import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import './styles/AdminUsers.css';

const Users = () => {

    const generatePassword = () => {
        return Math.floor(10000 + Math.random() * 90000).toString();
    };
    
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: 'User',
        password: generatePassword(),
        firstname: '',
        lastname: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        zone: '',
        sex: '',
        age: '',
        birthday: '',
        email_address: '',
        contact_number: '',
        civil_status: '',
        youth_age_group: '',
        work_status: '',
        educational_background: '',
        registered_sk_voter: '',
        registered_national_voter: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [DeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [viewUser, setViewUser] = useState(null); // Store the user data to view
    const [showViewModal, setShowViewModal] = useState(false); // To control the modal visibility
    const [selectedClassification, setSelectedClassification] = useState('');
    const youthClassifications = ['Child Youth', 'Core Youth', 'Adult Youth',];  // Add your classifications here

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
    
        // If the input is for 'birthday', calculate the age
        if (name === 'birthday') {
            const age = calculateAge(value); // Calculate age based on the birthday
            setNewUser((prev) => {
                // Automatically assign the youth age group based on the calculated age
                let youthClassification = '';
                if (age >= 15 && age <= 17) {
                    youthClassification = 'Child Youth';
                } else if (age >= 18 && age <= 24) {
                    youthClassification = 'Core Youth';
                } else if (age >= 25 && age <= 30) {
                    youthClassification = 'Adult Youth';
                } else if (age > 30) {
                    alert("Cannot add user. Age is over the limit.");
                    return prev; // Prevent setting the user if age exceeds 30
                }
    
                // Set the new user state with calculated age and youth classification
                return {
                    ...prev,
                    birthday: value,
                    age: age, // Set the calculated age
                    youth_age_group: youthClassification, // Automatically set youth classification
                };
            });
        } else {
            // Handle other fields (non-birthday)
            setNewUser((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Add a new user
    const handleAddUser = async () => {
        //console.log("Form Data for Add User:", newUser);  // Log the user data before sending

        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser), // Send the data as JSON
            });

            if (response.ok) {
                const createdUser = await response.json();  // Receive the created user response from backend
                //console.log("Created User:", createdUser);  // Log the created user to ensure it's correct

                // Update the users state to reflect the newly added user
                setUsers(prevUsers => [...prevUsers, createdUser]);

                // Reset the form fields after adding the user
                resetForm();
                setShowModal(false);  // Close the modal after adding the user
            } else {
                console.error('Failed to add user. Response not OK.');
            }
        } catch (error) {
            console.error('Error adding user:', error);  // Catch any errors from the fetch
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
        //console.log("Form Data for Update User:", newUser);  // Print all the inputs when updating a user
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
                //console.log('User updated successfully:', updatedUser);
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
                setDeleteModalVisible(false);  // Close the modal after successful deletion
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const openDeleteModal = (userId) => {
        setDeleteUserId(userId);  // Store the user ID to be deleted
        setDeleteModalVisible(true);
    };

    const handleViewDetails = (userId) => {
        const user = users.find((u) => u.id === userId);
        setViewUser(user);  // Set the user data to view
        setShowViewModal(true);  // Open the modal
    };

    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Reset form and state
    const resetForm = () => {
        setNewUser({
            username: 'User',
            password: generatePassword(),
            firstname: '',
            lastname: '',
            region: '',
            province: '',
            city: '',
            barangay: '',
            zone: '',
            sex: '',
            age: '',
            birthday: '',
            email_address: '',
            contact_number: '',
            civil_status: '',
            youth_age_group: '',
            work_status: '',
            educational_background: '',
            registered_sk_voter: '',
            registered_national_voter: ''
        });
        setIsEditing(false);
        setEditUserId(null);
    };

    const filteredUsers = selectedClassification
        ? users.filter((user) => user.youth_age_group === selectedClassification)
        : users;


    return (
        <div className='admin-users-container'>
            <div className='admin-users-label'>
                <h2 className='admin-users-label-h2 fst-italic'>Manage Users</h2>
            </div>

            <div className='admin-users-add-user-container position-fixed'>
                <button className='admin-users-add-user-button rounded'
                    onClick={() => setShowModal(true)}>
                    Add User
                </button>
            </div>

            <div className="admin-users-contents-container d-flex flex-column align-items-center justify-content-center">

                <div className='admin-users-classification-container'>
                    <select
                        value={selectedClassification}
                        onChange={(e) => setSelectedClassification(e.target.value)}
                        className='admin-users-classification rounded'
                    >
                        <option value=''>Select Youth Classification</option>
                        {youthClassifications.map((classification, index) => (
                            <option key={index} value={classification}>
                                {classification}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="users-list-container">
                    <Table className="admin-users-table-container table-bordered">
                        <thead className='admin-users-head text-center'>
                            <tr>
                                <th>User ID</th>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Youth Classification</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody className='admin-users-body text-center'>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No users found for this classification</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td>{user.youth_age_group}</td>
                                        <td>
                                            <div className='admin-users-actions-buttons-container d-flex justify-content-center'>
                                                <Button
                                                    variant='primary'
                                                    onClick={() => handleViewDetails(user.id)}
                                                    className='admin-users-view-button rounded-pill'
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant='warning'
                                                    onClick={() => handleEdit(user.id)}
                                                    className='admin-users-edit-button rounded-pill'
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant='danger'
                                                    onClick={() => openDeleteModal(user.id)}
                                                    className='admin-users-delete-button rounded-pill'
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {DeleteModalVisible && (
                <div
                    className='admin-users-delete-confirmation-modal ModalOverlayStyles'
                // backdrop="static"
                // keyboard={false}
                >
                    {/* <div className='ModalOverlayStyles'> */}
                    {/* <div className='admin-users-delete-confirmation-modal'> */}
                    <div className='ModalStyles semi-large'>
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this user?</p>
                        <button
                            className="ModalButtonStyles SmallButton btn-dark super-small"
                            onClick={() => handleDelete(deleteUserId)} >Yes</button>
                        <button className="ModalButtonStyles SmallButton btn-db super-small"
                            onClick={() => setDeleteModalVisible(false)}>No</button>
                    </div>
                </div>
            )}


            {showViewModal && viewUser && (
                <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">View User Details</h5>
                                <button type="button" className="close" onClick={() => setShowViewModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div><strong>Username:</strong> {viewUser.username}</div>
                                <div><strong>Firstname:</strong> {viewUser.firstname}</div>
                                <div><strong>Lastname:</strong> {viewUser.lastname}</div>
                                <div><strong>Youth Classification:</strong> {viewUser.youth_age_group}</div>
                                <div><strong>Email Address:</strong> {viewUser.email_address}</div>
                                <div><strong>Contact Number:</strong> {viewUser.contact_number}</div>
                                <div><strong>Age:</strong> {viewUser.age}</div>
                                <div><strong>Sex:</strong> {viewUser.sex}</div>
                                <div><strong>Work Status:</strong> {viewUser.work_status}</div>
                                <div><strong>Educational Background:</strong> {viewUser.educational_background}</div>
                                <div><strong>Birthday:</strong> {viewUser.birthday}</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal for Adding/Editing User */}
            {showModal && (
                <div className="admin-users-add-edit-modal modal open" style={{ display: 'block' }} tabIndex="-1" role="dialog" >
                    {/* <div className="admin-users-add-edit-modal"> */}
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Edit User' : 'Add User'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>

                            <div className="admin-users-add-edit-modal-body modal-body">
                                <form className='admin-users-add-edit-details-group d-flex flex-column align-items-center m-0 p-0'>
                                    <div className='admin-users-form d-flex flex-column'>
                                        <label className='admin-users-modal-label'>Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={newUser.username}
                                            onChange={handleChange}
                                            placeholder="Username"
                                            required
                                        />
                                    </div>

                                    <div className='admin-users-form d-flex flex-column'>
                                        <label className='admin-users-modal-label'>Password</label>
                                        <input
                                            type="text"
                                            name="password"
                                            value={newUser.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                        />
                                    </div>

                                    <div className='admin-users-group1-form-container d-flex align-items-center'>
                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Firstname</label>
                                            <input
                                                type="text"
                                                name="firstname"
                                                value={newUser.firstname}
                                                onChange={handleChange}
                                                placeholder="Firstname"
                                                required
                                            />
                                        </div>

                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Lastname</label>
                                            <input
                                                type="text"
                                                name="lastname"
                                                value={newUser.lastname}
                                                onChange={handleChange}
                                                placeholder="Lastname"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className='admin-users-group2-form-container d-flex align-items-center'>
                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Region</label>
                                            <input
                                                type="text"
                                                name="region"
                                                value={newUser.region}
                                                onChange={handleChange}
                                                placeholder="Region"
                                                required
                                            />
                                        </div>

                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Province</label>
                                            <input
                                                type="text"
                                                name="province"
                                                value={newUser.province}
                                                onChange={handleChange}
                                                placeholder="Province"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className='admin-users-form d-flex flex-column'>
                                        <label className='admin-users-modal-label'>City/Municipality</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={newUser.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            required
                                        />
                                    </div>

                                    <div className='admin-users-group3-form-container d-flex align-items-center'>
                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Barangay</label>
                                            <input
                                                type="text"
                                                name="barangay"
                                                value={newUser.barangay}
                                                onChange={handleChange}
                                                placeholder="Barangay"
                                                required
                                            />
                                        </div>

                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Purok/Zone</label>
                                            <input
                                                type="text"
                                                name="zone"
                                                value={newUser.zone}
                                                onChange={handleChange}
                                                placeholder="Zone"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className='admin-users-group4-form-container d-flex align-items-center'>
                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Sex Assigned at Birth</label>
                                            <select
                                                name="sex"
                                                value={newUser.sex}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Option</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>

                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={newUser.age}
                                                onChange={handleChange}
                                                placeholder="Age"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className='admin-users-form d-flex flex-column'>
                                        <label className='admin-users-modal-label'>Birthday</label>
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={newUser.birthday}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className='admin-users-form d-flex flex-column'>
                                        <label className='admin-users-modal-label'>E-mail Address</label>
                                        <input
                                            type="email"
                                            name="email_address"
                                            value={newUser.email_address}
                                            onChange={handleChange}
                                            placeholder="E-mail Address"
                                            required
                                        />
                                    </div>

                                    <div className='admin-users-form d-flex flex-column'>
                                        <label className='admin-users-modal-label'>Contact Number</label>
                                        <input
                                            type="text"
                                            name="contact_number"
                                            value={newUser.contact_number}
                                            onChange={handleChange}
                                            placeholder="Contact Number"
                                            required
                                        />
                                    </div>

                                    <div className='admin-users-group5-form-container d-flex align-items-center'>
                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Civil Status</label>
                                            <select
                                                name="civil_status"
                                                value={newUser.civil_status}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Option</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                            </select>
                                        </div>
                                            <div className='admin-users-form d-flex flex-column'>
                                                <label className='admin-users-modal-label'>Youth Age Group</label>
                                                <input
                                                    type="text"
                                                    name="youth_age_group"
                                                    value={newUser.youth_age_group || ''}
                                                    readOnly
                                                    disabled
                                                />
                                        </div>
                                    </div>

                                    <div className='admin-users-group6-form-container d-flex align-items-center'>
                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Work Status</label>
                                            <select
                                                name="work_status"
                                                value={newUser.work_status}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Option</option>
                                                <option value="Employed">Employed</option>
                                                <option value="Unemployed">Unemployed</option>
                                            </select>
                                        </div>

                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Educational Background</label>
                                            <select
                                                name="educational_background"
                                                value={newUser.educational_background}
                                                onChange={handleChange}
                                                placeholder="Educational Background"
                                                required
                                            >
                                                <option value="">Select Option</option>
                                                <option value="High School">High School</option>
                                                <option value="College">College</option>
                                                <option value="College Graduate">College Graduate</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='admin-users-group7-form-container d-flex align-items-center'>
                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Registered SK Voter?</label>
                                            <select
                                                name="registered_sk_voter"
                                                value={newUser.registered_sk_voter}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>

                                        <div className='admin-users-form d-flex flex-column'>
                                            <label className='admin-users-modal-label'>Registered National Voter?</label>
                                            <select
                                                name="registered_national_voter"
                                                value={newUser.registered_national_voter}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="admin-users-add-edit-modal-footer modal-footer">
                                <button
                                    type="button"
                                    className="admin-users-close-button btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="admin-users-update-add-button btn-primary"
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
