import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdminManageAboutUs.css';

const pageLabels = {
    manageAboutDetails: 'Manage About Us Details',
    editAboutDetails: 'Edit About Us Details'
};

const ManageAboutUs = () => {
    const [activeContent, setActiveContent] = useState('manageAboutDetails');
    const [description, setDescription] = useState('');
    const [newDescription, setNewDescription] = useState('');

    // Fetch description on component mount
    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const response = await axios.get('http://localhost:5000/Website/description');
                setDescription(response.data.description);
                setNewDescription(response.data.description);
            } catch (error) {
                console.error('Error fetching description:', error);
            }
        };

        fetchDescription();
    }, []);

    // Save updated description
    const saveDescription = async () => {
        try {
            await axios.put('http://localhost:5000/Website/description', { description: newDescription });
            setDescription(newDescription);
            setActiveContent('manageAboutDetails');
        } catch (error) {
            console.error('Error saving description:', error);
        }
    };

    return ( 
        <div className='admin-about-us-container'>
            <div className='label-and-button-container'>
                <h2>{pageLabels[activeContent]}</h2>
                {activeContent !== 'manageAboutDetails' && (
                    <button onClick={() => setActiveContent('manageAboutDetails')}>Back</button>
                )}
            </div>

            <div className='component-contents-container'>
                {activeContent === 'manageAboutDetails' && (
                    <div className='about-us-container'>
                        <p>{description}</p>
                        <button onClick={() => setActiveContent('editAboutDetails')}>Edit Details</button>
                    </div>
                )}

                {activeContent === 'editAboutDetails' && (
                    <div className='edit-about-us-container'>
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        ></textarea>
                        <button onClick={saveDescription}>Save Details</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAboutUs;
