import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../StylingSheets/loginFormStyles.css';
import { useAuth } from '../../hooks/useAuth';
import { Logger, LogLevel } from '../../Logger/Logger';

interface FormData {
    email: string;
    password: string;
}

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [foundAccount, setFoundAccount] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated, isLoading: authLoading } = useAuth();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "Email") {
            setEmail(value);
        } else if (name === "Password") {
            setPassword(value);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        Logger("entered handleSubmit", LogLevel.Debug);
        
        if (!email || !password) {
            setFoundAccount(false);
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                Logger(`User ${email} logged in successfully`, LogLevel.Info);
                setFoundAccount(true);
            } else {
                Logger(`Login failed for ${email}`, LogLevel.Debug);
                setFoundAccount(false);
            }
        } catch (err) {
            Logger(`Failed to load user information for ${email}: ${err}`, LogLevel.Debug);
            setFoundAccount(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='LoginForm'>
    <div className='loginForm-container'>
        <h1 className='login-title'>Login</h1>
        <form className='login-form' onSubmit={handleSubmit}>
            <label htmlFor="Email"></label>
            <input
                type="email"
                id="Email"
                name="Email"
                placeholder="Email"
                className='login-input'
                value={email}
                onChange={handleChange}
            />
            <label htmlFor="Password"></label>
            <input
                type="password"
                id="Password"
                name="Password"
                placeholder="Password"
                className='login-input'
                value={password}
                onChange={handleChange}
            />
            <h6 className='forgotpassword-text'>Forgot Password?</h6>
            {!foundAccount && <div className='error-message'>Email and password combination not found!</div>}
            <button type="submit" className='login-btn' disabled={isLoading || authLoading}>
                {isLoading || authLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
        <h6 className='create-account-text'>
            Don't have an account? <Link to="/signup"><strong className='signupText'>Sign Up!</strong></Link>
        </h6>
    </div>
</div>
    );
};

export default LoginForm;
