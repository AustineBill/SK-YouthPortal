import React, { useEffect, useState } from 'react';
import '../user-style.css'; // Import your custom styling

const StepIndicator = ({ currentStep }) => {
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    // Add the current step to the list of completed steps if not already included
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep];
      }
      return prev;
    });
  }, [currentStep]);

  return (
    <div className="step-indicator-container">
      <div className={`step ${completedSteps.includes(1) ? 'completed' : ''}`}>
        <div className="step-circle"></div>
        <span>Date and Time</span>
      </div>

      <div className={`line ${completedSteps.includes(1) ? 'completed' : ''}`}></div>

      <div className={`step ${completedSteps.includes(2) ? 'completed' : ''}`}>
        <div className="step-circle"></div>
        <span>Details</span>
      </div>

      <div className={`line ${completedSteps.includes(2) ? 'completed' : ''}`}></div>

      <div className={`step ${completedSteps.includes(3) ? 'completed' : ''}`}>
        <div className="step-circle"></div>
        <span>Review and Confirm</span>
      </div>
    </div>
  );
};

export default StepIndicator;
