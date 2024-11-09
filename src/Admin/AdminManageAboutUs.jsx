import { useState } from 'react';
import './styles/AdminManageAboutUs.css';

const ManageAboutUs = () => {
    const [activeContent, setActiveContent] = useState('manageAboutDetails');

    return ( 
        <div>
            <div className='component-contents-container'>
                {activeContent === 'manageAboutDetails' && (
                    <div className='about-us-container'>
                        {/* <h2>Manage About Us Details</h2> */}
                        <div className='about-us-text'>
                            <h2>Manage About Us Details</h2>
                        </div>
                        <div className='about-us-details-container'>
                            <button onClick={() => setActiveContent('editAboutDetails')}>Edit Details</button>
                        </div>
                    </div>
                )}

                {activeContent === 'editAboutDetails' && (
                    <div className='edit-about-us-container'>
                        <div className='edit-about-us-text-and-button'>
                            <h2>Edit About Us Details</h2>
                            <button onClick={() => setActiveContent('manageAboutDetails')}>Back</button>
                        </div>
                        <div className='edit-about-us-details-container'>
                            {/* Needs to be connected on database first to creata a logic and save the changes. */}
                            <button onClick={() => setActiveContent('manageAboutDetails')}>Save Details</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageAboutUs;
