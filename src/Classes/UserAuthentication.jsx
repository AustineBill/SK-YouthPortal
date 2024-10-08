import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './UserAuthentication.css';

const UserAuthentication = ({ setIsAdminLoggedIn, setIsUserLoggedIn }) => {
    const [view, setView] = useState('');
    const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentView = queryParams.get('view');
        if (currentView === 'signIn' || currentView === 'signUp') {
            setView(currentView);
        }
    }, [location.search]);

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        setIsSignUpSuccessful(true);
        setView('');
    };

    const handleAdminLogin = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
    
        if (username === 'admin123' && password === '123') {
          setIsAdminLoggedIn(true); // Admin login state set
          navigate('/admin'); // Redirect to admin dashboard
        } else if (username === 'auztine' && password === '12345') {
          setIsUserLoggedIn(true); // User login state set
          navigate('/Dashboard'); // Redirect to user dashboard
        } else {
          alert('Invalid credentials');
        }
      };

    return (
        <div className="auth-page">
            {!isSignUpSuccessful && (
                <div className='welcome'>
                    <div className='welcome1'>
                        <h1>iSKed</h1>
                    </div>
                    <div className='welcome2'>
                        <p>Western Bicutan</p>
                    </div>
                </div>
            )}

            {view === 'signIn' && (
                <div className="sign-in-form">
                    <form onSubmit={handleAdminLogin}>
                        <div className='welcome-back-sign-in'>
                            <h2>Welcome back!</h2>
                        </div>
                        <div className='sign-in-username'>
                            <input type="text" name="username" placeholder='Username' required />
                        </div>
                        <div className='sign-in-password'>
                            <input type="password" name="password" placeholder='Password' required />
                        </div>
                        <div>
                            <Link to="/rawr" className="navbar-brand">
                                <p id='sign-in-forgot-password'>Forgot your password?</p>
                            </Link>
                        </div>
                        <button type="submit">Sign In</button>
                        <div className='sign-in-form-bottom'>
                            <p>Don’t have an account?</p>
                            <Link to="/userauth?view=signUp" className="navbar-brand">
                                <p id='sign-up-button'>Sign up</p>
                            </Link>
                        </div>
                    </form>
                </div>
            )}

            {view === 'signUp' && (
                <div className="sign-up-form">
                    <form onSubmit={handleSignUpSubmit}>
                        <div className='start-with-us-sign-up'>
                            <h2>Start with us!</h2>
                        </div>
                        <div>
                            <p>Lorem Ipsum</p>
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
            )}

    {/* Optional Success Message */ }
{/* {isSignUpSuccessful && (
                <div className="success-message">
                    <h2>Your account is ready!</h2>
                    <p>Your profile information and login credentials have been successfully created. Click "Start Now" to explore the SK Youth program.</p>
                    <form>
                        <button type="submit">START NOW</button>
                    </form>
                </div>
            )} */}
        </div >
    );
};

export default UserAuthentication;
