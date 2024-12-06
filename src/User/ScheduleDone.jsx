import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../Classes/StepIndicator';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios'; // Make sure you import axios

function ScheduleDone() {
  const navigate = useNavigate();
  const [currentStep] = useState(3); // Assuming step 3 is the confirmation step
  const [show, setShow] = useState(false);
  const [allData, setAllData] = useState({}); // State to hold all reservation data
  const [programType, setProgramType] = useState(''); // State for program type

  const generateReservationId = () => {
    return `REF-${Math.floor(100000 + Math.random() * 900000)}`; // Generate a 6-digit unique ID
  };
  const handleClose = () => setShow(false);
  const handleConfirm = () => setShow(true);
  const handlePrevious = () => {
    navigate('/ScheduleDetails');
  };

  const handleWaiverClick = async () => {
    try {
      if (programType === 'Facilities') {
        console.log('Sending data for Facilities reservation:', allData);
        await axios.post('http://localhost:5000/reservations', allData);
        sessionStorage.removeItem('reservationData');
        sessionStorage.getItem('scheduleDetails');
        
        console.log('Facilities reservation saved successfully.');
      } else if (programType === 'Equipment') {
        console.log('Sending data for Equipment reservation:', allData);
        await axios.post('http://localhost:5000/schedule/equipment', allData);
        sessionStorage.removeItem('reservationData');
        sessionStorage.getItem('scheduleDetails');
        console.log('Equipment reservation saved successfully.');
        
      } else {
        console.log('Unknown program type');
      }
  
      // Navigate to the waiver page
      navigate('/Waiver');
    } catch (error) {
      console.error('Error during reservation process:', error);
    }
  };
  
  useEffect(() => {
    let reservationData = JSON.parse(sessionStorage.getItem('reservationData')) || {};
    const scheduleDetails = JSON.parse(sessionStorage.getItem('scheduleDetails')) || {};
    const reservedEquipment = JSON.parse(sessionStorage.getItem('reservedEquipment')) || [];
    const programType = sessionStorage.getItem('programType'); // Get program type from sessionStorage   console.log({reservationData});    
    // Generate reservation ID if it doesn't already exist
    if (!reservationData.reservation_id) {
      reservationData.reservation_id = generateReservationId();
      sessionStorage.setItem('reservationData', JSON.stringify(reservationData)); // Save back to sessionStorage
    }

    setAllData({ ...reservationData, ...scheduleDetails, reservedEquipment });
    setProgramType(programType);
  }, []);

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mb-4">
        <h1 className="Maintext animated slideInRight">Reservation Confirmation</h1>
        <p className="Subtext text-muted">Please review your booking details below.</p>
      </div>

      <div className="calendar-container">
        <StepIndicator currentStep={currentStep} />

        <Card className="shadow-sm mt-4 border-0">
          <Card.Body>
            <div className="text-center mb-3">
              <h2 className="fw-bold">Reservation</h2>
              <p className="text-muted">
                Booking Reference: <strong>{allData.reservation_id || 'N/A'}</strong>
              </p>
            </div>
            <hr />

            <Row>
              <Col md={6}>
                <h5 className="text-primary">Reservation Details</h5>
                {programType === 'Facilities' ? (
                  <Table bordered hover size="sm" className="mt-3">
                    <tbody>
                      <tr>
                        <td><strong>Type:</strong></td>
                        <td>{allData.reservation_type || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Start Date:</strong></td>
                        <td>{new Date(allData.start_date).toLocaleDateString() || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>End Date:</strong></td>
                        <td>{new Date(allData.end_date).toLocaleDateString() || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Time Slot:</strong></td>
                        <td>{allData.time_slot || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </Table>
                ) : programType === 'Equipment' ? (
                  <Table bordered hover size="sm" className="mt-3">
                    <tbody>
                      <tr>
                        <td><strong>Program Type:</strong></td>
                        <td>{programType || 'N/A'}</td>
                      </tr>
                      {allData.reservedEquipment && allData.reservedEquipment.length > 0 ? (
                        allData.reservedEquipment.map((item, index) => (
                          
                          <tr key={index}>
                            <td><strong>Equipment Name:</strong></td>
                            <td>{item.name || 'N/A'} </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td><strong>No equipment reserved</strong></td>
                          <td>N/A</td>
                        </tr>
                      )}
                      {allData.reservedEquipment.map((item, index) => (
                        <tr key={index}>
                          <td><strong>Quantity:</strong></td>
                          <td>{item.quantity || 'N/A'}</td>
                        </tr>
                      ))}
                      {/* Display the start and end dates */}
                      <tr>
                        <td><strong>Start Date:</strong></td>
                        <td>{allData.startDate ? new Date(allData.startDate).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>End Date:</strong></td>
                        <td>{allData.endDate ? new Date(allData.endDate).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    </tbody>
                  </Table>
                ) : (
                  <p>Program type not recognized.</p>
                )}                
              </Col>

              {/* Participant Details */}
              <Col md={6}>
                <h5 className="text-primary">Participant Details</h5>
                {allData.reservation_type === 'Group' ? (
                  <>
                    <Table bordered hover size="sm" className="mt-3">
                      <tbody>
                        <tr>
                          <td><strong>Participants:</strong></td>
                          <td>
                            {allData.participants?.length > 0 ? (
                              allData.participants.slice(0, 5).map((participant, index) => (
                                <li key={index}>{participant.username}</li>
                              ))
                            ) : (
                              <li>N/A</li>
                            )}
                            {allData.participants?.length > 5 && (
                              <li>...and {allData.participants.length - 5} more</li>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Shared Age:</strong></td>
                          <td>{allData.participants?.[0]?.age || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>Shared Email:</strong></td>
                          <td>{allData.participants?.[0]?.email || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <Table bordered hover size="sm" className="mt-3">
                    <tbody>
                      <tr>
                        <td><strong>Full Name:</strong></td>
                        <td>{allData.participants?.[0]?.username || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Age:</strong></td>
                        <td>{allData.participants?.[0]?.age || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{allData.participants?.[0]?.email || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Modal */}
        {show && (
          <div className="ModalOverlayStyles">
            <div className="ModalStyles large">
              <button className="closeButton" onClick={handleClose} aria-label="Close">
                <i className="bi bi-x-circle"></i>
              </button>
              <div className="text-center">
                <i className="bi bi-check2-circle text-success" style={{ fontSize: '4rem' }}></i>

                <h2 className="mt-3 mb-3">Your reservation is confirmed!</h2>
                <p>
                  Thank you for booking with us. Please proceed to Waiver for Rules and Policy.
                </p>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="ModalButtonStyles SmallButton btn-dark small"
                  onClick={handleWaiverClick}
                >
                  <i className="bi bi-file-earmark mb-1"></i> View Waiver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="ModalButtonStyles SmallButton btn-dark super-small"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className="ModalButtonStyles SmallButton btn-db super-small"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDone;
