import React from 'react';
import { Link } from 'react-router-dom';
import './loginFormStyles.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store';
import { userLoggedIn, receiveFriendRequest } from '../HomePageComponent/UserstateSlice';



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
    const [foundAccount, setFoundAccount] = React.useState(true)

    const isUserLoggedIn = useSelector((state:RootState) => state.user.isAuthenticated);
    const userId = useSelector((state:RootState) => state.user.userId);
    console.log("userid:" + userId);
    //console.log("during first load user should not be loggedin:" + userLoggedIn);
    const dispatch = useDispatch();

    const [socket, setSocket] = React.useState<WebSocket | null>(null);



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
          
            if(data.length <= 0){
                setFoundAccount(false)
                console.log("No data received from the server");
            } else{
                setFoundAccount(true);
                const { id,username, password } = data[0]; // Use the updated data object from the response
                console.log("response data " + username + " and test " + password + " and database id " + id);
                dispatch(userLoggedIn({isAuthenticated:true,userId:id,numberOfCurrentFriendRequests : 0}));
     

            }
            
        })
        .catch(error => {
            console.error('Error submitting data:', error);
        });
    }

    // React.useEffect(() => {
    //     // Establish WebSocket connection
    //     if(userId != 0){

    //         const newSocket = new WebSocket('ws://localhost:5000/'); // Replace with your WebSocket server URL
    //         setSocket(newSocket);
        
    //         // Clean up on unmount
    //         newSocket.onopen = () => {
    //             console.log('WebSocket connection established withuserId:' + userId);
    //             // Send a registration message to the WebSocket server
    //             const registrationData = {
    //                 type: 'register',
    //                 userId: userId // Send the user ID obtained from the login response
    //             };
    //             newSocket.send(JSON.stringify(registrationData));
               
    //             dispatch(userLoggedIn({isAuthenticated:true,userId:userId, socket: newSocket}));
                
               
                    
    //         };
    //     }
       
    //   }, [isUserLoggedIn]);


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
                {!foundAccount && <div className='error-message'>Password and Email combination not found!</div>}
                <button className='login-btn' onClick={handleSubmit}>Login</button>
                
                <h6 className='create-account-text'>Don't have an account? <Link to="/signup"><strong className='signupText'>Sign Up!</strong> </Link></h6>
             
            </div>

            

            
        
        </div>
    )

   

}