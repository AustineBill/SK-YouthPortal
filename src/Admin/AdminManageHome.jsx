import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import "./styles/AdminManageHome.css";
// import '../WebStyles/Admin-CSS.css';

const ManageHomePage = () => {
  const [activeContent, setActiveContent] = useState("allEvents");
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [SpotlightData, setSpotlightData] = useState({
    additionalImages: [],
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // For editing event
  const [showEditModal, setShowEditModal] = useState(false);
  const [spotlight, setSpotlight] = useState([]);

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const response = await axios.get("https://sk-youthportal-1-mkyu.onrender.com/spotlight");
        setSpotlight(response.data);
      } catch (error) {
        console.error("Error fetching spotlight data:", error);
      }
    };

    fetchSpotlight();
  }, []);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://sk-youthportal-1-mkyu.onrender.com/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
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
      setActiveContent("allEvents");
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
        "https://sk-youthportal-1-mkyu.onrender.com/events",
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
      await axios.delete(`https://sk-youthportal-1-mkyu.onrender.com/events/${eventId}`);
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
    const eventData = {
      event_name: newEvent.title,
      event_description: newEvent.description,
      amenities: newEvent.amenities,
      event_image: newEvent.image,
    };

    try {
      await axios.put(
        `https://sk-youthportal-1-mkyu.onrender.com/events/${selectedEvent.id}`,
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

  // Updated Spotlight upload handler
  const handleSpotlightUpload = (e) => {
    const files = e.target.files;
    setSpotlightData((prev) => ({
      ...prev,
      additionalImages: [...prev.additionalImages, ...files],
    }));
  };

  // Upddated Spotlight submission logic
  const handleAddSpotlight = async () => {
    if (SpotlightData.additionalImages.length === 0) {
      setActiveContent("allEvents");
    }

    const formData = new FormData();
    SpotlightData.additionalImages.forEach((file, index) => {
      formData.append(`additionalImages`, file);
    });

    try {
      await axios.post("https://sk-youthportal-1-mkyu.onrender.com/spotlight", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Spotlight added successfully!");
      setSpotlightData({ additionalImages: [] }); // Reset form
    } catch (error) {
      console.error("Error adding Spotlight:", error);
      alert("Failed to add Spotlight. Please check the console for details.");
    }
  };

  // Handle removing a spotlight image
  // Handle removing a spotlight image
  const removeSpotlightImage = async (spotlightId) => {
    try {
      const response = await axios.delete(
        `https://sk-youthportal-1-mkyu.onrender.com/spotlight/${spotlightId}`
      );
      alert(response.data.message); // Display success message to the user

      // Optionally update the UI by removing the spotlight from the state
      setSpotlight((prevSpotlight) =>
        prevSpotlight.filter((spotlight) => spotlight.id !== spotlightId)
      );
    } catch (error) {
      console.error("Error removing spotlight image:", error);
      alert("Failed to remove spotlight image.");
    }
  };

  return (
    <div className="admin-home-container d-flex flex-column">
      <div className="admin-home-label">
        <h2 className="admin-home-label-h2 fst-italic">Manage Homepage</h2>
      </div>

      <ul className="admin-home-nav-tabs list-unstyled d-flex">
        <li
          className={activeContent === "allEvents" ? "active-tab" : ""}
          onClick={() => setActiveContent("allEvents")}
        >
          All Events
        </li>
        <li
          className={activeContent === "addEvent" ? "active-tab" : ""}
          onClick={() => setActiveContent("addEvent")}
        >
          Add Event
        </li>
        <li
          className={activeContent === "addSpotlight" ? "active-tab" : ""}
          onClick={() => setActiveContent("addSpotlight")}
        >
          Add Spotlight
        </li>
      </ul>

      <div className="admin-home-contents-container d-flex justify-content-center">
        {activeContent === "allEvents" && (
          <div className="admin-events-details-container d-flex flex-column">
            {/* <div className="card-container"> */}
            {events.length === 0 ? (
              <p>No events available</p>
            ) : (
              events.map((events) => (
                // <Card key={events.id} className="ProgramCard">
                <Card key={events.id} className="admin-event-card d-flex">
                  <div className="admin-event-card-details d-flex">
                    <div className="admin-event-image-container d-flex justify-content-center align-items-center">
                      <Card.Img
                        variant="top"
                        src={events.event_image}
                        alt={events.event_name}
                        className="admin-event-image"
                      />
                    </div>

                    <div className="admin-event-details-container d-flex align-items-center text-center">
                      <Card.Body>
                        <p className="admin-event-name-title fw-bold">
                          {events.event_name}
                        </p>
                        <p className="admin-event-text">
                          {events.event_description}
                        </p>

                        <div className="admin-event-details-buttons-container d-flex justify-content-center">
                          <button
                            onClick={() => handleEditEvent(events)}
                            className="event-edit-button bg-warning rounded-pill text-white"
                          >
                            Edit Details
                          </button>

                          <button
                            onClick={() => handleDeleteEvent(events.id)}
                            className="event-delete-button bg-danger rounded-pill text-white"
                          >
                            Delete Event
                          </button>
                        </div>
                      </Card.Body>
                    </div>
                  </div>
                </Card>
              ))
            )}
            {/* </div> */}

            <div className="admin-spotlight-container d-flex justify-content-center">
              {spotlight.length > 0 ? (
                spotlight.map((spotlight, index) =>
                  (spotlight.images || []).map((image, imgIndex) => (
                    <Card
                      className="spotlight-card-container"
                      key={`${index}-${imgIndex}`}
                    >
                      <Card.Img
                        variant="top"
                        src={image}
                        alt={`Spotlight ${imgIndex + 1}`}
                        className="spotlight-image"
                      />
                      <Card.Body className="d-flex flex-column align-items-center">
                        <button
                          variant="danger"
                          onClick={() => removeSpotlightImage(spotlight.id)} // Pass the spotlight ID
                        >
                          Remove Spotlight Image
                        </button>
                      </Card.Body>
                    </Card>
                  ))
                )
              ) : (
                <p className="text-center text-muted py-5">
                  No Spotlight available
                </p>
              )}
            </div>
          </div>
        )}

        {activeContent === "addEvent" && (
          <div className="admin-add-event-details-container d-flex justify-content-center">
            <form className="admin-add-event-details-group d-flex flex-column">
              <div className="admin-add-event-form d-flex flex-column">
                <label className="admin-add-event-label">Event Name</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleEventChange}
                />
              </div>

              <div className="admin-add-event-form d-flex flex-column">
                <label className="admin-add-event-label">
                  Event Description
                </label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleEventChange}
                />
              </div>

              <div className="admin-add-event-form d-flex flex-column">
                <label className="admin-add-event-label">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {imagePreview && <img src={imagePreview} alt="Preview" />}
              </div>

              <button
                onClick={handleAddEvent}
                type="button"
                className="admin-add-event-button rounded"
              >
                Add Event
              </button>
            </form>
          </div>
        )}

        {activeContent === "addSpotlight" && (
          <div className="admin-add-spotlight-details-container d-flex justify-content-center">
            <form className="admin-add-spotlight-details-group d-flex flex-column">
              <div className="admin-add-spotlight-form d-flex flex-column">
                <label className="admin-add-spotlight-label">
                  Additional Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleSpotlightUpload(e)}
                />
              </div>

              <button
                onClick={handleAddSpotlight}
                type="button"
                className="admin-add-spotlight-button rounded"
              >
                Add Spotlight
              </button>
            </form>
          </div>
        )}

        {showEditModal && (
          <div className="edit-event-modal d-flex flex-column rounded">
            <div className="edit-event-content">
              <h3 className="text-center">Edit Event</h3>
              <form className="admin-edit-event-details-group d-flex flex-column align-items-center">
                <div className="admin-edit-event-form d-flex flex-column">
                  <label className="admin-edit-event-label">Event Name</label>
                  <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleEventChange}
                  />
                </div>

                <div className="admin-edit-event-form d-flex flex-column">
                  <label className="admin-edit-event-label">
                    Event Description
                  </label>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleEventChange}
                  />
                </div>

                <div className="edit-modal-buttons-container d-flex">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="edit-cancel-button bg-danger text-white rounded-pill"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdateEvent}
                    className="edit-save-button bg-success text-white rounded-pill"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageHomePage;
