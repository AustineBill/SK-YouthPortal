import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Card, Spinner } from "react-bootstrap";
import axios from "axios"; // Import axios
import Cover from "../Asset/bg.png"; // Cover image for the carousel

const Intro = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state

  useEffect(() => {
    // Fetch events from the backend API
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events"); // API endpoint for events
        console.log("Fetched events:", response.data); // Log the response data for debugging

        if (response.data.length > 0) {
          setEvents(response.data); // Set the events in state
        } else {
          setError("No events available"); // Handle case when there are no events
        }

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
    <div className="container-fluid">
      <div className="hero-header">
        <div className="text-center text-lg-start m-4 mv-8">
          <h1 className="MainText ms-5">Lagi't lagi para sa Kabataan,</h1>
          <h1 className="SubText animated slideInRight">
            Barangay at sa Bayan
            <span className="custom-name clr-db txt-i-db">
              {" "}
              Sangguniang Kabataan
            </span>
          </h1>
          <div className="IntroContainer">
            <p className="IntroDetails">Western Bicutan</p>
            <button className="IntroButton after-small btn-db">
              Explore Now <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="row g-4 justify-content-center">
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.1s">
          <div className="custom-feature-item ">
            <i className="fa fa-search fa-3x text-dark mb-3"></i>
            <span className="text-dark mb-3 fs-3 d-block">Search</span>
            <span className="text-dark mb-0 fs-5">
              Unleash the champion with SK Youth's Program
            </span>
          </div>
        </div>
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.3s">
          <div className="custom-feature-item ">
            <i className="fa fa-book fa-3x text-dark mb-3"></i>
            <span className="text-dark mb-3 fs-3 d-block">Book</span>
            <span className="text-dark mb-0 fs-5">Secure your spot</span>
          </div>
        </div>
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.5s">
          <div className="custom-feature-item ">
            <i className="fa fa-check fa-3x text-dark mb-3"></i>
            <span className="text-dark mb-3 fs-3 d-block">Manage</span>
            <span className="text-dark mb-0 fs-5">
              Own your Schedule, your way!
            </span>
          </div>
        </div>
      </div>

      {/* Card Container for Programs (Displaying events fetched from the backend) */}
      <div className="card-container">
        {events.length === 0 ? (
          <p>No events available</p>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="ProgramCard">
              {/* Display event image */}
              <Card.Img
                variant="top"
                src={`data:image/${event.event_image_format};base64,${event.event_image}`}
              />
              <Card.Body>
                {/* Display event name */}
                <Card.Title>{event.event_name}</Card.Title>
                {/* Display event description */}
                <Card.Text>{event.event_description}</Card.Text>
                {/* Link to individual event page */}
                <Link to={`/event/${event.id}`} className="btn-db">
                  Learn More
                </Link>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Highlighted Events Section */}
      <h1 className="NewEveHead">NEWS & EVENTS</h1>
      <div className="row g-4 justify-content-center">
        <div className="card-container highlighted-events">
          {events.map((event) => (
            <Card key={event.id} className="ProgramCard">
              <Card.Img
                variant="top"
                src={`data:image/${event.event_image_format};base64,${event.event_image}`}
              />
              <Card.Body>
                <Card.Title>{event.event_name}</Card.Title>
                <Card.Text>{event.event_description}</Card.Text>
                <Link to={`/event/${event.id}`} className="btn-db">
                  Learn More
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <Link className="text-decoration-none btn-db py-2 px-4 mb-5" to="/news">
        Find Out More
      </Link>

      {/* Carousel Section */}
      <Carousel
        id="carouselExampleIndicators"
        interval={3000}
        controls={true}
        indicators={true}
      >
        <Carousel.Item className="bg-dark">
          <img src={Cover} className="d-block w-100" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item className="bg-primary">
          <img src={Cover} className="d-block w-100" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item className="bg-secondary">
          <img src={Cover} className="d-block w-100" alt="Slide 3" />
        </Carousel.Item>
      </Carousel>

      {/* Spotlight Section */}
      <div className="spotlight-container">
        <h1 className="spotlight-head">SK YOUTH SPOTLIGHTS</h1>
        <Link className="spotlight-button btn-db" to="/Spotlight">
          View Gallery
        </Link>
      </div>

      {/* Quote Section */}
      <div className="BodyContainer" data-wow-delay="0.5s">
        <h1 className="BlockQuote">SANGGUNIANG KABATAAN - WESTERN BICUTAN</h1>
        <Card>
          <Card.Body>
            <blockquote className="blockquote">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                posuere erat a ante.
              </p>
              <footer className="blockquote-footer">
                Someone famous in <cite title="Source Title">Source Title</cite>
              </footer>
            </blockquote>
          </Card.Body>
        </Card>
      </div>

      {/* Connect Section */}
      <div>
        <div className="TextContent">
          <h1 className="Text-1 text-primary">Connect with us.</h1>
          <h1 className="Text-2 clr-db">Be part of the SK Youth Community</h1>
          <h3 className="Text-3">Create your Profile today.</h3>
        </div>
      </div>
    </div>
  );
};

export default Intro;
