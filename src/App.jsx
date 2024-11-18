import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './WebStructure/AuthContext';

import Navbar from "./Classes/Navbar";
import Footer from "./Classes/Footer";
import UserNavbar from "./Classes/UserNavbar";
import UserAuthentication from './Classes/UserAuthentication';

// Main Pages
import Intro from "./Mainpages/Home";
import Contact from "./Mainpages/Contacts";
import About from "./Mainpages/About";
import Spotlight from './Mainpages/Spotlights';
import NewsEvents from './Mainpages/NewsEvents';
import ViewDetailed from './Mainpages/NewsDetails';

/* Sub Pages */
import Mandate from "./Mainpages/Mandates";
import Council from "./Mainpages/Council";
import History from "./Mainpages/SkHistory";

/* User Side */ 
import Profile from "./User/Profile";
import Dashboard from "./User/Dashboard";
import Programs from "./User/UserProgram";
import Log from "./User/ReserveLog";
import HelpSupport from "./User/HelpSupport";
import ProgramDescript from './User/ProgramDetails';
import Equipment from './User/Equipment';
import Reservation from './User/Reservation';
import ReservationDetails from './User/ReservationDetails';
import CancelReservation from './User/Cancellation';
import ViewSchedule from './User/ViewSchedule';
import ScheduleDetails from './User/ScheduleDetails';
import ScheduleDone from './User/ScheduleDone';


// Admin Side
import AdminNavbar from './Classes/AdminNavbar';
import AdminSidebar from './Admin/AdminSidebar'; // Import AdminSidebar
import AdminMain from './Admin/Admin-Main'; // Adjust the path if necessary
import AdminReservations from './Admin/AdminReservations';
import ManageHome from './Admin/AdminManageHome';
import ManageAboutUs from './Admin/AdminManageAboutUs';
import ManageProgram from './Admin/AdminManageProgram';
import ManageContactUs from './Admin/AdminManageContactUs';
import Reports from './Admin/AdminReports';
import Users from './Admin/AdminUsers';
import UserDetails from './Admin/UserDetails';

//Structure
import StepIndicator from './Classes/StepIndicator';

import './App.css';
import './WebStyles/WebStyle.css'

import './Admin/styles/Admin-Style.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


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
const App = () => {
  const [loading, setLoading] = useState(true);
  const { ProtectedRoute, isAdmin } = useContext(AuthContext);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <AuthProvider>
      <Router>
        <div>
          {loading ? (
            <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
              <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <NavBarSwitcher />
            
              <div className="d-flex flex-column min-vh-100"> 
                <Routes>
                  {/* Landing Page Routes */}
                  <Route path="/" element={<Intro />} />
                  <Route path="/Home" element={<Intro />} />
                  <Route path="/About" element={<About />} />
                  <Route path="/Mandate" element={<Mandate />} /> 
                  <Route path="/Council" element={<Council />} /> 
                  <Route path="/History" element={<History />} />
                  <Route path="/ContactUs" element={<Contact />} />
                  <Route path="/userauth" element={<UserAuthentication/>} />
                  <Route path="/Spotlight" element={<Spotlight />} />
                  <Route path="/News" element={<NewsEvents />} />
                  <Route path="/news-details/:id" element={<ViewDetailed />} />

                  <Route path="/UserProgram" element={<Programs />} />
                  
                  {/* User Side Routes */}
                  <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/Profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/ProgramDetails" element={<ProtectedRoute><ProgramDescript /></ProtectedRoute>} />
                  <Route path="/Equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
                  <Route path="/Reservation" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
                  <Route path="/ViewSchedule" element={<ProtectedRoute><ViewSchedule /></ProtectedRoute>} />
                  <Route path="/StepIndicator" element={<ProtectedRoute><StepIndicator /></ProtectedRoute>} />
                  <Route path="/ScheduleDetails" element={<ProtectedRoute><ScheduleDetails /></ProtectedRoute>} />
                  <Route path="/ScheduleDone" element={<ProtectedRoute><ScheduleDone /></ProtectedRoute>} />
                  <Route path="/ReservationLog" element={<ProtectedRoute><Log /></ProtectedRoute>} />
                  <Route path="/ReservationDetails" element={<ProtectedRoute><ReservationDetails /></ProtectedRoute>} />
                  <Route path="/Cancellation" element={<ProtectedRoute><CancelReservation /></ProtectedRoute>} />
                  <Route path="/Contact" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />

                  {/* Admin Side Routes */}
                  <Route path="/admin/reservations" element={<AdminReservations />} />
                  <Route path="/admin" element={<AdminMain />} /> 
                  <Route path="/admin/manage-home" element={<ManageHome />} />
                  <Route path="/admin/manage-about-us" element={<ManageAboutUs />} />
                  <Route path="/admin/manage-program" element={<ManageProgram />} />
                  <Route path="/admin/manage-contact-us" element={<ManageContactUs />} />
                  <Route path="/admin/reports" element={<Reports />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/user/:id" element={<UserDetails />} />
                </Routes>
              </div>
              {!isAdmin && <Footer />}
            </>
         )}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
