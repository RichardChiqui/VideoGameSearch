import React from 'react';
import { Link } from 'react-router-dom';
import '../../StylingSheets/signupStyles.css';
import { send } from 'process';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUserData } from '../../ReduxStore/UserstateSlice';
import authService from '../../services/AuthService';
import { Logger, LogLevel } from '../../Logger/Logger';


interface SignUpForm {
    username: string;
    password:String;
    email:String;

}

export default function SignUpForm(){

    const [passwordMatch, setPasswordMatch] = React.useState(true)
    const [missingFields, setMissingFields] = React.useState(false)
    const [username, setUserName] = React.useState({username: ""})
    const [password, setPassword] = React.useState({password: ""})
    const [confirmPassword, setConfirmPassword] = React.useState({confirmPassword: ""})
    const [email, setEmail] = React.useState({email: ""})
    const [responseData, setResponseData] = React.useState<any>(null); // State variable to store response data
    const [isLoading, setIsLoading] = React.useState(false); // Loading state
    const [errorMessage, setErrorMessage] = React.useState<string>(""); // Error message state

    const [missingEmail, setMissingEmail] = React.useState(true);
    const [missingPassword, setMissingPassword] = React.useState(true);
    const [missingUsername, setMissingUsername] = React.useState(true);


    const { username: usernameValue } = username;
    const { password: passwordValue } = password;
    const { confirmPassword: confirmPasswordValue } = confirmPassword;
    const { email: emailValue } = email;
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
      
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        
        // Clear error message when user starts typing
        if (errorMessage) {
            setErrorMessage("");
        }
        
        switch (name) {
            case "Username":
                setUserName({ username: value });
                break;
            case "Password":
                setPassword({ password: value });
                break;
            case "ConfirmPassword":
                setConfirmPassword({ confirmPassword: value });
                break;
            case "Email":
                setEmail({ email: value });
                break;
            default:
                break;
        }
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();

        if(missingEmail || missingPassword || missingPassword){
            setMissingFields(true);

        } else{
            // navigate('/accountinfo');
             sendSubmit();
        }
     
  
       
    }

    function handleFieldUpdates(event: React.FocusEvent<HTMLInputElement>){
        const { name, value } = event.target;
        switch (name) {
            case "Username":
                if(value.length == 0){
                    setMissingUsername(true);
                } else{
                    setMissingUsername(false);
                }
                break;
            case "Password":
                if(value.length == 0){
                    setMissingPassword(true);
                } else{
                    setMissingPassword(false);
                }
                break;
            case "Email":
                if(value.length == 0){
                    setMissingEmail(true);
                } else{
                    setMissingEmail(false);
                }
                break;
            default:
                break;
        }
    }

    function handleConfirmPasswordBlur(event: React.FocusEvent<HTMLInputElement>) {
        if(passwordValue === confirmPasswordValue){
            setPasswordMatch(true);
        } else{
            setPasswordMatch(false);

        }
        // Add your logic here for when the user clicks off the input field
    }
    const style = passwordMatch? 'createaccount-inputs':'errorInput';
    const missingFieldStyles = missingFields? 'createaccount-inputs':'errorInput';

    function sendSubmit(){
        // Clear any previous error messages
        setErrorMessage("");
        setIsLoading(true);

        const postData: SignUpForm = {
            username:usernameValue,
            password:passwordValue,
            email:emailValue
        };

        fetch('http://localhost:5000/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData),
            credentials: 'include' // Important for JWT cookie
        })
        .then(response => {
            if (!response.ok) {
                // Try to get error message from response
                return response.json().then(errorData => {
                    throw new Error(errorData.error || errorData.message || 'Failed to create account');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("response data", data);
            setIsLoading(false);
          
            if (data.success && data.user) {
                // Store user data in auth service (JWT token is already in HTTP-only cookie)
                authService.setAuthData('', data.user);
                
                // Update Redux state to authenticate user
                dispatch(setUserData({
                    userId: data.user.userId,
                    username: data.user.email, // Use email as username for now
                    userEmail: data.user.email,
                    display_name: data.user.display_name
                }));
                dispatch(setAuthenticated(true));
                
                Logger(`User ${data.user.email} account created and logged in successfully`, LogLevel.Info);
                
                // Navigate to home page
                navigate('/');
            } else {
                setErrorMessage("Account created but failed to authenticate. Please try logging in.");
            }
        })
        .catch(error => {
            console.error('Error submitting data:', error);
            setIsLoading(false);
            // Display user-friendly error message
            setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
        });
    }


    return(
         <div className='signup-page'>
            <div className='signup-container'>

                <form className='signup-form'>
                    <h1 className='createaccount-text'>Create Account</h1>
                    
                    {/* Error Message Display */}
                    {errorMessage && (
                        <div className='error-message' style={{
                            backgroundColor: '#ffebee',
                            color: '#c62828',
                            padding: '12px',
                            borderRadius: '4px',
                            marginBottom: '16px',
                            border: '1px solid #ffcdd2',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            {errorMessage}
                        </div>
                    )}
                    
                    <label htmlFor="Email"></label>
                        <input type="text" id="Email" name="Email"
                        placeholder="Email" className={missingEmail && missingFields?'errorInput':'createaccount-inputs'} onChange={handleChange} onBlur={handleFieldUpdates}></input>

                        {missingFields && missingEmail && <div className='input-error-message'>Please enter email</div>  }
                    <label htmlFor="Username"></label>
                        <input type="text" id="Username" name="Username"
                        placeholder="Username" className={missingUsername && missingFields?'errorInput':'createaccount-inputs'} onChange={handleChange}></input>
                         {missingFields && missingUsername && <div className='input-error-message'>Please enter a username</div>  }
                    <label htmlFor="Password"></label>
                        <input type="password" id="Password" name="Password"
                        placeholder="Password" className={style} onChange={handleChange} onBlur={handleFieldUpdates}></input>
                         {missingFields && missingPassword && <div className='input-error-message'>Please enter a password</div>  }
                    <label htmlFor="ConfirmPassword"></label>
                        <input type="password" id="ConfirmPassword" name="ConfirmPassword"
                        placeholder="Confirm Password" className={style} onBlur={handleConfirmPasswordBlur} onChange={handleChange}></input>
                        {!passwordMatch && <div className='input-error-message'>Passwords do not match</div>  }
                    <label htmlFor="How would you describe your gaming style?"></label>
                        {/* <input type="text" id="gamingStyle" name="gamingStyle"
                        placeholder="How would you describe your gaming style?" className='createaccount-inputs' onChange={handleChange}></input> */}
                    <button 
                        className='create-account-btn' 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    {/* <h6 className='create-account-text'>Don't have an account? <Link to="/signup"><strong className='signupText'>Sign Up!</strong> </Link></h6>
              */}


                </form>

            </div>

         </div>
    )

   

}