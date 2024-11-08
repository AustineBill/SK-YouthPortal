import React, { useState } from 'react';
import './styles/ManageHomePage.css';

const ManageHomePage = () => {
    const [activeContent, setActiveContent] = useState('homeDetails');
    const [homeDetails, setHomeDetails] = useState({ title: '', description: '', imageUrl: '' });
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', imageUrl: '' });
    const [imagePreview, setImagePreview] = useState(null);

    const handleHomeDetailChange = (e) => {
        const { name, value } = e.target;
        setHomeDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e, isEvent = false) => {
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        if (isEvent) {
            setNewEvent(prev => ({ ...prev, imageUrl }));
        } else {
            setHomeDetails(prev => ({ ...prev, imageUrl }));
        }
        setImagePreview(imageUrl);
    };

    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.description || !newEvent.imageUrl) {
            alert('Please fill in all event details');
            return;
        }
        setEvents([...events, { ...newEvent, id: `${events.length + 1}` }]);
        setNewEvent({ title: '', description: '', imageUrl: '' });
        setImagePreview(null);
    };

    const handleSaveHomeDetails = () => {
        if (!homeDetails.title || !homeDetails.description) {
            alert('Please fill in both title and description');
            return;
        }
        alert('Homepage details saved successfully!');
    };

    return (
        <div className="adminhomepage-container">
            <h2>Manage Homepage</h2>

            {/* Navigation tabs */}
            <ul className="adminhomepage-nav-tabs">
                <li onClick={() => setActiveContent('homeDetails')}>Homepage Details</li>
                <li onClick={() => setActiveContent('events')}>All Events</li>
                <li onClick={() => setActiveContent('addEvent')}>Add Event</li>
            </ul>

            <div className="adminhomepage-content">
                {/* Homepage Details Section */}
                {activeContent === 'homeDetails' && (
                    <div className="adminhomepage-home-details">
                        <h3>Homepage Details</h3>
                        <div className="adminhomepage-input-group">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={homeDetails.title}
                                onChange={handleHomeDetailChange}
                                className="adminhomepage-input"
                            />
                        </div>
                        <div className="adminhomepage-input-group">
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={homeDetails.description}
                                onChange={handleHomeDetailChange}
                                className="adminhomepage-input"
                            />
                        </div>
                        <div className="adminhomepage-input-group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e)}
                                className="adminhomepage-input"
                            />
                        </div>
                        {homeDetails.imageUrl && (
                            <div className="adminhomepage-image-preview-container">
                                <img src={homeDetails.imageUrl} alt="Home Preview" className="adminhomepage-image-preview" />
                            </div>
                        )}
                        <button
                            onClick={handleSaveHomeDetails}
                            className="adminhomepage-btn adminhomepage-btn-primary"
                        >
                            Save Homepage Details
                        </button>
                    </div>
                )}

                {/* All Events Section */}
                {activeContent === 'events' && (
                    <div className="adminhomepage-events-section">
                        <h3>All Announcements and Events</h3>
                        {events.length === 0 ? (
                            <p>No events available</p>
                        ) : (
                            events.map(event => (
                                <div key={event.id} className="adminhomepage-event-item">
                                    <h4>{event.title}</h4>
                                    <p>{event.description}</p>
                                    <img src={event.imageUrl} alt="Event" className="adminhomepage-event-image" />
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Add Event Section */}
                {activeContent === 'addEvent' && (
                    <div className="adminhomepage-add-event">
                        <h3>Add New Event</h3>
                        <div className="adminhomepage-input-group">
                            <input
                                type="text"
                                placeholder="Event Title"
                                name="title"
                                value={newEvent.title}
                                onChange={handleEventChange}
                                className="adminhomepage-input"
                            />
                        </div>
                        <div className="adminhomepage-input-group">
                            <textarea
                                placeholder="Event Description"
                                name="description"
                                value={newEvent.description}
                                onChange={handleEventChange}
                                className="adminhomepage-input"
                            />
                        </div>
                        <div className="adminhomepage-input-group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, true)}
                                className="adminhomepage-input"
                            />
                        </div>
                        {imagePreview && (
                            <div className="adminhomepage-image-preview-container">
                                <img src={imagePreview} alt="Event Preview" className="adminhomepage-image-preview" />
                            </div>
                        )}
                        <button
                            onClick={handleAddEvent}
                            className="adminhomepage-btn adminhomepage-btn-primary"
                        >
                            Add Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageHomePage;
