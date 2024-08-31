import React from 'react';
import { Link } from 'react-router-dom';
import '../../StylingSheets/signupStyles.css';
import { send } from 'process';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

// interface SignUpForm {
//     username: string;
//     password:String;
//     email:String;

// }

export default function AdditionalInfoForm(){
    const navigate = useNavigate();
    const [description, setDescription] = React.useState({description: ""})
    const [isAccountSearchAble, setIsAccountSearchAble] = React.useState(true)
    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        console.log("within handle changes param value for name " + name + " and value " + value);
        switch (name) {
            case "Biograph":
                setDescription({ description: value });
                break;
            case "searchable":
                setIsAccountSearchAble(!isAccountSearchAble);
                break;
            default:
                break;
        }
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();

       
        navigate('/');
     
  
       
    }

    function handleFieldUpdates(event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        // Add your blur event handling logic here
    }


   
    return(
        <div className='signup-page'>
         <div className='signup-container'>

            <form className='signup-form'>
                <h1 className='createaccount-text'>Account Information</h1>
                <AccountCircleIcon style={{ fontSize: 40 }}></AccountCircleIcon>
                <label htmlFor="AboutMe"></label>
                    {/* <input type="text" id="About me" name="AboutMe"
                    placeholder="About Me" className={'AboutMe'} onChange={handleChange} onBlur={handleFieldUpdates}></input> */}
                    <textarea
                        className={'AboutMe'}
                        id="description"
                        maxLength={150}
                        placeholder='About me'
                        onChange={handleChange}
                        onBlur={handleFieldUpdates}
                    ></textarea>

       
                   
             
             
                <label htmlFor="How would you describe your gaming style?"></label>
                    <input type="text" id="gamingStyle" name="gamingStyle"
                    placeholder="How would you describe your gaming style?" className='createaccount-inputs' onChange={handleChange}></input>
                               
                
                <div className='account-visible-checkbox'>
                     <input type="checkbox" id="searchable" name="searchable"
                    className={'createaccount-inputs'} onChange={handleChange}></input>
                    <div>searchable?</div>
                </div>
                   
                <button className='create-account-btn' onClick={handleSubmit}>Finailize</button>
                {/* <h6 className='create-account-text'>Don't have an account? <Link to="/signup"><strong className='signupText'>Sign Up!</strong> </Link></h6>
          */}


            </form>

        </div>

     </div>
    )

   

}