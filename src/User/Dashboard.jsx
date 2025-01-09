import React, { useState, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [rating, setRating] = useState(0); // State for selected rating
  const [hover, setHover] = useState(0); // State for hover effect on stars
  const [feedback, setFeedback] = useState(""); // State for feedback text
  const [userFeedback, setUserFeedback] = useState(null); // State to store the user's submitted feedback
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available programs from backend
    const fetchProgramData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      }
    };

    fetchProgramData();
  }, []);

  useEffect(() => {
    const fetchUserFeedback = async () => {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found in session storage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/Feedback/${userId}`
        );
        setUserFeedback(response.data); // Set retrieved feedback
      } catch (error) {
        console.error("Error fetching user feedback:", error);
      }
    };

    fetchUserFeedback();
  }, []);

  const handleNavigate = (type) => {
    navigate("/ProgramDetails", { state: { programType: type } });
  };

  const handleFeedbackSubmit = async () => {
    const userId = sessionStorage.getItem("userId"); // Retrieve user ID from sessionStorage

    if (!userId) {
      console.error("User ID not found in session storage.");
      return;
    }

    try {
      const feedbackData = {
        user_id: userId, // Include user ID
        rating,
        comment: feedback,
      };

      await axios.post("http://localhost:5000/Feedback", feedbackData);
      setUserFeedback(feedbackData); // Store feedback in state
      setRating(0); // Reset rating
      setFeedback(""); // Reset feedback
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="western-header"></div>

      <div className="bg-secondary mt-2">
        <div className="Divider">
          <h1 className="text-dark fw-bold fs-4">Discover more Programs</h1>
        </div>
      </div>

      {/* Card Container for Programs */}
      <div className="card-container d-flex flex-wrap justify-content-center">
        {programs.length === 0 ? (
          <p>No program available</p>
        ) : (
          programs.map((program) => (
            <Card
              key={program.id}
              className="ProgramCard mx-2 mb-4"
              style={{ width: "18rem" }}
            >
              <Card.Img
                variant="top"
                src={program.image_url}
                alt={program.program_name}
                className="program-card-img"
              />
              <Card.Body>
                <Card.Title>{program.program_name}</Card.Title>
                <Card.Text>{program.heading}</Card.Text>
                <Button
                  onClick={() => handleNavigate(program.program_type)}
                  className="btn-db"
                >
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Feedback Section */}
      <div
        className="feedback-container container mt-4 p-4 rounded shadow mb-3"
        style={{ maxWidth: "600px", backgroundColor: "#f8f9fa" }}
      >
        {userFeedback ? (
          // Display submitted feedback
          <div className="text-center">
            <h2 className="text-dark fw-bold">Your Feedback</h2>
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${
                    index < userFeedback.rating
                      ? "text-warning"
                      : "text-secondary"
                  }`}
                  style={{ fontSize: "2rem" }}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="mt-3">{userFeedback.comment}</p>
          </div>
        ) : (
          // Display feedback form
          <>
            <h2 className="text-dark fw-bold text-center">
              Rate and Provide Feedback
            </h2>
            <div className="stars text-center">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <span
                    key={index}
                    className={`star ${
                      starValue <= (hover || rating)
                        ? "text-warning"
                        : "text-secondary"
                    }`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                    style={{ fontSize: "2rem", cursor: "pointer" }}
                  >
                    ★
                  </span>
                );
              })}
            </div>
            <Form.Group className="mt-3">
              <Form.Label className="fw-bold">Your Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here..."
              />
            </Form.Group>
            <div className="text-center">
              <Button
                variant="dark"
                className="mt-3"
                onClick={handleFeedbackSubmit}
                disabled={!rating || !feedback.trim()}
              >
                Submit Feedback
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
