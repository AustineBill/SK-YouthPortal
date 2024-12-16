import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link} from 'react-router-dom';
import { AuthContext } from '../WebStructure/AuthContext';

import '../App.css';
import './UserAuthentication.css';
const { DecryptionCode } = require('../WebStructure/Codex');

const UserAuthentication = () => {
    const [view, setView] = useState('signIn');
    // New Code:
    const [showAccountActivationFields, setShowAccountActivationFields] = useState(false);
    const [showForgotPasswordCodeField, setShowForgotPasswordCodeField] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    //const [username, setUsername] = useState('');
    //const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [forgotPasswordCode, setForgotPasswordCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [activationCode, setActivationCode] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const { login, adminlogin } = useContext(AuthContext);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentView = queryParams.get('view');
        if (currentView === 'signIn' || currentView === 'signUp') {
            setView(currentView);
        }
    }, [location.search]);

    const handleShowAccountActivationFields = () => {
        if (activationCode.trim() === '') {
            alert('Activation code cannot be blank!');
            return;
        }

        const decryptedCode = DecryptionCode(activationCode);
        console.log('Decrypted Code:', decryptedCode);
        
        if (decryptedCode.length !== 8) {
            alert('Invalid Activation Code');
            return;
        }

        // Send decrypted code to backend for validation
        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activationCode: decryptedCode }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Valid Activation Code') {
                setShowAccountActivationFields(true);
            } else {
                alert('Invalid Activation Code');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during validation.');
        });
    };

    // Di pa to tapos, dapat matrack yung laman.
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
                adminlogin('isAdmin');
                navigate('/admin');
            } else {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                //console.log("Login response data:", data); for debugging only  

                if (response.ok) {
                    const { id, username } = data.user;
                    sessionStorage.setItem('userId', id);
                    login('isAuthenticated', username);
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

    const handleShowForgotPasswordCodeField = () => {
        if (activationCode.trim() === '') {
        alert('Activation code cannot be blank!');
         return;
         }
        setShowForgotPasswordCodeField(true);
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
                                <Link
                                   to="/"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default link behavior
                                        setView('forgotPassword');
                                    }}
                                    className="forgot-password-link"
                                >
                                    Forgot your password?
                                </Link>
                                </div>
                                <button type="submit">Sign In</button>
                                <div className='sign-in-form-bottom'>
                                    <p>Don’t have an account?</p>
                                    <Link
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent default link behavior
                                            navigate('/userauth?view=signUp');
                                        }}
                                        className="sign-up-link"
                                    >
                                        Sign up
                                    </Link>

                                </div>
                            </form>
                        </div>
                    )}

                    {view === 'forgotPassword' && (
                        <div>
                            <form>
                                {!showForgotPasswordCodeField && (
                                    <>
                                        <div className='forgot-password-form-input'>
                                            <label>Email</label>
                                            <input
                                                type='text'
                                                name='signup-username'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleShowForgotPasswordCodeField}
                                            className='activate-account-button rounded'>
                                            Proceed
                                        </button>
                                    </>
                                )}

                                {showForgotPasswordCodeField && (
                                    <>
                                        <div className='forgot-password-form-input'>
                                            <label>Verification Code</label>
                                            <input
                                                type='text'
                                                name='forgot-password-code'
                                                value={forgotPasswordCode}
                                                onChange={(e) => setForgotPasswordCode(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className='forgot-password-form-input'>
                                            <label>New Password</label>
                                            <input
                                                type='password'
                                                name='new-password'
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            // onClick={} Wala pa.
                                            className='activate-account-button rounded'>
                                            Submit
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    )}

                    {view === 'signUp' && (
                        <div className="sign-up-form">
                            <form onSubmit={handleSignUpSubmit}>
                                {!showAccountActivationFields && (
                                    <>
                                        <div className='sign-up-form-input'>
                                            <label>Activation Code</label>
                                            <input
                                                type='text'
                                                name='activation-code'
                                                value={activationCode}
                                                onChange={(e) => setActivationCode(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleShowAccountActivationFields}
                                            className='activate-account-button rounded'>
                                            Proceed
                                        </button>
                                    </>
                                )}

                                {showAccountActivationFields && (
                                    <>
                                        <p>Set up your account</p>
                                        <div className='sign-up-form-input'>
                                            <label>Username:</label>
                                            <input
                                                type='text'
                                                name='signup-username'
                                                value={signupUsername}
                                                onChange={(e) => setSignupUsername(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className='sign-up-form-input'>
                                            <label>Password:</label>
                                            <input
                                                type='password'
                                                name='signup-password'
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className='activate-account-button rounded'>
                                            Activate Account
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserAuthentication;
