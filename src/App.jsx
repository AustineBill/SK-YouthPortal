import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from "./Classes/Navbar";
import Footer from "./Classes/Footer";

/* Main Pages */
import OverviewProgram from "./Mainpages/program";
import Contact from "./Mainpages/contactus";
import About from "./Mainpages/aboutus";
import Spotlight from './Mainpages/spotlight';
import NewsEvents from './Mainpages/news';
import ViewDetailed from './Mainpages/news-details';

/* Sub Pages */
import Mandate from "./Mainpages/mandate";
import Youth from "./Mainpages/aboutus";
import Council from "./Mainpages/skcouncil";
import Former from "./Mainpages/former_sk";
import History from "./Mainpages/history";
import UserAuthentication from './Classes/UserAuthentication';

/* User Side */ 
import Dashboard from "./User/Dashboard";
import Programs from "./User/user_program";
import Log from "./User/log";
import HelpSupport from "./User/help_support";
import ProgramDescript from './User/ProgramDetails';
import Reservation from './User/Reservation';
import ViewSchedule from './User/ViewSchedule';
import ScheduleDetails from './User/ScheduleDetails';
import ScheduleDone from './User/ScheduleDone';

import StepIndicator from './Classes/StepIndicator';

import './App.css';
import './style.css';
import './Admin/styles/Admin-Style.css'; // Ensure this path is correct

import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

/* Admin Side */
import AdminReservation from './Admin/AdminReservation'; // Already imported
import AdminMain from './Admin/Admin-Main'; // Adjust the path if necessary


const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // Admin login state

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
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
            <Navbar />
            <div className="content"> 
              <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="/overview" element={<OverviewProgram />} />
                <Route path="/about" element={<About />} />
                <Route path="/mandate" element={<Mandate />} />
                <Route path="/youth" element={<Youth />} />
                <Route path="/council" element={<Council />} />
                <Route path="/former_sk" element={<Former />} />
                <Route path="/history" element={<History />} />
                <Route path="/contactus" element={<Contact />} />
                <Route path="/userauth" element={<UserAuthentication setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
                <Route path="/spotlight" element={<Spotlight />} />
                <Route path="/news" element={<NewsEvents />} />
                <Route path="/news-details/:id" element={<ViewDetailed />} />

                {/* User Side Routes */}
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/ProgramDetails" element={<ProgramDescript />} />
                <Route path="/Reservation" element={<Reservation />} />
                <Route path="/ViewSchedule" element={<ViewSchedule />} />
                <Route path="/StepIndicator" element={<StepIndicator />} />
                <Route path="/ScheduleDetails" element={<ScheduleDetails />} />
                <Route path="/ScheduleDone" element={<ScheduleDone />} />
                <Route path="/log" element={<Log />} />
                <Route path="/contact" element={<HelpSupport />} />

                {/* Admin Side Routes */}
                <Route path="/admin/reservation" element={<AdminReservation />} />
                <Route path="/admin" element={<AdminMain />} />

                {/* Add more admin routes here as needed */}
              </Routes>
            </div>
            {!isAdminLoggedIn && <Footer />} {/* Hide footer if admin is logged in */}
          </>
        )}
      </div>
    </Router>
  );
};

const Intro = () => (
  <div className="container-fluid">
    {/* Intro content remains unchanged */}
  </div>
);

export default App;
