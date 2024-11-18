import { useState } from 'react';
import './styles/AdminManageContactUs.css';

const pageLabels = {
    manageContactDetails: 'Manage Contact Details',
    editContactDetails: 'Edit Contact Details'
};

const ManageContactUs = () => {
    const [activeContent, setActiveContent] = useState('manageContactDetails');

    return ( 
        <div className='admin-contact-us-container'>
            <div className='label-and-button-container'>
            <h2>{pageLabels[activeContent]}</h2>
                
                {activeContent !== 'manageContactDetails' && (
                    <button onClick={() => setActiveContent('manageContactDetails')}>Back</button>
                )}
            </div>

            <div className="component-contents-container">
                {activeContent === 'manageContactDetails' && (
                    <div className='contact-us-container'>
                        <button onClick={() => setActiveContent('editContactDetails')}>Edit Details</button>
                    </div>
                )}

                {activeContent === 'editContactDetails' && (
                    <div className='edit-contact-us-container'>
                        {/* Needs to be connected on database first to creata a logic and save the changes. */}
                        <button onClick={() => setActiveContent('manageContactDetails')}>Save Details</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageContactUs;
