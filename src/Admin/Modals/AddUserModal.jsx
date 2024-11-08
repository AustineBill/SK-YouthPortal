import { useState } from 'react';

const AddUserModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');

    if (!isOpen) return null;

    const addUser = (e) => {
        e.preventDefault();
    }

    const closeComponent = () => {
        setName('');
        setAge('');
        setAddress('');
        onClose();
    }

    return (  
        <div className='add-user-modal-overlay'>
            <button className='close-button' onClick={ closeComponent }>Close</button>
            <div className='add-user-modal-container'>
                <form onSubmit={ addUser }>
                    <label>Name</label>
                    <input type='text' 
                    name="name" 
                    placeholder="Enter Name"
                    required
                    value={ name }
                    onChange={(e) => setName(e.target.value)} 
                    />
                    <label>Age</label>
                    <input type='number' 
                    name="age" 
                    placeholder="Enter Age"
                    required
                    value={ age }
                    onChange={(e) => setAge(e.target.value)} 
                    />
                    <label>Address</label>
                    <input type='text' 
                    name="address" 
                    placeholder="Enter Address"
                    required
                    value={ address }
                    onChange={(e) => setAddress(e.target.value)} 
                    />
                    <button type="submit">Add User</button>
                </form>
            </div>
        </div>
    );
}
 
export default AddUserModal;
