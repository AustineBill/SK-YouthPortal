import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserAuthentication = ({ setIsAdminLoggedIn }) => {
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
            setIsAdminLoggedIn(true); // Update the admin login state in App component
            navigate('/Admin/Admin-Main'); // Redirect to admin reservation page
        } else {
            alert('Invalid admin credentials');
        }
    };

    return ( 
        <div className="auth-page">
            {!isSignUpSuccessful && (
                <div className='welcome'>
                    <div className='welcome1'>
                        <p>Your court, your time.</p>
                    </div>
                    <div className='welcome2'>
                        <p>Play together with</p>
                        <h1 id='iReserba'>iReserba</h1>
                    </div>
                </div>
            )}

            {view === 'signIn' && (
                <div className="sign-in-form">
                    <h2>Sign In</h2>
                    <form onSubmit={handleAdminLogin}>
                        <div>
                            <label>Username:</label>
                            <input type="text" name="username" required />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" name="password" required />
                        </div>
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            )}

            {view === 'signUp' && (
                <div className="sign-up-form">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignUpSubmit}>
                        <div>
                            <label>Email:</label>
                            <input type="email" required />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" required />
                        </div>
                        <div>
                            <label>Confirm Password:</label>
                            <input type="password" required />
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
            )}

            {isSignUpSuccessful && (
                <div className="success-message">
                    <h2>Your account is ready!</h2>
                    <p>Your profile information and login credentials have been successfully created. Click "Start Now" to explore the SK Youth program.</p>
                    <form>
                        <button type="submit">START NOW</button>
                    </form>
                </div>
            )}
        </div> 
    );
};

export default UserAuthentication;
