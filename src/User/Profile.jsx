

import React from 'react';
import '../WebStyles/UserStyle.css';

const Profile = () => {
  return (
    <div className="profile-container container">
      <div className="row">
        <div className="col-md-3 profile-sidebar">
          <div className="profile-avatar">
            <img
              src="https://via.placeholder.com/150"
              alt="User Avatar"
              className="img-fluid rounded-circle"
            />
          </div>
          <div className="user-name">
            <h5>User's Name</h5>
          </div>
          <button className="btn btn-primary btn-block">Change password</button>
          <button className="btn btn-secondary btn-block">Edit information</button>
        </div>

        <div className="col-md-9 profile-main">
          <h3>Personal Information</h3>
          <div className="personal-info">
            <div className="row">
              <div className="col-sm-6">[Data Field]</div>
              <div className="col-sm-6">[Data Field]</div>
            </div>
            <div className="row">
              <div className="col-sm-12">[Data Field]</div>
            </div>
          </div>

          <h3>Other Information</h3>
          <div className="other-info">
            <div className="row">
              <div className="col-sm-12">[Data Field]</div>
            </div>
            <div className="row">
              <div className="col-sm-6">[Data Field]</div>
              <div className="col-sm-6">[Data Field]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
