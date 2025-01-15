import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./WebStructure/AuthContext";

import Navbar from "./Classes/Navbar";
import Footer from "./Classes/Footer";
import UserNavbar from "./Classes/UserNavbar";
import UserAuthentication from "./Classes/UserAuthentication";

// Main Pages
import Intro from "./Mainpages/Home";
import Contact from "./Mainpages/Contacts";
import About from "./Mainpages/About";
import Spotlight from "./Mainpages/Spotlights";
import NewsEvents from "./Mainpages/NewsEvents";

/* Sub Pages */
import Mandate from "./Mainpages/Mandates";
import Council from "./Mainpages/Council";

/* User Side */
import Profile from "./User/Profile";
import Dashboard from "./User/Dashboard";
import Programs from "./User/UserProgram";
import Log from "./User/ReserveLog";
import ProgramDescript from "./User/ProgramDetails";

import Equipment from "./User/Equipment";
import EquipReservation from "./User/EquipReservation";
import ViewEquipment from "./User/ViewEquipment";

import Reservation from "./User/Reservation";
import ReservationDetails from "./User/ReservationDetails";
import ViewFacilities from "./User/ViewFacilities";
import ReservationWaiver from "./User/ReservationWaiver";

import ScheduleDetails from "./User/ScheduleDetails";
import ScheduleDone from "./User/ScheduleDone";
import BorrowWaiver from "./User/BorrowWaiver";
import CancelReservation from "./User/Cancellation";

// Admin Side
import AdminNavbar from "./Classes/AdminNavbar";
import AdminSidebar from "./Admin/AdminSidebar"; // Import AdminSidebar
import AdminMain from "./Admin/Admin-Main"; // Adjust the path if necessary
import AdminReservations from "./Admin/AdminReservations"; //Wala na to.
import AdminGymReservation from "./Admin/AdminGymReservation";
import AdminEquipmentReservation from "./Admin/AdminEquipmentReservation";
import ManageHome from "./Admin/AdminManageHome";
import ManageAboutUs from "./Admin/AdminManageAboutUs";
import ManageProgram from "./Admin/AdminManageProgram";
import ManageContactUs from "./Admin/AdminManageContactUs";
import Reports from "./Admin/AdminReports";
import Users from "./Admin/AdminUsers";
import UserDetails from "./Admin/UserDetails";
import InventoryTable from "./Admin/Inventory";

//Structure
import StepIndicator from "./Classes/StepIndicator";

import "./App.css";
import "./WebStyles/WebStyle.css";
import "./WebStyles/CalendarStyles.css";
import "./WebStyles/MediaQuiries.css";

import "./Admin/styles/Admin-Style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NavBarSwitcher = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  if (isAdmin) {
    return (
      <>
        <AdminNavbar />
        <AdminSidebar />
      </>
    );
  } else if (isAuthenticated) {
    return <UserNavbar />;
  } else {
    return <Navbar />;
  }
};

const FooterSwitcher = () => {
  const { isAdmin } = useContext(AuthContext);

  // Only hide footer for admins
  if (isAdmin) {
    return null;
  }
  // Render footer for everyone else (authenticated and unauthenticated users)
  return <Footer />;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const { ProtectedRoute, isAdmin, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  console.log({ isAuthenticated, isAdmin });

  return (
    <AuthProvider>
      <Router>
        <div>
          {loading ? (
            <div
              id="spinner"
              className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
            >
              <div
                className="spinner-grow text-primary"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <NavBarSwitcher />
              <Routes>
                {/* Landing Page Routes */}
                <Route path="/" element={<Intro />} />
                <Route path="/Home" element={<Intro />} />
                <Route path="/About" element={<About />} />
                <Route path="/Mandate" element={<Mandate />} />
                <Route path="/Council" element={<Council />} />
                <Route path="/ContactUs" element={<Contact />} />
                <Route path="/userauth" element={<UserAuthentication />} />
                <Route path="/Spotlight" element={<Spotlight />} />
                <Route path="/News" element={<NewsEvents />} />
                <Route path="/UserProgram" element={<Programs />} />
                {/* User Side Routes */}
                <Route
                  path="/Dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Profile/:username"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ProgramDetails"
                  element={
                    <ProtectedRoute>
                      <ProgramDescript />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ReservationLog"
                  element={
                    <ProtectedRoute>
                      <Log />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/StepIndicator"
                  element={
                    <ProtectedRoute>
                      <StepIndicator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Equipment"
                  element={
                    <ProtectedRoute>
                      <Equipment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/EquipReservation"
                  element={
                    <ProtectedRoute>
                      <EquipReservation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewEquipment"
                  element={
                    <ProtectedRoute>
                      <ViewEquipment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ReservationWaiver"
                  element={
                    <ProtectedRoute>
                      <ReservationWaiver />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Reservation"
                  element={
                    <ProtectedRoute>
                      <Reservation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ViewFacilities"
                  element={
                    <ProtectedRoute>
                      <ViewFacilities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/BorrowWaiver"
                  element={
                    <ProtectedRoute>
                      <BorrowWaiver />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ScheduleDetails"
                  element={
                    <ProtectedRoute>
                      <ScheduleDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ScheduleDone"
                  element={
                    <ProtectedRoute>
                      <ScheduleDone />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ReservationDetails"
                  element={
                    <ProtectedRoute>
                      <ReservationDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Cancellation"
                  element={
                    <ProtectedRoute>
                      <CancelReservation />
                    </ProtectedRoute>
                  }
                />
                {/* Admin Side Routes */}
                <Route
                  path="/admin/reservations"
                  element={<AdminReservations />}
                />{" "}
                {/* Wala na to. */}
                <Route path="/admin" element={<AdminMain />} />
                <Route path="/admin/manage-home" element={<ManageHome />} />
                <Route
                  path="/admin/manage-about-us"
                  element={<ManageAboutUs />}
                />
                <Route
                  path="/admin/manage-program"
                  element={<ManageProgram />}
                />
                <Route
                  path="/admin/manage-contact-us"
                  element={<ManageContactUs />}
                />
                <Route
                  path="/admin/gym-reservation"
                  element={<AdminGymReservation />}
                />
                <Route
                  path="/admin/equipment-reservation"
                  element={<AdminEquipmentReservation />}
                />
                <Route path="/admin/Inventory" element={<InventoryTable />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/user/:id" element={<UserDetails />} />
              </Routes>
              {!isAdmin && <FooterSwitcher />}
            </>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
