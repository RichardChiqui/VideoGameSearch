import React from 'react';
import { Link } from 'react-router-dom';
import '../../StylingSheets/signupStyles.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUserData } from '../../ReduxStore/UserstateSlice';
import authService from '../../services/AuthService';
import { Logger, LogLevel } from '../../Logger/Logger';
import { REGIONS_DESCRIPTIONS } from '../../enums/RegionsEnums';

interface SignUpForm {
    password: string;
    email: string;
    display_name?: string;
    region?: string;
    profile_description?: string;
}

export default function SignUpForm(){
    const [currentStep, setCurrentStep] = React.useState(1);
    
    // Part 1: Login Credentials
    const [passwordMatch, setPasswordMatch] = React.useState(true);
    const [missingFields, setMissingFields] = React.useState(false);
    const [password, setPassword] = React.useState({password: ""});
    const [confirmPassword, setConfirmPassword] = React.useState({confirmPassword: ""});
    const [email, setEmail] = React.useState({email: ""});
    
    // Part 2: Account Information
    const [displayName, setDisplayName] = React.useState({displayName: ""});
    const [region, setRegion] = React.useState({region: ""});
    const [profileDescription, setProfileDescription] = React.useState({profileDescription: ""});
    
    // Validation states
    const [missingEmail, setMissingEmail] = React.useState(true);
    const [missingPassword, setMissingPassword] = React.useState(true);
    const [missingDisplayName, setMissingDisplayName] = React.useState(true);
    const [missingRegion, setMissingRegion] = React.useState(true);
    
    // Other states
    const [responseData, setResponseData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const { password: passwordValue } = password;
    const { confirmPassword: confirmPasswordValue } = confirmPassword;
    const { email: emailValue } = email;
    const { displayName: displayNameValue } = displayName;
    const { region: regionValue } = region;
    const { profileDescription: profileDescriptionValue } = profileDescription;
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        
        // Clear error message when user starts typing
        if (errorMessage) {
            setErrorMessage("");
        }
        
        switch (name) {
            case "Password":
                setPassword({ password: value });
                break;
            case "ConfirmPassword":
                setConfirmPassword({ confirmPassword: value });
                break;
            case "Email":
                setEmail({ email: value });
                break;
            case "DisplayName":
                setDisplayName({ displayName: value });
                break;
            case "Region":
                setRegion({ region: value });
                break;
            case "ProfileDescription":
                setProfileDescription({ profileDescription: value });
                break;
            default:
                break;
        }
    }

    function handleContinue(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();

        if (currentStep === 1) {
            // Validate part 1 fields
            if (missingEmail || missingPassword) {
                setMissingFields(true);
                return;
            }
            
            if (passwordValue !== confirmPasswordValue) {
                setPasswordMatch(false);
                return;
            }
            
            // Move to step 2
            setCurrentStep(2);
        } else {
            // Validate part 2 and submit
            if (missingDisplayName || missingRegion) {
                setMissingFields(true);
                return;
            }
            
            sendSubmit();
        }
    }
    
    function handleBack(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        setCurrentStep(1);
    }

    function handleFieldUpdates(event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
        const { name, value } = event.target;
        switch (name) {
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
            case "DisplayName":
                if(value.length == 0){
                    setMissingDisplayName(true);
                } else{
                    setMissingDisplayName(false);
                }
                break;
            case "Region":
                if(value.length == 0){
                    setMissingRegion(true);
                } else{
                    setMissingRegion(false);
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
    // const missingFieldStyles = missingFields? 'createaccount-inputs':'errorInput';

    function sendSubmit(){
        // Clear any previous error messages
        setErrorMessage("");
        setIsLoading(true);

        const postData: SignUpForm = {
            password: passwordValue,
            email: emailValue,
            display_name: displayNameValue,
            region: regionValue,
            profile_description: profileDescriptionValue
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
                    userEmail: data.user.email,
                    display_name: data.user.display_name,
                    region: data.user.region,
                    profile_description: data.user.profile_description
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
                <div className='signup-form-wrapper'>
                    {/* Part 1: Login Credentials */}
                    <div className={`signup-form-part ${currentStep === 1 ? 'active' : 'inactive'}`}>
                        <form className='signup-form' onSubmit={(e) => e.preventDefault()}>
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
                            <input 
                                type="email" 
                                id="Email" 
                                name="Email"
                                placeholder="Email" 
                                className={missingEmail && missingFields?'errorInput':'createaccount-inputs'} 
                                onChange={handleChange} 
                                onBlur={handleFieldUpdates}
                                value={emailValue}
                            />
                            {missingFields && missingEmail && <div className='input-error-message'>Please enter email</div>}
                            
                            <label htmlFor="Password"></label>
                            <input 
                                type="password" 
                                id="Password" 
                                name="Password"
                                placeholder="Password" 
                                className={style} 
                                onChange={handleChange} 
                                onBlur={handleFieldUpdates}
                                value={passwordValue}
                            />
                            {missingFields && missingPassword && <div className='input-error-message'>Please enter a password</div>}
                            
                            <label htmlFor="ConfirmPassword"></label>
                            <input 
                                type="password" 
                                id="ConfirmPassword" 
                                name="ConfirmPassword"
                                placeholder="Confirm Password" 
                                className={style} 
                                onBlur={handleConfirmPasswordBlur} 
                                onChange={handleChange}
                                value={confirmPasswordValue}
                            />
                            {!passwordMatch && <div className='input-error-message'>Passwords do not match</div>}
                            
                            <button 
                                className='create-account-btn' 
                                onClick={handleContinue}
                                type="button"
                                disabled={isLoading}
                            >
                                Continue
                            </button>
                        </form>
                    </div>

                    {/* Part 2: Account Information */}
                    <div className={`signup-form-part ${currentStep === 2 ? 'active' : 'inactive'}`}>
                        <form className='signup-form' onSubmit={(e) => e.preventDefault()}>
                            <h1 className='createaccount-text'>Account Information</h1>
                            
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
                            
                            <label htmlFor="DisplayName"></label>
                            <input 
                                type="text" 
                                id="DisplayName" 
                                name="DisplayName"
                                placeholder="Display Name" 
                                className={missingDisplayName && missingFields?'errorInput':'createaccount-inputs'} 
                                onChange={handleChange} 
                                onBlur={handleFieldUpdates}
                                value={displayNameValue}
                            />
                            {missingFields && missingDisplayName && <div className='input-error-message'>Please enter a display name</div>}
                            
                            <label htmlFor="Region"></label>
                            <select
                                id="Region"
                                name="Region"
                                className={missingRegion && missingFields?'errorInput':'createaccount-inputs'}
                                onChange={handleChange}
                                onBlur={handleFieldUpdates}
                                value={regionValue}
                            >
                                <option value="">Select Region</option>
                                {Object.entries(REGIONS_DESCRIPTIONS).map(([id, name]) => (
                                    <option key={id} value={name}>{name}</option>
                                ))}
                            </select>
                            {missingFields && missingRegion && <div className='input-error-message'>Please select a region</div>}
                            
                            <label htmlFor="ProfileDescription"></label>
                            <textarea
                                id="ProfileDescription"
                                name="ProfileDescription"
                                placeholder="Short Profile Description (optional)"
                                className='createaccount-inputs'
                                onChange={handleChange}
                                rows={4}
                                maxLength={300}
                                value={profileDescriptionValue}
                                style={{
                                    resize: 'vertical',
                                    minHeight: '100px',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '-10px', marginBottom: '10px' }}>
                                {profileDescriptionValue.length}/300 characters
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                <button 
                                    className='create-account-btn' 
                                    onClick={handleBack}
                                    type="button"
                                    style={{ 
                                        background: 'white',
                                        color: '#6B73FF',
                                        border: '2px solid #6B73FF'
                                    }}
                                >
                                    Back
                                </button>
                                <button 
                                    className='create-account-btn' 
                                    onClick={handleContinue}
                                    type="button"
                                    disabled={isLoading}
                                    style={{
                                        opacity: isLoading ? 0.7 : 1,
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        flex: 1
                                    }}
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
         </div>
    )

   

}