import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import axios from "axios";

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [userFeedback, setUserFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [showModal, setShowModal] = useState(false); // Modal visibility state
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

      // Show the modal after feedback submission
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="container-fluids">
      <div className="western-header"></div>

      <div className="bg-custom mt-2.5">
        <div className="Divider">
          <h1 className="text-light  fs-6">Discover more of our programs!</h1>
        </div>
      </div>

      {/* Card Container for Programs */}
      <div className="card-container">
        {programs.length === 0 ? (
          <p>No program available</p>
        ) : (
          programs.map((program) => (
            <Card
              key={program.id}
              className="ProgramCard"
              style={{ width: "18rem" }}
            >
              <Card.Img
                variant="top"
                src={program.image_url}
                alt={program.program_name}
                className="program-card-img"
              />
              <Card.Body>
                <Card.Title
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1d0053",
                  }}
                >
                  {program.program_name}
                </Card.Title>
                <Card.Text
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "13.5px",
                    fontWeight: "light",
                    color: "#000000",
                    marginTop: "-10px",
                  }}
                >
                  {program.heading}
                </Card.Text>
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
        style={{ maxWidth: "570px", backgroundColor: "#9facfb" }}
      >
        {userFeedback && userFeedback.rating && !isEditing ? (
          <div className="position-relative text-center">
            <h2
              style={{
                color: "#1d0053",
                fontSize: "1.6rem",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              Send us your feedback!
            </h2>
            <FaPen
              className="position-absolute top-0 end-0 text-dark"
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
              onClick={() => {
                setIsEditing(true); // Enable editing mode
                setRating(userFeedback.rating);
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
            <div className="text-center">
              <Button
                variant="dark"
                className="mt-3"
                onClick={handleFeedbackSubmit}
                disabled={!rating}
              >
                {isEditing ? "Update Feedback" : "Submit Feedback"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Feedback Submission Modal */}
      {showModal && (
        <div className="ModalOverlayStyles">
          <div className="ModalStyles large">
            <div className="text-center">
              <i
                className="bi bi-emoji-smile-fill text-warning"
                style={{ fontSize: "4rem" }}
              ></i>
              <h2 className="mt-3 mb-3">
                Your feedback was submitted successfully!
              </h2>
              <p>Thank you for your feedback!</p>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <Button
                variant="dark"
                className="btn-dark"
                onClick={() => {
                  window.location.reload(); // This will reload the page
                }}
              >
                <i className="bi bi-house m-.5"></i>
                Return to dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
