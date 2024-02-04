import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import CategoriesTab from './CategoriesNavBar';


export default function HeaderNavBar(){
    return(
     

       
            <div className="topNavbar">
                {/* <SportsEsportsIcon/> */}

                <h1>Video Game Finder</h1>
                <form>

                {/* <label for="tweet">Name: </label> */}
                <input type="text"  
                        className="search-input" 
                        placeholder="Search...">
                    </input> 


                </form>

                <PersonIcon/>
                

            </div>
         
    )

   

}