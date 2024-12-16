import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
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
        <p className='Subtext'>{mandateInfo.mandate || 'Loading...'}</p>
      </div>

      <div className="text-center text-lg-start m-5">
        <h1 className="man-maintext animated slideInRight">Mission</h1>
        <p className='man-subtext'>{mandateInfo.mission || 'Loading...'}</p>
      </div>

      <div className="text-center text-lg-end m-5">
        <h1 className="man-maintext animated slideInLeft">Vision</h1>
        <p className='man-subtext'>{mandateInfo.vision || 'Loading...'}</p>
      </div>

      <div className="text-center text-lg-start m-5">
        <h1 className="man-maintext animated slideInRight">Objective</h1>
        <p className='man-subtext'>{mandateInfo.objectives || 'Loading...'}</p>
      </div>
    </div>
  );
};

export default Mandate;
