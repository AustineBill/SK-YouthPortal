import { useState } from 'react';
import { Link } from 'react-router-dom';

const ManageHomePage = () => {
    const [activeContent, setActiveContent] = useState('manageDetails');

    return (
        <div>
            <ul>
                <li onClick={() => setActiveContent('manageDetails')}>
                    Manage Details
                </li>
                <li onClick={() => setActiveContent('allAnnouncementsAndEvents')}>
                    All Announcements/Events
                </li>
                <li onClick={() => setActiveContent('addNew')}>
                    Add New
                </li>
            </ul>

            {/* Conditional Rendering of Components */}
            <div className="component-contents">
                {activeContent === 'manageDetails' && (
                    <div>
                        <h2>Manage Details</h2>
                        <Link to="/admin/edit-home-details">
                            <button>Edit Details</button>
                        </Link>
                    </div>
                )}

                {activeContent === 'allAnnouncementsAndEvents' && (
                    <div>
                        <h2>All Announcements/Events</h2>
                    </div>
                )}

                {activeContent === 'addNew' && (
                    <div>
                        <h2>Add New</h2>
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

export default ManageHomePage;
