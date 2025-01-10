import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch programs data from the backend
    fetch('http://localhost:5000/api/programs')
      .then((response) => response.json())
      .then((data) => setPrograms(data))
      .catch((error) => console.error('Error fetching programs:', error));
  }, []);

  const handleNavigate = (type) => {
    navigate('/ProgramDetails', { state: { programType: type } });
  };

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mv-8 mb-5">
        <h1 className="Maintext animated slideInRight">Programs</h1>
        <p className="Subtext">Don't Miss out, Explore now</p>
      </div>

      <div className="d-flex flex-column align-items-center">
        {programs.map((program) => (
          <div className="w-100 d-flex justify-content-center mb-4" key={program.id}>
            <Card className="w-50">
              <Card.Img 
                variant="top" 
                src={program.image_url} 
                alt={program.program_name} 
                 className="program-card-img"
              />
              <Card.Body className="d-flex flex-column align-items-center">
                <Card.Title className="fs-5 fw-bold text-dark">{program.program_name}</Card.Title>
                <Card.Text>{program.heading}</Card.Text>
                <Button
                  variant="dark"
                  onClick={() => handleNavigate(program.program_type)}
                >
                  Explore Now
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>


    </div>
  );
};

export default Programs;
