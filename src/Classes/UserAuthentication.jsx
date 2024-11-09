import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../App.css';
import './UserAuthentication.css';

const UserAuthentication = ({ setIsAdminLoggedIn, setIsUserLoggedIn }) => {
    const [view, setView] = useState('signIn'); // Default to 'signIn' view
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentView = queryParams.get('view');
        if (currentView === 'signIn' || currentView === 'signUp') {
            setView(currentView);
        }
    }, [location.search]);

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        alert('Account Created Successfully!');
        setView('signIn'); // Redirect to sign in after sign up
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            if (username === 'admin123' && password === '123') {
                setIsAdminLoggedIn(true);
                navigate('/admin');
            } else {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    setIsUserLoggedIn(true);
                    localStorage.setItem('username', username);
                    localStorage.setItem('isUserLoggedIn', 'true');
                    navigate('/Dashboard');
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
        <div className="container-fluid">
            <div className="row align-items-center mt-3">
                <div className="col-md-7 text-center text-lg-center">
                    <h1 className=" fw-normal fs-3 me-5 animated slideInTop">Lagi't lagi para sa Kabataan,</h1>
                    <h1 className="fw-normal fs-4 me-4 animated slideInLeft"> Barangay at sa Bayan 
                        <span className="fs-1 fw-bold clr-db txt-i-db animated slideInRight"> Sangguniang Kabataan</span>
                    </h1>
                    <p className="IntroDetails animated slideInBottom">Western Bicutan</p>
                </div>

                <div className="col-md-4">
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
                                    <Link to="/forgot-password" className="navbar-brand">
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
                                <div className="sign-up-form-input">
                                    <label>Username:</label>
                                    <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="sign-up-form-input">
                                    <label>Password:</label>
                                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button type="submit">Create Account</button>
                                <div className="sign-up-form-bottom">
                                    <p>Already have an account?</p>
                                    <Link to="/userauth?view=signIn" className="navbar-brand">
                                        <p id='sign-in-button'>Sign in</p>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserAuthentication;
