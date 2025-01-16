import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
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
        const response = await axios.get("https://sk-youthportal-1-mkyu.onrender.com/api/programs");
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
        const response = await axios.get("https://sk-youthportal-1-mkyu.onrender.com/events"); // API endpoint for events
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
        const response = await axios.get("https://sk-youthportal-1-mkyu.onrender.com/spotlight");
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
    <div className="container-fluids">
      <div className="hero-header">
        <div className="text-center text-lg-start">
          <h1
            className="MainText ms-5 offset-content custom-font"
            style={{ marginTop: "43px" }}
          >
            Lagi't lagi para sa Kabataan, Barangay at sa Bayan
          </h1>
          <div className="custom-name-wrapper">
            <span className="custom-name clr-db txt-i-db">
              <span className="sangguniang-text">Sangguniang</span>{" "}
              <span className="kabataan-color">Kabataan</span>
            </span>
          </div>

          <p className="IntroDetails">WESTERN BICUTAN</p>

          <div className="image-container">
            <img
              src="/Asset/WebImages/icons.png"
              alt="SK Western Bicutan"
              className="below-image"
            />
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="row g-5 justify-content-center">
        <div
          className="col-3 col-sm-3 col-md-3 col-lg-3 wow fadeIn"
          data-wow-delay="0.1s"
        >
          <div className="custom-feature-item">
            <i className="fa fa-search fa-2x mb-2 text-primary"></i>
            <span className="fw-bold fs-4 mb-2 d-block">Search</span>
            <span className="text-feature text-dark mb-0 fs-6">
              Unleash the champion with SK Youth's Program
            </span>
          </div>
        </div>
        <div
          className="col-3 col-sm-3 col-md-3 col-lg-3 wow fadeIn"
          data-wow-delay="0.3s"
        >
          <div className="custom-feature-item">
            <i className="fa fa-book fa-2x mb-2 text-success"></i>
            <span className="fw-bold fs-4 mb-2 d-block">Book</span>
            <span className="text-feature text-dark mb-0 fs-6">
              Secure your spot
            </span>
          </div>
        </div>
        <div
          className="col-3 col-sm-3 col-md-3 col-lg-3 wow fadeIn"
          data-wow-delay="0.5s"
        >
          <div className="custom-feature-item">
            <i
              className="fa fa-check fa-2x mb-2"
              style={{ color: "#ff6347" }}
            ></i>
            <span className="fw-bold text-dark fs-4 mb-2 d-block">Manage</span>
            <span className="text-feature text-dark mb-0 fs-6">
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
              <Card.Body className="d-flex flex-column align-items-center">
                <Card.Title>{programs.program_name}</Card.Title>
                <Card.Text>{programs.heading}</Card.Text>
                <button
                  onClick={() => handleNavigate(programs.program_type)}
                  className="spotlight-button btn-db m-2"
                >
                  Learn More
                </button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      <h1 className="NewEveHead">NEWS & EVENTS</h1>
      <div className="card-container">
        {events.length > 0 ? (
          events.map((event, index) => (
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

      <Link className="spotlight-button btn-db m-2" to="/news">
        Find Out More
      </Link>

      <div className="centered-text">
        <p>Growing directly easy with a reservation button.</p>
      </div>
      <p className="small-phrase">
        <span className="yellow">PAGKAKAISA</span>
        <span>I</span>
        <span className="red">KABATAAN</span>
        <span>I</span>
        <span className="green">PROGRESO</span>
      </p>

      {/* Spotlight Section */}
      <div className="spotlight-container">
        <h1 className="spotlight-head">SK YOUTH SPOTLIGHTS</h1>
        <div className="image-content">
          {spotlightData.map((spotlight, index) =>
            spotlight.frontimage ? (
              <img
                key={index}
                src={spotlight.frontimage}
                alt={`Milestone ${index + 1}`}
              />
            ) : (
              <p className="text-center text-muted py-5" key={index}></p>
            )
          )}
        </div>

        <Link className="spotlight-button btn-db" to="/Spotlight">
          View Gallery
        </Link>
      </div>

      {/* Quote Section */}
      <div className="BodyContainer" data-wow-delay="0.5s">
        <h1 className="BlockQuoteBlockQuote">
          SANGGUNIANG KABATAAN - WESTERN BICUTAN
        </h1>
        <Card>
          <Card.Body className="CardBodyWithText">
            <blockquote className="blockquote">
              <p>
                {"\u00A0\u00A0\u00A0\u00A0The"} Sangguniang Kabataan (SK) of
                Western Bicutan, Taguig City serves as the youth governing body
                dedicated to empowering young individuals through programs,
                projects, and activities that promote leadership, community
                engagement, and development. Focused on addressing the needs and
                aspirations of the youth, the SK fosters initiatives in
                education, sports, health, and cultural enrichment while
                ensuring active participation in nation-building within the
                barangay.
              </p>
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
