import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Admin-CSS.css";
import { CardFooter, Card } from "react-bootstrap";

const ManageHomePage = () => {
  const [activeContent, setActiveContent] = useState("events");
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // For editing event
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEvent((prev) => ({ ...prev, image: file }));
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // Check if event name already exists in the events list
  const isDuplicateEvent = (eventName) => {
    return events.some(
      (event) => event.event_name.toLowerCase() === eventName.toLowerCase()
    );
  };

  // Handle adding a new event with duplicate prevention
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.image) {
      alert("Please fill in all event details");
      return;
    }

    // Check for duplicate event title
    if (isDuplicateEvent(newEvent.title)) {
      alert(
        "An event with this name already exists. Please choose a different name."
      );
      return;
    }

    const formData = new FormData();
    formData.append("event_name", newEvent.title);
    formData.append("event_description", newEvent.description);
    formData.append("event_image", newEvent.image);

    try {
      const response = await axios.post(
        "http://localhost:5000/events",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEvents((prevEvents) => [...prevEvents, response.data]);
      setNewEvent({ title: "", description: "", image: "" });
      setImagePreview(null);
      setActiveContent("events");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please check the console for details.");
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/events/${eventId}`);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  // Handle event edit
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.event_name,
      description: event.event_description,
      amenities: event.amenities,
      image: event.event_image, // Set the event's image directly
    });
    setShowEditModal(true);
  };

  // Handle event update
  const handleUpdateEvent = async () => {
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.amenities ||
      !newEvent.image
    ) {
      alert("Please fill in all event details");
      return;
    }

    const eventData = {
      event_name: newEvent.title,
      event_description: newEvent.description,
      amenities: newEvent.amenities,
      event_image: newEvent.image,
    };

    try {
      await axios.put(
        `http://localhost:5000/events/${selectedEvent.id}`,
        eventData
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...eventData } : event
        )
      );
      setShowEditModal(false);
      setNewEvent({ title: "", description: "", image: "" });
      setImagePreview(null);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  return (
    <div className="admin-home-container d-flex flex-column">
      <div className="admin-home-label">
        <h2 className="admin-home-label-h2 fst-italic">Manage Homepage</h2>
      </div>

      <ul className="admin-home-nav-tabs list-unstyled d-flex">
        <li
          className={activeContent === "events" ? "active-tab" : ""}
          onClick={() => setActiveContent("events")}
        >
          All Events
        </li>
        <li
          className={activeContent === "addEvent" ? "active-tab" : ""}
          onClick={() => setActiveContent("addEvent")}
        >
          Add Event
        </li>
      </ul>

      <div className="admin-home-contents-container d-flex justify-content-center">
        {activeContent === "events" && (
          <div className="card-container">
            {events.length === 0 ? (
              <p>No events available</p>
            ) : (
              events.map((events) => (
                <Card key={events.id} className="ProgramCard">
                  <Card.Img
                    variant="top"
                    src={events.event_image}
                    className="program-card-img"
                  />
                  <Card.Body>
                    <Card.Title>{events.event_name}</Card.Title>
                    <Card.Text>{events.event_description}</Card.Text>
                  </Card.Body>
                  <CardFooter>
                    <button
                      onClick={() => handleEditEvent(events)}
                      className="admin-edit-event-button rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(events.id)}
                      className="admin-delete-event-button rounded"
                    >
                      Delete
                    </button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}

        {activeContent === "addEvent" && (
          <form className="admin-add-event-details-group">
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
