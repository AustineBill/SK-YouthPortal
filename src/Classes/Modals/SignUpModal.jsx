import { useState } from 'react';

const SignUpModal = ({ isOpen, onClose }) => {
    const [activeContent, setActiveContent] = useState('codeForm');
    const [codeValue, setCodeValue] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const codeSubmit = (e) => {
        e.preventDefault();
        setActiveContent('userAccountForm');
    }

    const userAccountSubmit = (e) => {
        e.preventDefault();
        setActiveContent('success');
        // Still incomplete since it's not connected to database.
    }

    const closeComponent = () => {
        setCodeValue('');
        setUsername('');
        setPassword('');
        setActiveContent('codeForm');
        onClose();
    }

    return ( 
        <div className='sign-up-modal-overlay'>
            <button className='close-button' onClick={ closeComponent }>Close</button>
            {activeContent === 'codeForm' && (
                <div className='sign-up-modal-container'>
                    
                    <form onSubmit={ codeSubmit }>
                        <label>Enter the code to activate your account:</label>
                        <input type="text" 
                        name="signup-code" 
                        placeholder="Enter Signup Code" 
                        required 
                        value={ codeValue }
                        onChange={(e) => setCodeValue(e.target.value)}
                        />
                        <button type="submit">Submit Code</button>
                    </form>
                </div>
            )}

            {activeContent === 'userAccountForm' && (
                <div className='sign-up-modal-container'>
                    <form onSubmit={ userAccountSubmit }>
                        <label>Username:</label>
                        <input type="text" 
                        name="signup-username" 
                        placeholder="Username" 
                        required 
                        value={ username }
                        onChange={(e) => setUsername(e.target.value)}
                        />
                        <label>Password:</label>
                        <input type="password" 
                        name="signup-password" 
                        placeholder="Password" 
                        required 
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Create Account</button>
                    </form>
                </div>
            )}

            {activeContent === 'success' && (
                <div className='sign-up-modal-container'>
                    <p>Account is Successfully Created!</p>
                    <button onClick={onClose}>Continue</button>
                </div>
            )}
        </div>
    );
};

export default SignUpModal;
