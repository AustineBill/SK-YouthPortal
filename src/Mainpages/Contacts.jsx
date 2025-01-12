import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import Location from '../Asset/location.png'; // Ensure this image path is correct

const Contact = () => {
  const [contactDetails, setContactDetails] = useState({
    contact_number: '',
    location: '',
    gmail: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the contact details using Axios
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contact');
        setContactDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contact details:', err);
        setError('Error fetching contact details');
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, []);  // Empty dependency array means this runs only once when the component mounts

  if (loading) return <div>Loading contact details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="text-center text-lg-start m-4 mv-8">
          <h1 className="Maintext animated slideInRight">Get in Touch</h1>
          <p className="Subtext">Reserve yours now!</p>

          <div className="d-flex justify-content-center mb-3">
            <Card className="ContactCard mx-3">
              <i className="bi bi-phone fa-4x" style={{ color: '#FFD700' }}></i>
              <Card.Body>
                <Card.Text>{contactDetails.contact_number || 'Not available'}</Card.Text>
              </Card.Body>
            </Card>

            <Card className="ContactCard mx-3">
              <i className="bi bi-geo-alt fa-4x" style={{ color: '#00008B' }}></i>
              <Card.Body>
                <Card.Text>{contactDetails.location || 'Not available'}</Card.Text>
              </Card.Body>
            </Card>

            <Card className="ContactCard mx-3">
              <i className="bi bi-envelope fa-4x" style={{ color: '#FF0000' }}></i>
              <Card.Body>
                <Card.Text>{contactDetails.gmail || 'Not available'}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <div className="custom-bg">
        <div className="DividerType2">
           <h1 className="DividerText"> SK Youth - Western Bicutan is open Monday to Saturday,</h1>
           <p className="DividerText"> 8:00 AM - 5:00 PM</p>
        </div>
      </div>


      <p className="Text-3">Find us here!</p>
      <div className="d-flex justify-content-center">
        <img src={Location} alt="Location" />
      </div>
    </div>
  );
};

export default Contact;
