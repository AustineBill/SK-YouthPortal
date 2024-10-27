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

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
    
        try {
            // Check if credentials match admin credentials first
            if (username === 'admin123' && password === '123') {
                setIsAdminLoggedIn(true); // Set Admin login state
                navigate('/admin'); // Redirect to admin dashboard
            } else {
                // If not admin, attempt user login with server verification
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setIsUserLoggedIn(true); // Set user login state
                    localStorage.setItem('username', username); // Save the username
                    localStorage.setItem('isUserLoggedIn', 'true'); // Set login state
                    
                    navigate('/Dashboard'); // Redirect to user dashboard
                    
                } else {
                    alert(data.message || 'Invalid user credentials');
                }

              
                
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
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
                    <form onSubmit={handleLogin}>
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
        </div>
    );
};

export default UserAuthentication;
