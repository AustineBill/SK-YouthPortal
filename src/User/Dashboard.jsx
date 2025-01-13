import React, { useState, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import axios from "axios";

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [userFeedback, setUserFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const navigate = useNavigate();

  useEffect(() => {
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

        if (response.data) {
          setUserFeedback(response.data);
        } else {
          setUserFeedback(null);
        }
      } catch (error) {
        console.error("Error fetching user feedback:", error);
        setUserFeedback(null);
      }
    };

    fetchUserFeedback();
  }, []);

  const handleNavigate = (type) => {
    navigate("/ProgramDetails", { state: { programType: type } });
  };

  const handleFeedbackSubmit = async () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in session storage.");
      return;
    }

    try {
      const feedbackData = {
        user_id: userId,
        rating,
        comment: feedback,
      };

      let response;
      if (isEditing) {
        // Update existing feedback
        response = await axios.put(
          `http://localhost:5000/Feedback/${userId}`,
          feedbackData
        );
      } else {
        // Submit new feedback
        response = await axios.post(
          "http://localhost:5000/Feedback",
          feedbackData
        );
      }

      // Update the userFeedback state and exit editing mode
      setUserFeedback(response.data);
      setIsEditing(false); // Exit editing mode immediately
      setRating(response.data.rating); // Make sure the updated rating is shown
      setFeedback(response.data.comment);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="container-fluids">
      <div className="western-header"></div>

      <div className="bg-custom mt-2.5">
        <div className="Divider">
          <h1 className="text-light fw-bold fs-4">Discover more Programs</h1>
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
                  More Details
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
        {userFeedback && userFeedback.rating && !isEditing ? (
          <div className="position-relative text-center">
            <h2 className="text-dark fw-bold">Your Feedback</h2>
            <FaPen
              className="position-absolute top-0 end-0 text-dark"
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
              onClick={() => {
                setIsEditing(true); // Enable editing mode
                setRating(userFeedback.rating);
                setFeedback(userFeedback.comment);
              }}
            />
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
          <>
            <h2 className="text-dark fw-bold text-center">
              {isEditing ? "Edit Your Feedback" : "Rate and Provide Feedback"}
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
                {isEditing ? "Update Feedback" : "Submit Feedback"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
