import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Card } from "react-bootstrap";
import axios from "axios";

const Mandate = () => {
  const [mandateInfo, setMandateInfo] = useState({
    mandate: "",
    objectives: "",
    mission: "",
    vision: "",
  });

  const navigate = useNavigate();

  // Fetch mandate information when the component mounts
  useEffect(() => {
    const fetchMandateInfo = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/Website"
        );
        setMandateInfo(response.data);
      } catch (error) {
        console.error("Error fetching mandate info:", error);
      }
    };

    fetchMandateInfo();
  }, []);

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/About")}>
          About
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Mandate</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mv-8">
        <h1 className="Maintext animated slideInRight">Mandate</h1>
        <p className="Subtext">
          Trailblazing Leaders Who Transformed Our Barangay.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="main-timeline">
        {/* Mission */}
        <div className="timeline-left">
          <div
            className="icon-container-outside"
            style={{ marginBottom: "-.01px" }}
          >
            <img
              src="Asset/WebImages/pngegg.png"
              alt="Mission Icon"
              className="icon-img-outside"
              style={{
                width: "600px",
                height: "500px",
                objectFit: "contain",
                marginTop: "-150px",
              }}
            />
          </div>
          <Card className="gradient-custom-4">
            <Card.Body className="p-4">
              <h2>Mission</h2>
              <p className="text-white-50 fs-4">
                {mandateInfo.mission || "Loading Mission..."}
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Vision */}
        <div className="timeline-right">
          <div
            className="icon-container-outside"
            style={{ marginBottom: "-10px" }}
          >
            <img
              src="Asset/WebImages/vision.png"
              alt="Vision Icon"
              className="icon-img-outside"
              style={{
                width: "350px",
                height: "350px",
                objectFit: "contain",
                marginTop: "-300px",
              }}
            />
          </div>
          <Card className="gradient-custom">
            <Card.Body className="p-4">
              <h2>Vision</h2>
              <p className="text-white-50 fs-4">
                {mandateInfo.vision || "Loading Vision..."}
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Objectives */}
        <div className="timeline-left">
          <div
            className="icon-container-outside"
            style={{ marginBottom: "-135px" }}
          >
            <img
              src="Asset/WebImages/objective.png"
              alt="Objectives Icon"
              className="icon-img-outside"
              style={{
                width: "580px",
                height: "450px",
                objectFit: "contain",
                marginTop: "-190px",
              }}
            />
          </div>
          <Card className="gradient-custom-4">
            <Card.Body className="p-4">
              <h2>Objectives</h2>
              <p className="text-white-50 fs-4">
                {mandateInfo.objectives || "Loading Objectives..."}
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mandate;
