import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Admin-CSS.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Labels for navigation
const pageLabels = {
  events: 'Manage Events',
  addEvent: 'Add New Event',
};

const ManageHomePage = () => {
  const [activeContent, setActiveContent] = useState('events');
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    amenities: '',
    imageBase64: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // For editing event
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events');
        const updatedEvents = response.data.map((event) => ({
          ...event,
          event_image: event.event_image_base64
            ? `data:image/jpeg;base64,${event.event_image_base64}` // Adjust image prefix if needed
            : 'https://via.placeholder.com/100',
        }));
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array ensures it runs only once on component mount

  // Handle input changes for event details
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Convert image to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max size
      if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }

      try {
        const base64Image = await convertToBase64(file);
        setNewEvent((prevState) => ({
          ...prevState,
          imageBase64: base64Image.split(',')[1], // Store Base64 string without the prefix
        }));
        setImagePreview(base64Image); // Preview the image
      } catch (error) {
        console.error('Error converting image to Base64:', error);
      }
    }
  };

  // Check if event name already exists in the events list
  const isDuplicateEvent = (eventName) => {
    return events.some(event => event.event_name.toLowerCase() === eventName.toLowerCase());
  };

  // Handle adding a new event with duplicate prevention
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.amenities || !newEvent.imageBase64) {
      alert('Please fill in all event details');
      return;
    }

    // Check for duplicate event title
    if (isDuplicateEvent(newEvent.title)) {
      alert('An event with this name already exists. Please choose a different name.');
      return;
    }

    const eventData = {
      event_name: newEvent.title,
      event_description: newEvent.description,
      amenities: newEvent.amenities,
      event_image: newEvent.imageBase64,
    };

    try {
      const response = await axios.post('http://localhost:5000/events', eventData);
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setNewEvent({ title: '', description: '', amenities: '', imageBase64: '' });
      setImagePreview(null);
      setActiveContent('events');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please check the console for details.');
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/events/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  // Handle event edit
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.event_name,
      description: event.event_description,
      amenities: event.amenities,
      imageBase64: event.event_image, // Set the event's image directly
    });
    setShowEditModal(true);
  };

  // Handle event update
  const handleUpdateEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.amenities || !newEvent.imageBase64) {
      alert('Please fill in all event details');
      return;
    }

    const eventData = {
      event_name: newEvent.title,
      event_description: newEvent.description,
      amenities: newEvent.amenities,
      event_image: newEvent.imageBase64,
    };

    try {
      await axios.put(`http://localhost:5000/events/${selectedEvent.id}`, eventData);
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === selectedEvent.id ? { ...event, ...eventData } : event))
      );
      setShowEditModal(false);
      setNewEvent({ title: '', description: '', amenities: '', imageBase64: '' });
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event.');
    }
  };

  // Handle drag and drop reordering of events
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    const reorderedEvents = Array.from(events);
    const [removed] = reorderedEvents.splice(source.index, 1);
    reorderedEvents.splice(destination.index, 0, removed);

    setEvents(reorderedEvents);

    // You may want to update the backend with the new order here
  };

  return (
    <div className="admin-home-container d-flex flex-column">
      <div className="admin-home-label">
        <h2 className="admin-home-label-h2 fst-italic">Manage Homepage</h2>
      </div>

      <ul className="admin-home-nav-tabs list-unstyled d-flex">
        <li className={activeContent === 'events' ? 'active-tab' : ''} onClick={() => setActiveContent('events')}>
          All Events
        </li>
        <li className={activeContent === 'addEvent' ? 'active-tab' : ''} onClick={() => setActiveContent('addEvent')}>
          Add Event
        </li>
      </ul>

      <div className="admin-home-contents-container d-flex justify-content-center">
        {activeContent === 'events' && (
          <div className="admin-all-event-details-container d-flex justify-content-center">
            {events.length === 0 ? (
              <p>No events available</p>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="events" direction="vertical">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {events.map((event, index) => (
                        <Draggable key={event.id} draggableId={event.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              className="admin-event-item d-flex"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <img
                                src={event.event_image || 'https://via.placeholder.com/100'}
                                alt={event.event_name}
                                className="event-image"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100';
                                }}
                              />
                              <div>
                                <h3>{event.event_name}</h3>
                                <p>{event.event_description}</p>
                                <button onClick={() => handleEditEvent(event)} className="admin-edit-event-button rounded">
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteEvent(event.id)} className="admin-delete-event-button rounded">
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        )}

        {activeContent === 'addEvent' && (
          <form className="admin-add-event-details-group">
            <label>Event Name</label>
            <input type="text" name="title" value={newEvent.title} onChange={handleEventChange} />

            <label>Event Description</label>
            <textarea name="description" value={newEvent.description} onChange={handleEventChange} />

            <label>Amenities</label>
            <input type="text" name="amenities" value={newEvent.amenities} onChange={handleEventChange} />

            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && <img src={imagePreview} alt="Preview" />}

            <button onClick={handleAddEvent} type="button">
              Add Event
            </button>
          </form>
        )}

        {showEditModal && (
          <div className="admin-edit-modal">
            <div className="modal-content">
              <h3>Edit Event</h3>
              <label>Event Name</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleEventChange}
              />
              <label>Event Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleEventChange}
              />
              <label>Amenities</label>
              <input
                type="text"
                name="amenities"
                value={newEvent.amenities}
                onChange={handleEventChange}
              />
              <button onClick={handleUpdateEvent}>Update Event</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageHomePage;
