import { useState } from 'react';

const ManageContactUs = () => {
    const [activeContent, setActiveContent] = useState('manageContactDetails');

    return ( 
        <div>
            <div className="component-contents">
                {activeContent === 'manageContactDetails' && (
                    <div>
                        <h2>Manage Contact Details</h2>
                        <button onClick={() => setActiveContent('editContactDetails')}>Edit Details</button>
                    </div>
                )}

                {activeContent === 'editContactDetails' && (
                    <div>
                        <h2>Edit Contact Details</h2>
                        <button onClick={() => setActiveContent('manageContactDetails')}>Back</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageContactUs;
