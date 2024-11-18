import { useState } from 'react';
import './styles/AdminManageAboutUs.css';

const pageLabels = {
    manageAboutDetails: 'Manage About Us Details',
    editAboutDetails: 'Edit About Us Details'
};

const ManageAboutUs = () => {
    const [activeContent, setActiveContent] = useState('manageAboutDetails');

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
                        <button onClick={() => setActiveContent('editAboutDetails')}>Edit Details</button>
                    </div>
                )}

                {activeContent === 'editAboutDetails' && (
                    <div className='edit-about-us-container'>
                        {/* Needs to be connected on database first to creata a logic and save the changes. */}
                        <button onClick={() => setActiveContent('manageAboutDetails')}>Save Details</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageAboutUs;
