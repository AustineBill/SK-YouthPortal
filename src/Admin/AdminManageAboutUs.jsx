import { useState } from 'react';

const ManageAboutUs = () => {
    const [activeContent, setActiveContent] = useState('manageAboutDetails');

    return ( 
        <div>
            <div className='component-contents'>
                {activeContent === 'manageAboutDetails' && (
                    <div>
                        <h2>Manage About Us Details</h2>
                        <button onClick={() => setActiveContent('editAboutDetails')}>Edit Details</button>
                    </div>
                )}

                {activeContent === 'editAboutDetails' && (
                    <div>
                        <h2>Edit About Us Details</h2>
                        <button onClick={() => setActiveContent('manageAboutDetails')}>Back</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageAboutUs;
