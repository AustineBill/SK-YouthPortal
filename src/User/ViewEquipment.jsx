import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import EquipmentCalendar from "../Admin/Calendars/EquipmentCalendar";

const ViewEquipment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location; // Access the passed state
  const { programType } = state || {}; // Destructure programType from state

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
        <Breadcrumb.Item active>View Equipment Reservation</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">
          View Equipment Schedule
        </h1>
        <p className="Subtext">Monitor Available Slots</p>
      </div>

      <EquipmentCalendar blockedDates={[]} />
    </div>
  );
};

export default ViewEquipment;
