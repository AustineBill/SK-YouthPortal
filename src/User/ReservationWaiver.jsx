import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';
import axios from 'axios'; // Make sure you import axios

const ReservationWaiver = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState({});  // State for reservation data

  const saveReservation = async () => {
    try {
      await axios.post('http://localhost:5000/reservations', allData);
      console.log('Facilities reservation saved successfully.');
    } catch (error) {
      console.error('Error during reservation process:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isChecked = event.target.agreementCheckbox.checked;
    if (isChecked) {
      alert('Thank you for agreeing to the terms and conditions.');
      saveReservation(); // Save reservation after agreement
      navigate('/ReservationLog'); // Navigate to Borrow Waiver
    } else {
      alert('Please agree to the terms and conditions to proceed.');
    }
  };

  useEffect(() => {
    let reservationData = JSON.parse(sessionStorage.getItem('reservationData')) || {};
    const scheduleDetails = JSON.parse(sessionStorage.getItem('scheduleDetails')) || {};
    setAllData({ ...reservationData, ...scheduleDetails }); // Combine session data
  }, []);  // Fetch data on component mount


  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">Waiver</h1>
        <p className="Subtext">CONTRACT'S SLIP</p>
      </div>

      <Container>
        
        <h4>TEENBAYAN: A safe space for youth</h4>

        <h3>Assumption of Risk:</h3>
        <p>
          I, the undersigned, understand that participating in physical exercise, fitness programs, and other activities at TEENBAYAN: A safe space for youth involves inherent risks, including but not limited to injury, heart attack, muscle strain, and other physical and emotional injuries. I voluntarily assume all risk associated with my participation in these activities.
        </p>

        <h3>Release and Waiver:</h3>
        <p>
          In consideration of being allowed to participate in the activities and programs at TEENBAYAN: A safe space for youth, I hereby release, discharge, and hold harmless TEENBAYAN: A safe space for youth, its owners, employees, instructors, trainers, agents, and representatives from any and all claims, actions, suits, procedures, costs, expenses, damages, and liabilities, including attorney's fees, brought as a result of my involvement at TEENBAYAN: A safe space for youth and to reimburse them for any such expenses incurred.
        </p>

        <h3>Medical Disclaimer:</h3>
        <p>
          I acknowledge that TEENBAYAN: A safe space for youth is not responsible for any health conditions that may result from participating in the fitness programs, exercises, or activities at TEENBAYAN: A safe space for youth. I represent and warrant that I am in good physical condition and do not have any medical conditions that would prevent my participation.
        </p>

        <h3>Terms and Conditions:</h3>
        <h6>1. Access and Use:</h6>
        <p>Member will have access to the Gym facilities during operating hours, which are 9:00 AM - 7:00 PM.</p>
        <p>Member agrees to follow all Gym rules and regulations, including those posted in the Gym.</p>

        <h6>2. Health and Safety:</h6>
        <p>Member affirms that they are in good health and do not have any medical conditions that would prevent them from participating in any physical activity at the Gym.</p>
        <p>If any member experiences any discomfort or pain while using the equipment or engaging in exercises, they must stop immediately and notify Gym staff.</p>

        <h6>3. Liability Waiver:</h6>
        <p>Member acknowledges that participation in physical activities and use of the Gym facilities involves inherent risks, including but not limited to bodily injury.</p>
        <p>Member voluntarily assumes all risks associated with their use of the Gym.</p>
        <p>Member agrees to release, discharge, and hold harmless the Gym, its owners, employees, instructors, trainers, agents, and representatives from any and all claims, demands, damages, rights of action, or causes of action arising out of or connected with the Member's use of the Gym facilities.</p>

        <h6>4. Photo/Video Release:</h6>
        <p>Member agrees to allow their photo, video, or film likeness to be used for any legitimate purpose by the Gym, including but not limited to marketing materials and social media.</p>

        <h6>5. Severability:</h6>
        <p>If any provision of this Contract is found to be unenforceable, the remaining terms shall be enforced to the fullest extent permitted by law.</p>

        <h3>Agreement:</h3>
        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Check
            type="checkbox"
            id="agreementCheckbox"
            label="I agree to the terms and conditions outlined above."
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

export default ReservationWaiver;
