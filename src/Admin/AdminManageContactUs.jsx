import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdminManageContactUs.css';

const pageLabels = {
  manageContactDetails: 'Manage Contact Us Details',
  editContactDetails: 'Edit Contact Us Details'
};

const ManageContactUs = () => {
  const [activeContent, setActiveContent] = useState('manageContactDetails');
  const [contactDetails, setContactDetails] = useState({
    contact_number: '',
    location: '',
    gmail: ''
  });
  const [newContactDetails, setNewContactDetails] = useState(contactDetails);

  // Fetch contact details on component mount
  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contact');
        setContactDetails(response.data);
        setNewContactDetails(response.data); // Pre-fill newContactDetails
      } catch (error) {
        console.error('Error fetching contact details:', error);
      }
    };

    fetchContactDetails();
  }, []);

  // Save updated contact details
  const saveContactDetails = async () => {
    console.log("Saving contact details:", newContactDetails);  // Check what data is being sent
    try {
      const response = await axios.put('http://localhost:5000/contact', newContactDetails);
      console.log("Response:", response); // Log the response from the backend
      setContactDetails(newContactDetails); // Update the state with new contact details
      setActiveContent('manageContactDetails');
    } catch (error) {
      console.error('Error saving contact details:', error);
    }
  };

  return (
    <div className="admin-contact-us-container">
      <div className="label-and-button-container">
        <h2>{pageLabels[activeContent]}</h2>
        {activeContent !== 'manageContactDetails' && (
          <button onClick={() => setActiveContent('manageContactDetails')}>Back</button>
        )}
      </div>

      <div className="component-contents-container">
        {activeContent === 'manageContactDetails' && (
          <div className="contact-us-container">
            <p>Contact Number: {contactDetails.contact_number}</p>
            <p>Location: {contactDetails.location}</p>
            <p>Email: {contactDetails.gmail}</p>
            <button onClick={() => setActiveContent('editContactDetails')}>Edit Details</button>
          </div>
        )}

        {activeContent === 'editContactDetails' && (
          <div className="edit-contact-us-container">
            <label>Contact Number</label>
            <input
              type="text"
              value={newContactDetails.contact_number}
              onChange={(e) =>
                setNewContactDetails({ ...newContactDetails, contact_number: e.target.value })
              }
            />
            <label>Location</label>
            <input
              type="text"
              value={newContactDetails.location}
              onChange={(e) =>
                setNewContactDetails({ ...newContactDetails, location: e.target.value })
              }
            />
            <label>Email</label>
            <input
              type="email"
              value={newContactDetails.gmail}
              onChange={(e) =>
                setNewContactDetails({ ...newContactDetails, gmail: e.target.value })
              }
            />
            <button onClick={saveContactDetails}>Save Details</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContactUs;
