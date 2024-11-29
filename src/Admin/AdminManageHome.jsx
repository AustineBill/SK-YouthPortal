import React, { useState } from 'react';
import './styles/AdminManageHome.css';

const ManageHomePage = () => {
    const [activeContent, setActiveContent] = useState('events');
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', imageUrl: '' });
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageUpload = (e, isEvent = false) => {
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        if (isEvent) {
            setNewEvent(prev => ({ ...prev, imageUrl }));
        } 
        else {
        setImagePreview(imageUrl);
        }
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

    return (
        <div className="admin-home-container">
            <div className='label'>
                <h2>Manage Homepage</h2>
            </div>
            
            {/* Navigation tabs */}
            <ul className="home-nav-tabs">
                <li
                    className={activeContent === "events" ? "active-tab" : ""}
                    onClick={() => setActiveContent("events")}
                >
                    All Announcements/Events
                </li>
                <li
                    className={activeContent === "addEvent" ? "active-tab" : ""}
                    onClick={() => setActiveContent("addEvent")}
                >
                    Add Event
                </li>
            </ul>

            <div className="home-contents-container">
                {/* All Events Section */}
                {activeContent === 'events' && (
                    <div className="events-details-container">
                        {/* <h3>All Announcements and Events</h3> */}
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
                    <div className="add-event-container">
                        {/* <h3>Add New Event</h3> */}
                        <div className="add-event-group">
                            <label>Event Name</label>
                            <input
                                type="text"
                                placeholder="Event Title"
                                name="title"
                                value={newEvent.title}
                                onChange={handleEventChange}
                                className="adminhomepage-input"
                            />

                            <label>Event Description</label>
                            <textarea
                                placeholder="Event Description"
                                name="description"
                                value={newEvent.description}
                                onChange={handleEventChange}
                                className="adminhomepage-input"
                            />

                            <label>Amenities</label>
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
                            id="add-new-details-button"
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
