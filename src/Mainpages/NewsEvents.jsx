import React, { useState, useEffect } from "react";
import { Breadcrumb, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewsEvents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend.onrender.com/events"
        ); // API endpoint for events
        console.log("Fetched events:", response.data); // Log the response data for debugging
        setEventData(response.data); // Set the events in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching events:", error); // Log error
        setError("Error fetching events"); // Set error state
        setLoading(false); // Set loading to false after error
      }
    };

    fetchEvents(); // Call the function to fetch events
  }, []); // Empty array ensures this effect runs only once when the component mounts

  // Loading and error handling
  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (error) return <div className="text-center">{error}</div>;

  return (
    <div className="container-fluids">
      <Breadcrumb className="ms-5">
        <Breadcrumb.Item onClick={() => navigate("/Home")}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>News and Events</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start">
        <h1 className="Maintext animated slideInRight">News and Events</h1>
        <p className="Subtext">Get the inside scoop on all the action</p>
      </div>

      <div className="card-container">
        {eventData.length > 0 ? (
          eventData.map((event, index) => (
            <Card className="ProgramCard" key={index}>
              {event.images && event.images.length > 0 ? (
                <Card.Img
                  variant="top"
                  src={event.images[0]} // Use the first image
                  alt={`Event ${index + 1}`}
                  style={{ height: "250px", objectFit: "cover" }}
                />
              ) : (
                <Card.Img
                  variant="top"
                  src={event.event_image}
                  alt={event.event_name}
                  className="program-card-img"
                />
              )}
              <Card.Body className="d-flex flex-column align-items-center">
                <Card.Title>{event.event_name || "Untitled Event"}</Card.Title>
                <Card.Text>
                  {event.event_description || "No description available."}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted py-5">No Spotlight available</p>
        )}
      </div>
    </div>
  );
};

export default NewsEvents;
