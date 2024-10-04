import React from 'react';
import History from "../Assets/location.png"

const Home = () => (
  
    <div className="container-fluid">
      <div className="text-center text-lg-start">
        <h1 className="Maintext animated slideInRight">History</h1>
        <p className="Subtext">Lorem ipsum dolor sit amet consectetur</p>
      </div>
  
      <div className="History-container">
        <div className="history-text-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>
        <img 
          src= {History}
          alt="SK Youth Spotlights" 
          className="history-image-content" 
        />
      </div>
    </div>
  );

export default Home;
