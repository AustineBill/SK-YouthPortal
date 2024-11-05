import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import HistoryImage from "../Asset/location.png"
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  return(
    <div className="container-fluid">
      <Breadcrumb className="ms-5">
        <Breadcrumb.Item onClick={() => navigate('/About')}>About</Breadcrumb.Item>
          <Breadcrumb.Item active>SK History</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start">
        <h1 className="Maintext animated slideInRight">History</h1>
        <p className="Subtext">Lorem ipsum dolor sit amet consectetur</p>
      </div>

      <div className="History-container">
        <div className="history-text-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          s</p>
        </div>
        <img 
          src= {HistoryImage}
          alt="SK Youth Spotlights" 
          className="history-image-content" 
        />
      </div>
    </div>

  )
}
  
   

export default History;
