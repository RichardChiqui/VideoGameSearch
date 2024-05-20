import React from 'react';
import { Link } from 'react-router-dom';
import './signup.css';
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
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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

   
    return(
         <div className='signup-page'>
            <div className='signup-container'>

                <form className='signup-form'>
                    <AccountCircleIcon />
                    <h1 className='createaccount-text'>Account Information</h1>
                    <label htmlFor="Biograph"></label>
                        <input type="text" id="Biograph" name="Biograph"
                        placeholder="About Me...."  onChange={handleChange} ></input>
                    <label htmlFor="searchable"></label>
                        <input type="checkbox" id="searchable" name="searchable"  onChange={handleChange} ></input>

                    <button className='finish-creating-account' onClick={handleSubmit}>Create Account</button>
                </form>

            </div>
         </div>
    )

   

}