import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend-ssmj.onrender.com/api/programs"
        );
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      }
    };

    fetchProgramData();
  }, []);

  const handleNavigate = (type) => {
    navigate("/ProgramDetails", { state: { programType: type } });
  };

  return (
    <div className="container-fluids">
      <div className="western-header"></div>

      <div className="bg-custom mt-2.5">
        <div className="Divider">
          <h1 className="text-light fs-6">Discover more of our programs!</h1>
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
    </div>
  );
};

export default Dashboard;
