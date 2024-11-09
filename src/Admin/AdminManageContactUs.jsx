import { useState } from 'react';
import './styles/AdminManageContactUs.css';

const ManageContactUs = () => {
    const [activeContent, setActiveContent] = useState('manageContactDetails');

    return ( 
        <div>
            <div className="component-contents">
                {activeContent === 'manageContactDetails' && (
                    <div className='manage-contact-details-container'>
                        <h2>Manage Contact Details</h2>
                        <div className='current-contact-details-container'>
                            <button onClick={() => setActiveContent('editContactDetails')}>Edit Details</button>
                        </div>
                    </div>
                )}

                {activeContent === 'editContactDetails' && (
                    <div className='edit-manage-contact-details-container'>
                        <div className='about-us-text-and-back'>
                            <h2>Edit Contact Details</h2>
                            <button onClick={() => setActiveContent('manageContactDetails')}>Back</button>
                        </div>
                        <div className='edit-current-contact-details-container'>
                            <button onClick={() => setActiveContent('manageContactDetails')}>Save Details</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageContactUs;
