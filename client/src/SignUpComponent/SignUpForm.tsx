import React from 'react';
import { Link } from 'react-router-dom';
import './signup.css';


interface SignUpForm {
    username: string;
    password:String;
    email:String;

}

export default function SignUpForm(){

    const [passwordMatch, setPasswordMatch] = React.useState(true)
    const [username, setUserName] = React.useState({username: ""})
    const [password, setPassword] = React.useState({password: ""})
    const [confirmPassword, setConfirmPassword] = React.useState({confirmPassword: ""})
    const [email, setEmail] = React.useState({email: ""})
   
    const [responseData, setResponseData] = React.useState<any>(null); // State variable to store response data


    const { username: usernameValue } = username;
    const { password: passwordValue } = password;
    const { confirmPassword: confirmPasswordValue } = confirmPassword;
    const { email: emailValue } = email;
  
      
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        console.log("value for name " + name + " and value " + value);
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
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
          
            return response.json();
        })
        .then(data => {
            setResponseData(data);
          
            if(data.length <= 0){
                console.log("No data received from the server");
            } else{
                const { id,username, password } = data[0]; // Use the updated data object from the response
                console.log("response data " + username + " and test " + password + " and database id " + id);
            }
            
        })
        .catch(error => {
            console.error('Error submitting data:', error);
        });
    }

    function handleConfirmPasswordBlur(event: React.FocusEvent<HTMLInputElement>) {
        console.log("Clicked off input field:", event.target.name);
        console.log("current password " + passwordValue + " and the confirm apssword " + confirmPasswordValue);
        if(passwordValue === confirmPasswordValue){
            console.log("Passwords are the same are good");
            setPasswordMatch(true);
        } else{
            setPasswordMatch(false);

        }
        // Add your logic here for when the user clicks off the input field
    }
    const style = passwordMatch? 'createaccount-inputs':'errorInput';


    return(
         <div className='signup-page'>
            <div className='signup-container'>

                <form className='signup-form'>
                    <h1 className='createaccount-text'>Create Account</h1>
                    <label htmlFor="Email"></label>
                        <input type="text" id="Email" name="Email"
                        placeholder="Email" className='createaccount-inputs' onChange={handleChange}></input>
                    <label htmlFor="Username"></label>
                        <input type="text" id="Username" name="Username"
                        placeholder="Username" className='createaccount-inputs' onChange={handleChange}></input>
                    <label htmlFor="Password"></label>
                        <input type="text" id="Password" name="Password"
                        placeholder="Password" className={style} onChange={handleChange} onBlur={handleConfirmPasswordBlur}></input>
                    <label htmlFor="ConfirmPassword"></label>
                        <input type="text" id="ConfirmPassword" name="ConfirmPassword"
                        placeholder="Confirm Password" className={style} onBlur={handleConfirmPasswordBlur} onChange={handleChange}></input>
                        {!passwordMatch && <div className='input-error-message'>Passwords do not match</div>  }
                    <label htmlFor="How would you describe your gaming stlye?"></label>
                        <input type="text" id="gamingStyle" name="gamingStyle"
                        placeholder="How would you describe your gaming stlye?" className='createaccount-inputs' onChange={handleChange}></input>
                    <button className='create-account-btn' onClick={handleSubmit}>Create Account</button>

                </form>

            </div>

         </div>
    )

   

}