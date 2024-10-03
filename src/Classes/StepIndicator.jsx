import React, { useEffect, useState } from 'react';
import '../WebStyles/UserStyle.css'

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
      {/* Step 1 */}
      <div className={`step ${completedSteps.includes(1) ? 'completed' : ''} ${currentStep === 1 ? 'current' : ''}`}>
        <div className="step-circle"></div>
        <span>Date and Time</span>
      </div>

      <div className='line'></div>

      {/* Step 2 */}
      <div className={`step ${ completedSteps.includes(2) ? 'completed' : ''} ${currentStep === 2? 'current' : ''}`}>
        <div className="step-circle"></div>
        <span>Details</span>
      </div>

      <div className='line'></div>

      {/* Step 3 */}
      <div className={`step ${completedSteps.includes(3) ? 'completed' : ''} ${currentStep === 3 ? 'current' : ''}`}>
        <div className="step-circle"></div>
        <span>Review and Confirm</span>
      </div>
    </div>
  );
};

export default StepIndicator;
