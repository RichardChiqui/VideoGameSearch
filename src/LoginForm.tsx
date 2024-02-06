import React from 'react';



export default function LoginForm(){

    return(
         <div className='LoginForm'>
            <div className='loginForm-container'>
                <h1 className='login-title'>Login</h1>
                <form className='login-form'>  
                    <label htmlFor="Username"></label>
                    <input type="text" id="Username" name="Username" placeholder="Username" className='login-input'></input>

                    <label htmlFor="Password"></label>
                    <input type="text" id="Password" name="Password" placeholder="Password" className='login-input'></input>


                </form>
                <button className='login-btn'>Login</button>
                <h6 className='create-account-text'>Don't have an account? <strong className='signupText'>Sign Up!</strong></h6>
             
            </div>

            

            
        
        </div>
    )

   

}