import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Table } from 'react-bootstrap';
import axios from 'axios'; // Make sure you import axios

const BorrowWaiver = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState({});  // State for reservation data
  const [isChecked, setIsChecked] = useState(false);

  const saveReservation = async () => {
    try {
      await axios.post('http://localhost:5000/schedule/equipment', allData);
      console.log('Facilities reservation saved successfully.');
    } catch (error) {
      console.error('Error during reservation process:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isChecked) {
      alert('Thank you for agreeing to the terms and conditions.');
      saveReservation(); // Save reservation after agreement
      navigate('/ReservationLog'); // Navigate to Borrow Waiver
    } else {
      alert('Please agree to the terms and conditions to proceed.');
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    let reservationData = JSON.parse(sessionStorage.getItem('reservationData')) || {};
    const scheduleDetails = JSON.parse(sessionStorage.getItem('scheduleDetails')) || {};
    const reservedEquipment = JSON.parse(sessionStorage.getItem('reservedEquipment')) || [];
    setAllData({ ...reservationData, ...scheduleDetails, reservedEquipment });
  }, []);  // Fetch data on component mount

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">BorrowWaiver</h1>
        <p className="Subtext">BORROWER'S SLIP</p>
      </div>

      <Container>
        <h3> Borrower's Name: </h3>  
        <h3> Date:  </h3> 

        <h4>Pledge of Responsibility for Borrowed Items</h4>

        <div className="terms-and-conditions overflow-auto" style={{ maxHeight: '400px' }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>No. of Items</th>
                <th>Item/s</th>
                <th>Date Returned</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
          <p>
            I hereby acknowledge the receipt of the items listed above, borrowed from the office of the Sangguniang Kabataan of Western Bicutan. I affirm that all items are correct and in good condition at the time of receipt.
            I understand and agree to the following terms:
          </p>

          <h6>1. I will take all necessary precautions to ensure that the borrowed items are handled with due care and maintained in good condition throughout the period of use.</h6>
          <h6>2. In the event that any item is damaged, I acknowledge that I will be held liable for the actual repair or replacement of the damaged item. The corresponding value will be determined based on the current market value or the purchase price of the item, whichever is higher.</h6>
          <h6>3. In the event that any item is lost, I acknowledge that I will be responsible for reimbursing the full cost of the lost item. The corresponding price will be determined based on the current market value or the purchase price of the lost item, whichever is higher.</h6>
          <h6>4. All borrowed items must be returned to the office of the Sangguniang Kabataan of Western Bicutan by the agreed-upon date. Failure to return the items on time may result in a fine or other penalties.</h6>
          <h6>5. I affirm that the borrowed items will only be used for the agreed-upon purpose and that I will not be allowed to borrow any items in the future if any of the terms and conditions are violated.</h6>
          <h6>6. By signing below, I agree to these terms and accept full responsibility for the borrowed items.</h6>
        </div>

        <h2>Agreement:</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Check
            type="checkbox"
            id="agreementCheckbox"
            label="I agree to the terms and conditions outlined above."
            checked={isChecked}
            onChange={handleCheckboxChange}
            required
          />
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </Form>
      </Container>
    </div>
  );
};

export default BorrowWaiver;
