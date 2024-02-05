import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import CategoriesTab from './CategoriesNavBar';

interface HeaderNavbar {
    onButtonClick: () => void;
    dismissHandlerClick: (event: React.FocusEvent<HTMLButtonElement>) => void; // Add dismissHandler
    buttonClicked: boolean;
  }



export default function HeaderNavBar({ onButtonClick,dismissHandlerClick ,buttonClicked }: HeaderNavbar){
 

    const filterValue = buttonClicked ? "brightness(50%)" : "brightness(100%)";
    const style= {filter: filterValue};

    const [show, setShow] = React.useState(false)

    function displayDropDown(){
        setShow(!show);
    }


    
    return(
     

       
            <div className="topNavbar"  style={style}>
             

                <h1 className='WebsiteName'>Video Game Finder</h1>
                <div className='searchLogin'>
                {/* <form> */}

         
       
                <input type="text"  
                        className="search-input" 
                        placeholder="Search...">
                    </input> 


                {/* </form> */}
                <button className={`signinbutton ${buttonClicked ? 'no-hover' : ''}`} onClick={onButtonClick} onBlur={dismissHandlerClick}>SignUp/Login</button>
                
                </div>
                
                

            </div>
         
    )

   

}