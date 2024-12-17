import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
        console.log('Decrypted Activation Code:', decryptedCode);

        if (decryptedCode.length !== 8) {
            alert('Invalid Activation Code');
            return;
        }
        // Send decrypted code to backend for validation
        fetch('http://localhost:5000/ValidateCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activationCode: decryptedCode }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Server Response:', data);
                if (data.message === 'Account Created Successfully') {
                    setShowAccountActivationFields(true);
                } else {
                    alert(data.message || 'Invalid Activation Code');
                }
            })
            .catch((error) => {
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
        <div className='user-authentication-container'>
            <div className='user-authentication-contents d-flex justify-content-center align-items-center'>
                <div className="left-side-contents-container text-center text-lg-center">
                    <h1 className="fw-normal fs-3 me-5">Lagi't lagi para sa Kabataan,</h1>
                    <h1 className="fw-normal fs-4 me-4"> Barangay at sa Bayan
                        <span className="fs-1 fw-bold clr-db txt-i-db animated slideInRight"> Sangguniang Kabataan</span>
                    </h1>
                    <p className="IntroDetails animated slideInBottom">Western Bicutan</p>
                </div>

                <div className='right-side-contents-container d-flex justify-content-center'>
                    {view === 'signIn' && (
                        <div className='sign-in-details-container d-flex justify-content-center rounded'>
                            <form className='sign-in-details-group' onSubmit={handleLogin}>
                                <h1 className='sign-in-welcome fw-bold fst-italic'>Welcome back!</h1>

                                <div className='user-auth-sign-in-form d-flex flex-column'>
                                    <label className='sign-in-label'>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        required />
                                </div>

                                <div className='user-auth-sign-in-form d-flex flex-column'>
                                    <label className='sign-in-label'>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required />
                                </div>

                                <div>
                                    <Link
                                        to="/"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setView('forgotPassword');
                                        }}
                                        className="forgot-password-link text-decoration-none"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>

                                <button
                                    type='submit'
                                    className='sign-in-button fw-bold rounded-pill'
                                >
                                    Sign In
                                </button>

                                <div className='sign-in-form-bottom'>
                                    <p>Don’t have an account?</p>
                                    <Link
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/userauth?view=signUp');
                                        }}
                                        className="sign-up-link text-decoration-none"
                                    >
                                        Sign up
                                    </Link>

                                </div>
                            </form>
                        </div>
                    )}

                    {view === 'forgotPassword' && (
                        <div className='forgot-password-details-container d-flex justify-content-center rounded'>
                            <form className='forgot-password-details-group d-flex text-center'>
                                {!showForgotPasswordCodeField && (
                                    <>
                                        <div className='fp-group-container'>
                                            <h1 className='forgot-password-fp fw-bold fst-italic mb-3'>Forgot Password</h1>
                                            <p className='forgot-password-email-description'>Enter your email address for a link to change your pasword</p>
                                        </div>

                                        <div className='user-auth-forgot-password-form d-flex flex-column text-left'>
                                            <label className='forgot-password-label'>Email</label>
                                            <input
                                                type='text'
                                                name='forgot-password-email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleShowForgotPasswordCodeField}
                                            className='fp-proceed-button fw-bold rounded-pill'>
                                            Proceed
                                        </button>
                                    </>
                                )}

                                {showForgotPasswordCodeField && (
                                    <>
                                        <h1 className='forgot-password-fp fw-bold fst-italic'>Forgot Password</h1>

                                        <div className='user-auth-forgot-password-form d-flex flex-column text-left'>
                                            <label className='forgot-password-label'>Verification Code</label>
                                            <input
                                                type='text'
                                                name='forgot-password-code'
                                                value={forgotPasswordCode}
                                                onChange={(e) => setForgotPasswordCode(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className='user-auth-forgot-password-form d-flex flex-column text-left'>
                                            <label className='forgot-password-label'>New Password</label>
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
                                            className='fp-submit-button fw-bold rounded-pill'>
                                            Submit
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    )}

                    {view === 'signUp' && (
                        <div className='sign-up-details-container d-flex justify-content-center rounded'>
                            <form className='sign-up-details-group d-flex text-center' onSubmit={handleSignUpSubmit}>
                                {!showAccountActivationFields && (
                                    <>
                                        <h1 className='sign-up-su fw-bold fst-italic'>Account Activation</h1>

                                        <div className='user-auth-sign-up-form d-flex flex-column text-left'>
                                            <label className='sign-up-label'>Activation Code</label>
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
                                            className='su-proceed-button fw-bold rounded-pill'>
                                            Proceed
                                        </button>
                                    </>
                                )}

                                {showAccountActivationFields && (
                                    <>
                                        <div className='aa-group-container'>
                                            <h1 className='sign-up-su fw-bold fst-italic mb-3'>Account Activation</h1>
                                            <p className='sign-up-description'>Set up your account</p>
                                        </div>

                                        <div className='user-auth-sign-up-form d-flex flex-column text-left'>
                                            <label className='sign-up-label'>Username:</label>
                                            <input
                                                type='text'
                                                name='signup-username'
                                                value={signupUsername}
                                                onChange={(e) => setSignupUsername(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className='user-auth-sign-up-form d-flex flex-column text-left'>
                                            <label className='sign-up-label'>Password:</label>
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
                                            className='su-submit-button fw-bold rounded-pill'>
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
