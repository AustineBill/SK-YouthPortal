import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './styles/AdminManageContactUs.css';
import '../WebStyles/Admin-CSS.css';

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
        const response = await axios.get('https://sk-youthportal-1-mkyu.onrender.com/contact');
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
      const response = await axios.put('https://sk-youthportal-1-mkyu.onrender.com/contact', newContactDetails);
      console.log("Response:", response); // Log the response from the backend
      setContactDetails(newContactDetails); // Update the state with new contact details
      setActiveContent('manageContactDetails');
    } catch (error) {
      console.error('Error saving contact details:', error);
    }
  };

  return (
    <div className='admin-contact-us-container'>
      <div className='admin-contact-us-label-and-button d-flex justify-content-between align-items-center'>
          <h2 className='admin-contact-us-label-h2 fst-italic'>
            {pageLabels[activeContent]}
          </h2>

        {activeContent !== 'manageContactDetails' && (
          <div className='admin-contact-us-back-button'>
            <button
              onClick={() => setActiveContent('manageContactDetails')}
              className='admin-edit-contact-details-back-button rounded'>
              Back
            </button>
          </div>
        )}
      </div>

      <div className='admin-contact-us-contents-container d-flex justify-content-center'>
        {activeContent === 'manageContactDetails' && (
          <div className='admin-current-contacts-details-container d-flex justify-content-center'>
            {/* Group of Current Contact Details Form */}
            <div className='admin-contacts-details-group d-flex flex-column align-items-center'>
              <div className='admin-current-contact-form d-flex flex-column'>
                <label className='admin-current-contact-label'>Contact Number</label>
                <input
                  type='text'
                  value={contactDetails.contact_number}
                  readOnly
                />
              </div>

              <div className='admin-current-contact-form d-flex flex-column'>
                <label className='admin-current-contact-label'>Location</label>
                <input
                  type='text'
                  value={contactDetails.location}
                  readOnly
                />
              </div>

              <div className='admin-current-contact-form d-flex flex-column'>
                <label className='admin-current-contact-label'>Email</label>
                <input
                  type='text'
                  value={contactDetails.gmail}
                  readOnly
                />
              </div>

              <button
                onClick={() => setActiveContent('editContactDetails')}
                className='admin-edit-contact-details-button rounded'>
                Edit Details
              </button>
            </div>
          </div>
        )}

        {activeContent === 'editContactDetails' && (
          <div className='admin-edit-contacts-details-container d-flex justify-content-center'>
            {/* Group of Edit Contact Details Form */}
            <form className='admin-edit-contacts-details-group d-flex flex-column align-items-center'>
              <div className='admin-edit-contact-form d-flex flex-column'>
                <label className='admin-edit-contact-label'>Contact Number</label>
                <input
                  type='text'
                  value={newContactDetails.contact_number}
                  onChange={(e) =>
                    setNewContactDetails({ ...newContactDetails, contact_number: e.target.value })
                  }
                />
              </div>

              <div className='admin-edit-contact-form d-flex flex-column'>
                <label className='admin-edit-contact-label'>Location</label>
                <input
                  type='text'
                  value={newContactDetails.location}
                  onChange={(e) =>
                    setNewContactDetails({ ...newContactDetails, location: e.target.value })
                  }
                />
              </div>

              <div className='admin-edit-contact-form d-flex flex-column'>
                <label className='admin-edit-contact-label'>Email</label>
                <input
                  type='email'
                  value={newContactDetails.gmail}
                  onChange={(e) =>
                    setNewContactDetails({ ...newContactDetails, gmail: e.target.value })
                  }
                />
              </div>

              <button
                onClick={saveContactDetails}
                className='admin-save-contact-details-button rounded text-white'>
                Save Details
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContactUs;