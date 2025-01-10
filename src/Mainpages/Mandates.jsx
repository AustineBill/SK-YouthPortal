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
        const response = await axios.get("http://localhost:5000/Website");
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
          {" "}
          Trailblazing Leaders Who Transformed Our Barangay.{" "}
        </p>
      </div>

      {/* Timeline Container */}
      <div className="main-timeline">
        {/* Mandate */}
        <div className="timeline-left">
          <Card className="gradient-custom">
            <Card.Body className="p-4">
              <i class="bi bi-card-checklist fs-1"></i>
              <h2>Mandate</h2>
              <p className="text-white-50 fs-4">
                {mandateInfo.mandate || "Loading Mandate..."}
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Mission */}
        <div className="timeline-right">
          <Card className="gradient-custom-4">
            <Card.Body className="p-4">
              <i class="bi bi-bullseye fs-1"></i>
              <h2>Mission</h2>
              <p className="text-white-50 fs-4">
                {mandateInfo.mission || "Loading Mission..."}
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Vision */}
        <div className="timeline-left">
          <Card className="gradient-custom">
            <Card.Body className="p-4">
              <i class="bi bi-eye-fill fs-1"></i>
              <h2>Vision</h2>
              <p className="text-white-50 fs-4">
                {mandateInfo.vision || "Loading Vision..."}
              </p>
            </Card.Body>
          </Card>
        </div>

        {/* Objectives */}
        <div className="timeline-right">
          <Card className="gradient-custom-4">
            <Card.Body className="p-4">
              <i class="bi bi-calendar-check-fill fs-1"></i>
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
