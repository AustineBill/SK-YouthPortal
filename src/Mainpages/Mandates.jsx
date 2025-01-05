import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Badge } from 'react-bootstrap';
import axios from 'axios';

const Mandate = () => {
  const [mandateInfo, setMandateInfo] = useState({
    mandate: '',
    objectives: '',
    mission: '',
    vision: '',
  });

  const navigate = useNavigate();

  // Fetch mandate information when the component mounts
  useEffect(() => {
    const fetchMandateInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Website');
        setMandateInfo(response.data);
      } catch (error) {
        console.error('Error fetching mandate info:', error);
      }
    };

    fetchMandateInfo();
  }, []);

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5">
        <Breadcrumb.Item onClick={() => navigate('/About')}>About</Breadcrumb.Item>
        <Breadcrumb.Item active>Mandate</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mv-8">
        <h1 className="Maintext animated slideInRight">Mandate</h1>
        <p className='Subtext'> Goals </p>
      </div>

      {/* Timeline Container */}
      <div className="main-timeline">
        {/* Mandate */}
        <div className="timeline-left">
          <Card className="gradient-custom">
            <Card.Body className="p-4">
              <i className="bi bi-0-circle"></i> 
              <h4>Mandate</h4>
              <p className="small text-white-50 mb-4">Updated Info</p>
              <p>{mandateInfo.mandate || 'Loading Mandate...'}</p>
              <Badge className="text-black mb-0 me-1" bg="light">
                New
              </Badge>
              <Badge className="text-black mb-0" bg="light">
                Admin
              </Badge>
            </Card.Body>
          </Card>
        </div>

        {/* Mission */}
        <div className="timeline-right">
          <Card className="gradient-custom-4">
            <Card.Body className="p-4">
              <i className="bi bi-0-circle"></i> 
              <h4>Mission</h4>
              <p className="small text-white-50 mb-4">Updated Info</p>
              <p>{mandateInfo.mission || 'Loading Mission...'}</p>
              <Badge className="text-black mb-0 me-1" bg="light">
                New
              </Badge>
              <Badge className="text-black mb-0" bg="light">
                Admin
              </Badge>
            </Card.Body>
          </Card>
        </div>

        {/* Vision */}
        <div className="timeline-left">
          <Card className="gradient-custom">
            <Card.Body className="p-4">
              <i className="bi bi-0-circle"></i> 
              <h4>Vision</h4>
              <p className="small text-white-50 mb-4">Updated Info</p>
              <p>{mandateInfo.vision || 'Loading Vision...'}</p>
              <Badge className="text-black mb-0 me-1" bg="light">
                New
              </Badge>
              <Badge className="text-black mb-0" bg="light">
                Admin
              </Badge>
            </Card.Body>
          </Card>
        </div>

        {/* Objectives */}
        <div className="timeline-right">
          <Card className="gradient-custom-4">
            <Card.Body className="p-4">
              <i className="bi bi-0-circle"></i> 
              <h4>Objectives</h4>
              <p className="small text-white-50 mb-4">Updated Info</p>
              <p>{mandateInfo.objectives || 'Loading Objectives...'}</p>
              <Badge className="text-black mb-0 me-1" bg="light">
                New
              </Badge>
              <Badge className="text-black mb-0" bg="light">
                Admin
              </Badge>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mandate;
