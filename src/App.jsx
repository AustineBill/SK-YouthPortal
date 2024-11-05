import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from "./Classes/Navbar";
import Footer from "./Classes/Footer";
import UserNavbar from "./Classes/UserNavbar";
import UserAuthentication from './Classes/UserAuthentication';

// Main Pages
import Intro from "./Mainpages/Splash";
import OverviewProgram from "./Mainpages/OverProgram";
import Contact from "./Mainpages/Contacts";
import About from "./Mainpages/About";
import Spotlight from './Mainpages/Spotlights';
import NewsEvents from './Mainpages/NewsEvents';
import ViewDetailed from './Mainpages/NewsDetails';

/* Sub Pages */
import Mandate from "./Mainpages/Mandates";
import Council from "./Mainpages/Council";
import FormerSK from './Mainpages/FormerSK';
import History from "./Mainpages/SkHistory";

/* User Side */ 
import Profile from "./User/Profile";
import Dashboard from "./User/Dashboard";
import Programs from "./User/UserProgram";
import Log from "./User/ReserveLog";
import HelpSupport from "./User/HelpSupport";
import ProgramDescript from './User/ProgramDetails';
import Reservation from './User/Reservation';
import ReservationDetails from './User/ReservationDetails';
import CancelReservation from './User/Cancellation';
import ViewSchedule from './User/ViewSchedule';
import ScheduleDetails from './User/ScheduleDetails';
import ScheduleDone from './User/ScheduleDone';

import StepIndicator from './Classes/StepIndicator';

// Admin Side
import AdminNavbar from './Classes/AdminNavbar';
import AdminMain from './Admin/Admin-Main'; // Adjust the path if necessary
import AdminReservation from './Admin/AdminReservation';
import ManageHome from './Admin/AdminManageHome';
import ManageAboutUs from './Admin/AdminManageAboutUs';
import ManageProgram from './Admin/AdminManageProgram';
import ManageContactUs from './Admin/AdminManageContactUs';
import Reports from './Admin/AdminReports';
import Users from './Admin/AdminUsers';
import { AuthProvider } from './WebStructure/AuthContext'; // Only import AuthProvider

import './App.css';
import './style.css';
import './Admin/styles/Admin-Style.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    return localStorage.getItem('isUserLoggedIn') === 'true' ? true : false;
  });

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
              {/* Conditional Navbar rendering */}
              {!isAdminLoggedIn && !isUserLoggedIn && <Navbar />}
              {isUserLoggedIn && <UserNavbar setIsUserLoggedIn={setIsUserLoggedIn} />}
              {isAdminLoggedIn && <AdminNavbar />}
            
              <div className="d-flex flex-column min-vh-100"> 
                <Routes>
                  {/* Landing Page Routes */}
                  <Route path="/" element={<Intro />} />
                  <Route path="/Splash" element={<Intro />} />
                  <Route path="/Overview" element={<OverviewProgram />} />
                  <Route path="/About" element={<About />} />
                  <Route path="/Mandate" element={<Mandate />} /> 
                  <Route path="/Council" element={<Council />} />
                  <Route path="/FormerSK" element={<FormerSK />} /> 
                  <Route path="/History" element={<History />} />
                  <Route path="/ContactUs" element={<Contact />} />
                  <Route path="/userauth" element={<UserAuthentication setIsAdminLoggedIn={setIsAdminLoggedIn} 
                                                                      setIsUserLoggedIn={setIsUserLoggedIn} />} />
                  <Route path="/Spotlight" element={<Spotlight />} />
                  <Route path="/News" element={<NewsEvents />} />
                  <Route path="/NewsDetails/:id" element={<ViewDetailed />} />
                  
                  {/* User Side Routes */}
                  <Route path="/Dashboard" element={<Dashboard />} />
                  <Route path="/Profile/:username" element={<Profile />} />
                  <Route path="/UserProgram" element={<Programs />} />
                  <Route path="/ProgramDetails" element={<ProgramDescript />} />
                  <Route path="/Reservation" element={<Reservation />} />
                  <Route path="/ViewSchedule" element={<ViewSchedule />} />
                  <Route path="/StepIndicator" element={<StepIndicator />} />
                  <Route path="/ScheduleDetails" element={<ScheduleDetails />} />
                  <Route path="/ScheduleDone" element={<ScheduleDone />} />
                  <Route path="/ReservationLog" element={<Log />} />
                  <Route path="/ReservationDetails" element={<ReservationDetails />} />
                  <Route path="/Cancellation" element={<CancelReservation />} />

                  <Route path="/Contact" element={<HelpSupport />} />

                  {/* Admin Side Routes */}
                  <Route path="/admin/reservation" element={<AdminReservation />} />
                  <Route path="/admin" element={<AdminMain isAdmin={isAdminLoggedIn} />} /> 
                  <Route path="/admin/manage-home" element={<ManageHome />} />
                  <Route path="/admin/manage-about-us" element={<ManageAboutUs />} />
                  <Route path="/admin/manage-program" element={<ManageProgram />} />
                  <Route path="/admin/manage-contact-us" element={<ManageContactUs />} />
                  <Route path="/admin/reports" element={<Reports />} />
                  <Route path="/admin/users" element={<Users />} />
                </Routes>
              </div>
              {!isAdminLoggedIn && <Footer />}
            </>
         )}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
