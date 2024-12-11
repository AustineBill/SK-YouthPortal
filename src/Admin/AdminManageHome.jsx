import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdminManageHome.css';

const pageLabels = {
  events: 'Manage Events',
  addEvent: 'Add New Event'
};

const ManageHomePage = () => {
  const [activeContent, setActiveContent] = useState('events');
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    amenities: '',
    image: '',
    imageFormat: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []); // Runs once when the component mounts

  // Handle input changes for event details
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle image file upload
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max size

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check if file exceeds max size
      if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }
  
      // Preview image
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1]; // Get base64 string part
        setNewEvent((prevState) => ({
          ...prevState,
          image: base64Image, // Save base64 string
          imageFormat: file.type.split('/')[1], // Save image format (e.g., 'jpg', 'png')
        }));
      };
  
      reader.readAsDataURL(file);
    }
  };

  // Handle adding a new event
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.amenities || !newEvent.image) {
      alert('Please fill in all event details');
      return;
    }
  
    const eventData = {
      event_name: newEvent.title,
      event_description: newEvent.description,
      amenities: newEvent.amenities,
      event_image: newEvent.image,
      event_image_format: newEvent.imageFormat,
    };
  
    console.log('Sending event data to backend:', eventData);
  
    try {
      const response = await axios.post('http://localhost:5000/events', eventData);
  
      console.log('Event added successfully:', response.data);
  
      // Update the state with the new event without re-fetching
      setEvents((prevEvents) => [...prevEvents, response.data]);
  
      // Reset form after adding the event
      setNewEvent({
        title: '',
        description: '',
        amenities: '',
        image: '',
        imageFormat: '',
      });
      setImagePreview(null);
      setActiveContent('events');
    } catch (error) {
      console.error('Error adding event:', error.response?.data || error.message);
      if (error.response?.data?.error === 'Event with this name already exists') {
        alert('An event with this name already exists. Please choose a different name.');
      } else {
        alert('Failed to add event. Please check the console for details.');
      }
    }
  };
  

  // Handle deleting an event
  const handleDeleteEvent = async (eventId) => {
    if (!eventId) {
      alert('Event ID is missing');
      return;
    }

    try {
      // Delete the event by its ID
      const response = await axios.delete(`http://localhost:5000/events/${eventId}`);
      
      // Remove the deleted event from the state without re-fetching
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
      
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  return (
    <div className="admin-home-container">
      <div className="label-and-button-container">
        <h2>{pageLabels[activeContent]}</h2>
        {activeContent !== 'events' && (
          <button onClick={() => setActiveContent('events')}>Back to Events</button>
        )}
      </div>

      <div className="component-contents-container">
        {/* All Events Section */}
        {activeContent === 'events' && (
          <div className="events-list">
            {events.length === 0 ? (
              <p>No events available</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="event-item">
                  <h3>{event.event_name}</h3>
                  <p>{event.event_description}</p>
                  <img
                    src={`data:image/${event.event_image_format};base64,${event.event_image}`}
                    alt={event.event_name}
                    className="event-image"
                  />
                  <button onClick={() => handleDeleteEvent(event.id)}>Delete Event</button>
                </div>
              ))
            )}
            <button onClick={() => setActiveContent('addEvent')}>Add New Event</button>
          </div>
        )}

        {/* Add Event Section */}
        {activeContent === 'addEvent' && (
          <div className="add-event-form">
            <div className="input-container">
              <label>Event Title</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleEventChange}
                placeholder="Event Title"
              />
            </div>

            <div className="input-container">
              <label>Event Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleEventChange}
                placeholder="Event Description"
              />
            </div>

            <div className="input-container">
              <label>Amenities</label>
              <input
                type="text"
                name="amenities"
                value={newEvent.amenities}
                onChange={handleEventChange}
                placeholder="Event Amenities"
              />
            </div>

            <div className="input-container">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>

            <button onClick={handleAddEvent}>Add Event</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageHomePage;
