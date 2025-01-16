import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb, Button, Form, Row, Col } from "react-bootstrap";
import "../WebStyles/UserStyle.css";
import StepIndicator from "../Classes/StepIndicator";

const ScheduleDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationType } = location.state || { reservationType: "Solo" };
  const [errorMessage, setErrorMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [programType, setProgramType] = useState(""); // Holds the program type (e.g., 'Equipment' or 'Facilities')

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found in sessionStorage");
        setErrorMessage("Failed to retrieve user ID.");
        return;
      }
      try {
        const response = await fetch(
          `https://isked-backend.onrender.com/Details/${userId}`
        );
        if (!response.ok) {
          throw new Error(
            `Server responded with ${response.status}: ${response.statusText}`
          );
        }
        const data = await response.json();

        const initialParticipants = [
          { username: data.username, age: data.age, email: data.email },
        ];

        if (reservationType === "Group") {
          // Add placeholders for 4 more participants
          for (let i = 0; i < 4; i++) {
            initialParticipants.push({ username: "", age: "", email: "" });
          }
        }

        setParticipants(initialParticipants);
      } catch (error) {
        console.error("Failed to fetch user details:", error.message);
        setErrorMessage(
          "Failed to fetch user details. Please try again later."
        );
      }
    };

    fetchUserDetails();
    // Get the program type from sessionStorage or location state
    const type =
      sessionStorage.getItem("programType") || location.state?.programType;
    setProgramType(type); // Set program type to the state
  }, [reservationType, location.state]);

  const handleInputChange = (index, field, value) => {
    setParticipants((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleNext = () => {
    setErrorMessage("");

    if (reservationType === "Group") {
      const filledCount = participants.filter((p) => p.username).length;
      if (filledCount < 5) {
        setErrorMessage(
          "Please fill out all participant names (5 total, including yourself)."
        );
        return;
      }
    } else {
      const { username, age, email } = participants[0];
      if (!username || !age || !email) {
        setErrorMessage("Please fill out your information.");
        return;
      }
    }
    sessionStorage.setItem(
      "scheduleDetails",
      JSON.stringify({ reservationType, participants })
    );

    navigate("/ScheduleDone");
  };

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        {programType !== "Facilities" && (
          <Breadcrumb.Item onClick={() => navigate("/EquipReservation")}>
            Equipment
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item
          onClick={() => {
            sessionStorage.removeItem("reservationData");
            navigate(
              programType === "Equipment" ? "/EquipReservation" : "/Reservation"
            );
          }}
        >
          Reservation
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Schedule Details</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mb-3">
        <h1 className="Maintext animated slideInRight">Schedule</h1>
        <p className="Subtext">Please provide your details below</p>
      </div>

      <div className="calendar-container">
        <StepIndicator currentStep={2} />

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <Form className="ScheduleInfo">
          {participants.map((participant, index) => (
            <Row key={index} className="mb-3">
              <Form.Group as={Col} controlId={`formFullName${index}`}>
                <Form.Label>
                  {index === 0 ? "Your Full Name" : `Participant ${index + 1}`}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={participant.username}
                  onChange={(e) =>
                    handleInputChange(index, "username", e.target.value)
                  }
                  disabled={index === 0}
                />
              </Form.Group>

              {index === 0 && (
                <>
                  <Form.Group as={Col} controlId="formYourAge">
                    <Form.Label>Your Age</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter age"
                      value={participant.age}
                      onChange={(e) =>
                        handleInputChange(index, "age", e.target.value)
                      }
                      disabled
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formYourEmail">
                    <Form.Label>Your Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={participant.email}
                      onChange={(e) =>
                        handleInputChange(index, "email", e.target.value)
                      }
                      disabled
                    />
                  </Form.Group>
                </>
              )}
            </Row>
          ))}

          <Button variant="success" onClick={handleNext} className="mt-3">
            Next
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ScheduleDetails;
