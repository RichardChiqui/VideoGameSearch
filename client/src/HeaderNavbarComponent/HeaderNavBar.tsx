import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Modal from 'react-modal';

import CategoriesTab from '../CategoriesComponent/CategoriesNavBar';

interface HeaderNavbar {
    onButtonClick: () => void;
    dismissHandlerClick: (event: React.FocusEvent<HTMLDivElement>) => void; // Add dismissHandler
    buttonClicked: boolean;
  }



export default function HeaderNavBar({ onButtonClick,dismissHandlerClick ,buttonClicked }: HeaderNavbar){
 

    console.log("Current show value " + buttonClicked);
    const filterValue = buttonClicked ? "brightness(50%)" : "brightness(100%)";
    console.log("filterecaled is " + filterValue);
    const style= {filter: filterValue};

    const [show, setShow] = React.useState(false)
    const [showLogin, setshowLogin] = React.useState(false)

    function displayDropDown(){
        setShow(!show);
    }


    
    return(
     

       
            <div className="topNavbar"  style={style}>
             

                <h1 className='WebsiteName'>SQUAD SEEKER</h1>
                <div className='searchLogin'>
                {/* <form> */}

         
       
                <input type="text"  
                        className="search-input" 
                        placeholder="Search...">
                    </input> 


                {/* </form> */}
                <button className={`searchResultsButton ${buttonClicked ? 'no-hover' : ''}`} onClick={onButtonClick} >Search</button>
                
                </div>
                <button className={`signinbutton ${buttonClicked ? 'no-hover' : ''}`} onClick={onButtonClick} >SignUp/Login</button>
                

            </div>
         
    )

   

}