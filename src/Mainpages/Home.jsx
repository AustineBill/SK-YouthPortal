import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Spinner } from "react-bootstrap";
import axios from "axios";

const Intro = () => {
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [spotlightData, setSpotlightData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/programs");
        console.log(response.data); // Log the response
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching Programs data:", error);
        setPrograms([]); // Fallback to empty array
      }
    };

    fetchProgramData();
  }, []);

  useEffect(() => {
    // Fetch events from the backend API
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events"); // API endpoint for events
        console.log("Fetched events:", response.data); // Log the response data for debugging
        setEvents(response.data); // Set the events in state

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching events:", error); // Log error
        setError("Error fetching events"); // Set error state
        setLoading(false); // Set loading to false after error
      }
    };

    fetchEvents(); // Call the function to fetch events
  }, []); // Empty array ensures this effect runs only once when the component mounts

  useEffect(() => {
    const fetchSpotlightData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/spotlight");
        console.log(response.data); // Log the response
        setSpotlightData(response.data);
      } catch (error) {
        console.error("Error fetching spotlight data:", error);
        setSpotlightData([]); // Fallback to empty array
      }
    };

    fetchSpotlightData();
  }, []);

  const handleNavigate = (type) => {
    navigate("/ProgramDetails", { state: { programType: type } });
  };

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
          <h1 className="MainText ms-5 offset-content">
            Lagi't lagi para sa Kabataan,{" "}
          </h1>
          <h1 className="SubText animated slideInRight offset-content">
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
      <div className="row g-5 justify-content-center">
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.1s">
          <div className="custom-feature-item ">
            <i className="fa fa-search fa-2x text-primary mb-2"></i>
            <span className="fw-bold mb-2 fs-4 d-block">Search</span>
            <span className="text-dark mb-0 fs-6">
              Unleash the champion with SK Youth's Program
            </span>
          </div>
        </div>
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.3s">
          <div className="custom-feature-item ">
            <i className="fa fa-book fa-2x text-success mb-2"></i>
            <span className="fw-bold mb-2 fs-4 d-block">Book</span>
            <span className="text-dark mb-0 fs-6">Secure your spot</span>
          </div>
        </div>
        <div className="col-lg-3 wow fadeIn" data-wow-delay="0.5s">
          <div className="custom-feature-item ">
            <i
              className="fa fa-check fa-2x"
              style={{ color: "#ff6347" }}
              mb-2
            ></i>
            <span className="fw-bold text-dark mb-2 fs-4 d-block">Manage</span>
            <span className="text-dark mb-0 fs-6">
              Own your Schedule, your way!
            </span>
          </div>
        </div>
      </div>

      {/* Card Container for Programs*/}
      <div className="card-container">
        {programs.length === 0 ? (
          <p>No program available</p>
        ) : (
          programs.map((programs) => (
            <Card key={programs.id} className="ProgramCard">
              <Card.Img
                variant="top"
                src={programs.image_url}
                alt={programs.program_name}
                className="program-card-img"
              />
              <Card.Body>
                <Card.Title>{programs.program_name}</Card.Title>
                <Card.Text>{programs.heading}</Card.Text>
                <Button
                  onClick={() => handleNavigate(programs.program_type)}
                  className="btn-db"
                >
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Highlighted Events Section */}

      <h1 className="NewEveHead">NEWS & EVENTS</h1>
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
            </Card>
          ))
        )}
      </div>

      <Link className="spotlight-button btn-db m-2" to="/news">
        Find Out More
      </Link>

      {/* Spotlight Section */}
      <div className="spotlight-container">
        <h1 className="spotlight-head">SK YOUTH SPOTLIGHTS</h1>
        <div className="image-content">
          {spotlightData.length > 0 ? (
            spotlightData.map((spotlight, index) =>
              // Check if frontimage exists and display it as a single image
              spotlight.frontimage ? (
                <img
                  key={index}
                  src={spotlight.frontimage}
                  alt={`Milestone ${index + 1}`}
                  style={{ height: "300px", objectFit: "cover" }}
                />
              ) : (
                <p className="text-center text-muted py-5" key={index}>
                  No front image available
                </p>
              )
            )
          ) : (
            <p className="text-center text-muted py-5">
              No milestones available
            </p>
          )}
        </div>

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
