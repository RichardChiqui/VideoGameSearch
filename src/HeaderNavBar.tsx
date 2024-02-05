import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import CategoriesTab from './CategoriesNavBar';

interface HeaderNavbar {
    onButtonClick: () => void;
  }

export default function HeaderNavBar({ onButtonClick }: HeaderNavbar){
 
    return(
     

       
            <div className="topNavbar">
             

                <h1 className='WebsiteName'>Video Game Finder</h1>
                <div className='searchLogin'>
                {/* <form> */}

         
       
                <input type="text"  
                        className="search-input" 
                        placeholder="Search...">
                    </input> 


                {/* </form> */}
                <button className='signinbutton' onClick={onButtonClick}>SignUp/Login</button>
                
                </div>
                
                

            </div>
         
    )

   

}