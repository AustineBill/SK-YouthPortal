import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import Location from "../Asset/location.png";

const Contact = () => {
  const [contactDetails, setContactDetails] = useState({
    contact_number: "",
    location: "",
    gmail: "",
    facebook: "",
  });

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get(
          "https://isked-backend.onrender.com/contact"
        );
        setContactDetails(response.data);
      } catch (err) {
        console.error("Error fetching contact details:", err);
      }
    };

    fetchContactDetails();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="text-center text-lg-start m-4 mv-8">
          <h1 className="Maintext animated slideInRight">Get in Touch</h1>
          <p className="Subtext">Reserve yours now!</p>

          <div className="contact-container mb-3">
            <Card className="ContactCard mx-1">
              <i
                className="bi bi-facebook fa-4x"
                style={{ color: "#0000FF", cursor: "pointer" }}
                onClick={() => {
                  if (contactDetails.facebook) {
                    window.open(contactDetails.facebook, "_blank");
                  } else {
                    alert("Facebook link is not available.");
                  }
                }}
              ></i>
              <Card.Body>
                <Card.Text>Sangguniang Kabataan - Western Bicutan</Card.Text>
              </Card.Body>
            </Card>
            <Card className="ContactCard mx-1">
              <i className="bi bi-phone fa-4x" style={{ color: "#FFD700" }}></i>
              <Card.Body>
                <Card.Text>
                  {contactDetails.contact_number || "Not available"}
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className="ContactCard mx-1">
              <i
                className="bi bi-geo-alt fa-4x"
                style={{ color: "#00008B" }}
              ></i>
              <Card.Body>
                <Card.Text>
                  {contactDetails.location || "Not available"}
                </Card.Text>
              </Card.Body>
            </Card>

            <Card className="ContactCard mx-1 text-center">
              <a
                href={
                  contactDetails.gmail
                    ? `https://mail.google.com/mail/?view=cm&to=${contactDetails.gmail}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  if (!contactDetails.gmail) {
                    e.preventDefault();
                    alert("Gmail link is not available.");
                  }
                }}
              >
                <i
                  className="bi bi-envelope fa-4x"
                  style={{ color: "#FF0000" }}
                ></i>
              </a>
              <Card.Body>
                <Card.Text>{contactDetails.gmail || "Not available"}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      <div className="custom-bg">
        <div className="DividerType2">
          <h1 className="DividerText">
            SK Youth - Western Bicutan is open Monday to Saturday,
          </h1>
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
