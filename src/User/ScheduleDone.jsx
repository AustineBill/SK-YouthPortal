import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../Classes/StepIndicator";
import { Breadcrumb, Row, Col, Card, Table } from "react-bootstrap";

function ScheduleDone() {
  const navigate = useNavigate();
  const [currentStep] = useState(3); // Assuming step 3 is the confirmation step
  const [allData, setAllData] = useState({}); // State to hold all reservation data
  const [programType, setProgramType] = useState(""); // State for program type

  const generateReservationId = () => {
    return `REF-${Math.floor(100000 + Math.random() * 900000)}`; // Generate a 6-digit unique ID
  };

  const handlePrevious = () => {
    navigate("/ScheduleDetails");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleWaiverRedirect = () => {
    if (programType === "Facilities") {
      navigate("/ReservationWaiver"); // Navigate to Reservation Waiver
    } else if (programType === "Equipment") {
      navigate("/BorrowWaiver"); // Navigate to Borrow Waiver
    } else {
      console.log("Unknown program type");
    }
  };

  useEffect(() => {
    let reservationData =
      JSON.parse(sessionStorage.getItem("reservationData")) || {};
    const scheduleDetails =
      JSON.parse(sessionStorage.getItem("scheduleDetails")) || {};
    const reservedEquipment =
      JSON.parse(sessionStorage.getItem("reservedEquipment")) || [];
    const programType = sessionStorage.getItem("programType"); // Get program type from sessionStorage

    // Generate reservation ID if it doesn't already exist
    if (!reservationData.reservation_id) {
      reservationData.reservation_id = generateReservationId();
      sessionStorage.setItem(
        "reservationData",
        JSON.stringify(reservationData)
      ); // Save back to sessionStorage
    }

    setAllData({ ...reservationData, ...scheduleDetails, reservedEquipment });
    setProgramType(programType);
  }, []);

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        {programType !== "Facilities" && (
          <Breadcrumb.Item onClick={() => navigate("/Equipment")}>
            Equipment
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item
          onClick={() => {
            sessionStorage.removeItem("reservationData");
            navigate(
              programType === "Equipment"
                ? "/EquipmentReservation"
                : "/Reservation"
            );
          }}
        >
          Reservation
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/ScheduleDetails")}>
          Schedule Details
        </Breadcrumb.Item>
        <Breadcrumb.Item active> Review and Confirm </Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start m-4 mb-4">
        <h1 className="Maintext animated slideInRight">
          Reservation Confirmation
        </h1>
        <p className="Subtext text-muted">
          Please review your booking details below.
        </p>
      </div>

      <div className="calendar-container">
        <StepIndicator currentStep={currentStep} />

        <Card className="shadow-sm mt-4 border-0">
          <Card.Body>
            <div className="text-center mb-3">
              <h2 className="fw-bold">Reservation</h2>
              <p className="text-muted">
                Booking Reference:{" "}
                <strong>{allData.reservation_id || "N/A"}</strong>
              </p>
            </div>
            <hr />

            <Row>
              <Col md={6}>
                <h5 className="text-primary">Reservation Details</h5>
                {programType === "Facilities" ? (
                  <Table bordered hover size="sm" className="mt-3">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Type:</strong>
                        </td>
                        <td>{allData.reservation_type || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Start Date:</strong>
                        </td>
                        <td>{formatDate(allData.start_date) || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>End Date:</strong>
                        </td>
                        <td>{formatDate(allData.end_date) || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Time Slot:</strong>
                        </td>
                        <td>{allData.time_slot || "N/A"}</td>
                      </tr>
                    </tbody>
                  </Table>
                ) : programType === "Equipment" ? (
                  <Table bordered hover size="sm" className="mt-3">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Program Type:</strong>
                        </td>
                        <td>{programType || "N/A"}</td>
                      </tr>
                      {allData.reservedEquipment &&
                      allData.reservedEquipment.length > 0 ? (
                        allData.reservedEquipment.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <strong>Equipment Name:</strong>
                            </td>
                            <td>{item.name || "N/A"} </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>
                            <strong>No equipment reserved</strong>
                          </td>
                          <td>N/A</td>
                        </tr>
                      )}
                      {allData.reservedEquipment.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <strong>Quantity:</strong>
                          </td>
                          <td>{item.quantity || "N/A"}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <strong>Start Date:</strong>
                        </td>
                        <td>
                          {allData.startDate
                            ? new Date(allData.startDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>End Date:</strong>
                        </td>
                        <td>
                          {allData.endDate
                            ? new Date(allData.endDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                ) : (
                  <p>Program type not recognized.</p>
                )}
              </Col>

              <Col md={6}>
                <h5 className="text-primary">Participant Details</h5>
                <Table bordered hover size="sm" className="mt-3">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Full Name:</strong>
                      </td>
                      <td>{allData.participants?.[0]?.username || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Age:</strong>
                      </td>
                      <td>{allData.participants?.[0]?.age || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Email:</strong>
                      </td>
                      <td>{allData.participants?.[0]?.email || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="ModalButtonStyles SmallButton btn-dark super-small"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className="ModalButtonStyles SmallButton btn-db super-small"
            onClick={handleWaiverRedirect}
          >
            Go to Waiver
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDone;
