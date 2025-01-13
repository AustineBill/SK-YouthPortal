import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const BorrowWaiver = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const saveReservation = async () => {
    try {
      await axios.post("http://localhost:5000/schedule/equipment", allData);
      console.log("Facilities reservation saved successfully.");
      setShowModal(true); // Show success modal
    } catch (error) {
      console.error("Error during reservation process:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isChecked) {
      sessionStorage.removeItem("reservationData");
      sessionStorage.removeItem("scheduleDetails");
      sessionStorage.removeItem("reservedEquipment");
      sessionStorage.removeItem("programType");
      saveReservation();
    } else {
      alert("Please agree to the terms and conditions to proceed.");
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    const reservationData =
      JSON.parse(sessionStorage.getItem("reservationData")) || {};
    const scheduleDetails =
      JSON.parse(sessionStorage.getItem("scheduleDetails")) || {};
    const reservedEquipment =
      JSON.parse(sessionStorage.getItem("reservedEquipment")) || [];
    setAllData({ ...reservationData, ...scheduleDetails, reservedEquipment });
  }, []);

  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">BorrowWaiver</h1>
        <p className="Subtext">BORROWER'S SLIP</p>
      </div>

      <div className="calendar-container">
        <h1>Pledge of Responsibility for Borrowed Items</h1>

        <p>
          I hereby acknowledge the receipt of the items listed above, borrowed
          from the office of the Sangguniang Kabataan of Western Bicutan. I
          affirm that all items are correct and in good condition at the time of
          receipt. I understand and agree to the following terms:
        </p>
        <p>
          1. I will take all necessary precautions to ensure that the borrowed
          items are handled with due care and maintained in good condition
          throughout the period of use.
        </p>
        <p>
          2. In the event that any item is damaged, I acknowledge that I will be
          held liable for the actual repair or replacement of the damaged item.
          The corresponding value will be determined based on the current market
          value or the purchase price of the item, whichever is higher.
        </p>
        <p>
          3. In the event that any item is lost, I acknowledge that I will be
          responsible for reimbursing the full cost of the lost item. The
          corresponding price will be determined based on the current market
          value or the purchase price of the lost item, whichever is higher.
        </p>
        <p>
          4. All borrowed items must be returned to the office of the
          Sangguniang Kabataan of Western Bicutan by the agreed-upon date.
          Failure to return the items on time may result in a fine or other
          penalties.
        </p>
        <p>
          5. I affirm that the borrowed items will only be used for the
          agreed-upon purpose and that I will not be allowed to borrow any items
          in the future if any of the terms and conditions are violated.
        </p>
        <p>
          6. By signing below, I agree to these terms and accept full
          responsibility for the borrowed items.
        </p>

        <h3>Agreement:</h3>
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
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="ModalOverlayStyles">
          <div className="ModalStyles large">
            <button
              className="closeButton"
              onClick={() => {
                setShowModal(false);
              }}
              aria-label="Close"
            >
              <i className="bi bi-x-circle"></i>
            </button>
            <div className="text-center">
              <i
                className="bi bi-check2-circle text-success"
                style={{ fontSize: "4rem" }}
              ></i>
              <h2 className="mt-3 mb-3">
                Your reservation has been reserved successfully!
              </h2>
              <p>We hope to see you again soon.</p>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <Button
                variant="dark"
                className="btn-dark"
                onClick={() => navigate("/ReservationLog")}
              >
                <i className="bi bi-house m-1"></i>
                Return to Log
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowWaiver;
