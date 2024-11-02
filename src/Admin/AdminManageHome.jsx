import { useState } from 'react';

const NavigationLinks = ({ setActiveContent }) => {
    return (
        <ul className="sidebar-links">
            <li onClick={() => setActiveContent('manageDetails')}>Manage Details</li>
            <li onClick={() => setActiveContent('allAnnouncementsAndEvents')}>All Announcements/Events</li>
            <li onClick={() => setActiveContent('addNew')}>Add New</li>
        </ul>
    );
};

const ManageHome = () => {
    const [activeContent, setActiveContent] = useState('manageDetails');
    const [editDetails, setEditDetails] = useState(false);

    return (
        <div>
            {/* Conditional Rendering of Components */}
            <div className="component-contents">
                {activeContent === 'manageDetails' && !editDetails && (
                    <div>
                        <h2>Manage Details</h2>
                        <NavigationLinks setActiveContent={setActiveContent} />
                        <button onClick={() => setEditDetails(true)}>Edit Details</button>
                    </div>
                )}

                {activeContent === 'manageDetails' && editDetails && (
                    <div className='New'>
                        <h1>Try</h1>
                        <button onClick={() => setEditDetails(false)}>Back</button>
                    </div>
                )}

                {activeContent === 'allAnnouncementsAndEvents' && (
                    <div>
                        <h2>All Announcements/Events</h2>
                        <NavigationLinks setActiveContent={setActiveContent} />
                    </div>
                )}

                {activeContent === 'addNew' && (
                    <div>
                        <h2>Add New</h2>
                        <NavigationLinks setActiveContent={setActiveContent} />
                        <form>
                            <input type="text" placeholder="Name of Announcement/Event" />
                            <input type="text" placeholder="Blah" />
                            <button>Submit</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageHome;
