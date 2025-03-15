import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import { Breadcrumb } from "react-bootstrap";
import "../WebStyles/CalendarStyles.css";

import AdminGymCalendar from "../Admin/Calendars/AdminGymCalendar";

const ViewFacilities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { programType } = state || {};

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5 mt-3">
        <Breadcrumb.Item onClick={() => navigate("/UserProgram")}>
          Programs
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() =>
            navigate("/ProgramDetails", { state: { programType } })
          }
        >
          Program Details
        </Breadcrumb.Item>
        <Breadcrumb.Item active>View Facilities Reservation</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">
          View Facilities Schedules
        </h1>
        <p className="Subtext">Monitor Available Slots</p>
      </div>

      <AdminGymCalendar />
    </div>
  );
};

export default ViewFacilities;
