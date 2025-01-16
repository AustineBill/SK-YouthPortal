import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { AuthContext } from "../WebStructure/AuthContext";

const Program_details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location; // Access the passed state
  const { programType } = state || {}; // Destructure programType from state
  const [program, setProgram] = useState(null);
  const [show, setShow] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  // Valid program types
  const validProgramTypes = ["Facilities", "Equipment"];
  const isValidProgramType = validProgramTypes.includes(programType);

  // Fetch program details based on programType when component mounts or programType changes
  useEffect(() => {
    if (programType && isValidProgramType) {
      fetch(
        `https://isked-backend-ssmj.onrender.com/api/programs/${programType}`
      )
        .then((response) => response.json())
        .then((data) => {
          setProgram(data);
        })
        .catch((error) => {
          setProgram("error"); // Set to 'error' to handle display in case of a fetch failure
        });
    }
  }, [programType, isValidProgramType]);

  // Save programType to sessionStorage when it changes
  useEffect(() => {
    if (programType) {
      sessionStorage.setItem("programType", programType);
    }
  }, [programType]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (programType === "Equipment") {
      handleEquipment();
    } else {
      setShow(true);
    }
  };

  const handleAuthorize = (type) => {
    if (isAuthenticated) {
      navigate("/Reservation", {
        state: { reservationType: type, programType },
      });
    } else {
      navigate("/userauth");
    }
  };

  const handleEquipment = () => {
    if (isAuthenticated) {
      navigate("/Equipment", { state: { programType } });
    } else {
      navigate("/userauth");
    }
  };

  const handleViewSchedule = () => {
    if (isAuthenticated) {
      // Navigate based on programType
      if (programType === "Equipment") {
        navigate("/ViewEquipment", { state: { programType } });
      } else if (programType === "Facilities") {
        navigate("/ViewFacilities", { state: { programType } });
      }
    } else {
      navigate("/userauth");
    }
  };

  // Return fallback UI for unknown programType
  if (!isValidProgramType) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="text-center text-lg-start m-4">
            <h1 className="Maintext animated slideInRight">
              Unknown Program Type
            </h1>
            <p className="Subtext">
              The selected program type is not recognized.
            </p>
            <button
              className="LargeButton btn-dark"
              onClick={() => navigate("/UserProgram")}
            >
              <i className="bi bi-arrow-left-circle" aria-hidden="true"></i>{" "}
              Back to Programs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Return loading message if program is null or error occurs
  if (!program) {
    return <div>Loading...</div>;
  }

  if (program === "error") {
    return <div>Error fetching program details. Please try again later.</div>;
  }

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/UserProgram")}>
          Programs
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Program Details</Breadcrumb.Item>
      </Breadcrumb>

      <div className="row">
        <div className="text-center text-lg-start m-4">
          <h1 className="Maintext animated slideInRight">
            {" "}
            Reservation: {program.program_name}
          </h1>
          <p className="Subtext">Reserve yours now!</p>

          {(programType === "Facilities" || programType === "Equipment") && (
            <button className="LargeButton btn-dark" onClick={handleShow}>
              <i className="bi bi-bookmark" aria-hidden="true"></i>
              Book Now
            </button>
          )}

          <button className="LargeButton btn-db" onClick={handleViewSchedule}>
            <i className="bi bi-calendar" aria-hidden="true"></i> View Schedule
          </button>
        </div>
      </div>

      {/* Modal for "Solo or Group" option */}
      {programType === "Facilities" && show && (
        <div className="ModalOverlayStyles">
          <div className="ModalStyles large">
            <button
              className="closeButton"
              onClick={handleClose}
              aria-label="Close"
            >
              <i className="bi bi-x-circle"></i>
            </button>
            <h4>Number of Participants</h4>
            <button
              className="ModalButtonStyles SmallButton btn-dark small"
              onClick={() => handleAuthorize("Solo")}
            >
              <i className="bi bi-person mb-1"></i> Solo
            </button>
            <button
              className="ModalButtonStyles SmallButton btn-db small"
              onClick={() => handleAuthorize("Group")}
            >
              <i className="bi bi-people mb-1"></i> Group
            </button>
          </div>
        </div>
      )}

      <div className="calendar-container text-justify lh-lg">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={program.image_url}
              className="img-fluid rounded-start"
              alt={program.program_name}
              style={{ height: "400px", width: "350px" }} // Set custom height and width
            />
          </div>
          <div className="col-md-7">
            <h5 className="mb-2">Description</h5>
            <p className="lh-lg">{program.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Program_details;
