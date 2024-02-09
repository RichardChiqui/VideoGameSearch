import React from 'react';


interface FormData {
    username: string;
    password:String;
}

export default function LoginForm(){

    const userNamePassWordJson = [{key:"Name", on:false, text: "Name"},{key:"Email",on:false, text:"Email"}]
    const [username, setUserName] = React.useState({username: ""})
    const [password, setPassword] = React.useState({password: ""})
    const[userNamePassWordJsonFields, setuserNamePassWordJsonFields] = React.useState(userNamePassWordJson)
    const [responseData, setResponseData] = React.useState<any>(null); // State variable to store response data


    const { username: usernameValue } = username;
    const { password: passwordValue } = password;
      
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        console.log("value for name " + name + " and value " + value);
        if (name === "Username") {
            setUserName({ username: value });
        } else if (name === "Password") {
            setPassword({ password: value });
        }
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();

       
        console.log("what is username " + userNamePassWordJson[0].text + " and password " + userNamePassWordJson[1].text);
        const postData: FormData = {
            username:usernameValue,
            password:passwordValue

        };

        fetch('http://localhost:5000/homepage/login', {
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
             const { message, test } = data; // Use the updated data object from the response
            console.log("response data " + message + " and test " + test);
        })
        .catch(error => {
            console.error('Error submitting data:', error);
        });
    }


    return(
         <div className='LoginForm'>
            <div className='loginForm-container'>
                <h1 className='login-title'>Login</h1>
                <form className='login-form' >  
                    <label htmlFor="Username"></label>
                    <input type="text" id="Username" name="Username"
                     placeholder="Username" className='login-input' onChange={handleChange}></input>

                    <label htmlFor="Password"></label>
                    <input type="text" id="Password" 
                    name="Password" placeholder="Password" 
                    className='login-input' 
                   onChange={handleChange}></input>


                </form>
                <h6 className='forgotpassword-text'>Forgot Password?</h6>
                <button className='login-btn' onClick={handleSubmit}>Login</button>
                
                <h6 className='create-account-text'>Don't have an account? <strong className='signupText'>Sign Up!</strong></h6>
             
            </div>

            

            
        
        </div>
    )

   

}