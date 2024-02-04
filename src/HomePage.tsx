import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import CategoriesTab from './CategoriesNavBar';
import HeaderNavBar from './HeaderNavBar';


export default function HomePage(){
    return(
        <div className='homePage'>

       
       
         <HeaderNavBar/>
         <CategoriesTab/>
        </div>
    )

   

}