import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Classes/Navbar";
import Footer from "./Classes/Footer";
import UserNavbar from "./Classes/UserNavbar";
// Main Pages
import Intro from "./Mainpages/Splash";
import OverviewProgram from "./Mainpages/OverProgram";
import Contact from "./Mainpages/Contacts";
import About from "./Mainpages/About";
import Spotlight from './Mainpages/Spotlights';
import NewsEvents from './Mainpages/NewsEvents';
import ViewDetailed from './Mainpages/NewsDetails';
// User Side
import UserAuthentication from './Classes/UserAuthentication';
import Dashboard from "./User/Dashboard";
import Profile from "./User/Profile";
import Programs from "./User/UserProgram";
import Reservation from './User/Reservation';
import HelpSupport from "./User/HelpSupport";
// Admin Side
import AdminNavbar from './Classes/AdminNavbar';
import AdminMain from './Admin/Admin-Main'; // Adjust the path if necessary
import AdminReservation from './Admin/AdminReservation'; 

import './App.css';
import './style.css';
import './Admin/styles/Admin-Style.css'; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    // Check localStorage for user login state
    return localStorage.getItem('isUserLoggedIn') === 'true';
  });

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
            {/* Conditional Navbar rendering */}
            {!isAdminLoggedIn && !isUserLoggedIn && <Navbar />}
            {isUserLoggedIn && <UserNavbar setIsUserLoggedIn={setIsUserLoggedIn} />}
            {isAdminLoggedIn && <AdminNavbar />}
            
            <div className="d-flex flex-column min-vh-100"> 
              <Routes>
                {/* Landing Page Routes */}
                <Route path="/Splash" element={<Intro />} />
                <Route path="/Overview" element={<OverviewProgram />} />
                <Route path="/About" element={<About />} />
                <Route path="/ContactUs" element={<Contact />} />
                <Route path="/userauth" element={<UserAuthentication setIsAdminLoggedIn={setIsAdminLoggedIn} 
                                                                    setIsUserLoggedIn={setIsUserLoggedIn} />} />
                <Route path="/Spotlight" element={<Spotlight />} />
                <Route path="/News" element={<NewsEvents />} />
                <Route path="/NewsDetails/:id" element={<ViewDetailed />} />
                
                {/* User Side Routes */}
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/UserProgram" element={<Programs />} />
                <Route path="/Reservation" element={<Reservation />} />
                <Route path="/Contact" element={<HelpSupport />} />
                
                {/* Admin Side Routes */}
                <Route path="/admin/reservation" element={<AdminReservation />} />
                <Route path="/admin" element={<AdminMain isAdmin={isAdminLoggedIn} />} /> 
              </Routes>
            </div>
            {!isAdminLoggedIn && <Footer />}
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
