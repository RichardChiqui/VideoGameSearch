import React from 'react';
import { Link } from 'react-router-dom';
import './signup.css';


interface SignUpForm {
    username: string;
    password:String;
}

export default function SignUpForm(){

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
        const postData: SignUpForm = {
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


    return(
         <div className='signup-page'>
            hello

         </div>
    )

   

}