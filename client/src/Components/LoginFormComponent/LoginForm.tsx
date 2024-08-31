import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../StylingSheets/loginFormStyles.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { userLoggedIn } from '../../ReduxStore/UserstateSlice';
import { loadUser } from '../../NetworkCalls/FetchCalls/loadUser';
import { loadUserFriends } from '../../NetworkCalls/FetchCalls/loadUserFriends';
import { loadUserFriendRequests } from '../../NetworkCalls/FetchCalls/loadUserFriendRequests';
import { Logger, LogLevel } from '../../Logger/Logger';

interface FormData {
    username: string;
    password: string;
}

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [responseData, setResponseData] = useState<any>(null); // State to store response data
    const [foundAccount, setFoundAccount] = useState(true);

    const isUserLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "Username") {
            setUsername(value);
        } else if (name === "Password") {
            setPassword(value);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        Logger("entered handleSubmit", LogLevel.Debug);
        try {
            const userData = await loadUser(username, password);
            Logger("User data: " + JSON.stringify(userData), LogLevel.Debug);
            const userId = userData[0].id;
            dispatch(userLoggedIn({
                isAuthenticated: true,
                userId: userData[0].id,
                numberOfCurrentFriendRequests: 0
            }));
            setFoundAccount(true);
        } catch (err) {
            Logger(`Failed to load user information for ${username}: ${err}`, LogLevel.Debug);
            setFoundAccount(false);
        }
    };

    return (
        <div className='LoginForm'>
    <div className='loginForm-container'>
        <h1 className='login-title'>Login</h1>
        <form className='login-form' onSubmit={handleSubmit}>
            <label htmlFor="Username"></label>
            <input
                type="text"
                id="Username"
                name="Username"
                placeholder="Username"
                className='login-input'
                value={username}
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
            {!foundAccount && <div className='error-message'>Username and password combination not found!</div>}
            <button type="submit" className='login-btn'>Login</button>
        </form>
        <h6 className='create-account-text'>
            Don't have an account? <Link to="/signup"><strong className='signupText'>Sign Up!</strong></Link>
        </h6>
    </div>
</div>
    );
};

export default LoginForm;
