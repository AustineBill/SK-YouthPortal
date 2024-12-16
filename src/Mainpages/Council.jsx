import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Council = () => {
  const [councilMembers, setCouncilMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCouncilMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/Skcouncil'); // Adjust the endpoint if necessary
        setCouncilMembers(response.data);
      } catch (error) {
        console.error('Error fetching SK Council members:', error);
      }
    };

    fetchCouncilMembers();
  }, []);

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5">
        <Breadcrumb.Item onClick={() => navigate('/About')}>About</Breadcrumb.Item>
        <Breadcrumb.Item active>SK Council</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start m-4 mv-8">
        <h1 className="Maintext animated slideInRight">SK Council</h1>
        <p className="Subtext">Lorem ipsum</p>
      </div>

      <div className="council-container">
        {councilMembers.map((member) => (
          <div className="flip-card" key={member.id}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={member.image || 'default_avatar.png'} alt={`${member.name}'s Avatar`} />
                <h1>{member.name}</h1>
                <p className="title">{member.title}</p>
                <p>{member.description}</p>
                <Link to="/"><i className="fa fa-dribbble"></i></Link>
                <Link to="/"><i className="fa fa-twitter"></i></Link>
                <Link to="/"><i className="fa fa-linkedin"></i></Link>
                <Link to="/"><i className="fa fa-facebook"></i></Link>
              </div>
              <div className="flip-card-back">
                <h1>{member.name}</h1>
                <p>{member.title}</p>
                <p>{member.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Council;
