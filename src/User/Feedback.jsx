import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const Feedback = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFeedbackSubmit = async () => {
    const userId = sessionStorage.getItem("userId");

    console.log("Feedback Data:", {
      user_id: sessionStorage.getItem("userId"),
      rating,
      comment,
    });

    if (!userId) {
      console.error("User ID not found in session storage.");
      return;
    }

    if (rating === 0) {
      setError("Please provide a rating before submitting.");
      return;
    }

    if (!comment.trim()) {
      setError("Please provide a comment before submitting.");
      return;
    }

    try {
      const feedbackData = {
        user_id: userId,
        rating,
        comment,
      };

      await axios.post(
        "https://isked-backend-ssmj.onrender.com/Feedback",
        feedbackData
      );

      setIsSubmitted(true);
      onSubmit(); // ✅ Ensure it proceeds to the success modal
    } catch (error) {
      console.error(
        "Error submitting feedback:",
        error.response?.data || error
      );
    }
  };

  const handleSkip = () => {
    onSubmit();
  };

  return (
    <div className="ModalOverlayStyles">
      <div
        className="ModalStyles"
        style={{ maxWidth: "570px", backgroundColor: "#9facfb" }}
      >
        <h2 className="text-dark fw-bold text-center">
          Rate and Provide Feedback
        </h2>

        <div className="stars text-center mb-3">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`star ${
                index + 1 <= (hover || rating)
                  ? "text-warning"
                  : "text-secondary"
              }`}
              style={{
                fontSize: "2rem",
                cursor: isSubmitted ? "default" : "pointer",
              }}
              onClick={() => !isSubmitted && setRating(index + 1)}
              onMouseEnter={() => !isSubmitted && setHover(index + 1)}
              onMouseLeave={() => !isSubmitted && setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        <Form.Group className="mt-3">
          <Form.Label className="fw-bold">Additional Comments</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitted}
            placeholder="Write your feedback here..."
          />
        </Form.Group>

        {error && <p className="text-danger text-center mt-2">{error}</p>}

        <div className="d-flex justify-content-between mt-4">
          <Button variant="dark" onClick={handleSkip}>
            Skip
          </Button>

          <Button onClick={handleFeedbackSubmit} disabled={isSubmitted}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
