import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import './searchResultsStyles.css';

interface ChildProps {
    key:number;
    gameName:String;

  }

export default function CardPerson(props:ChildProps){

    return(
         <div className='search-results-item'>
          <div className='button-container'>  
            <button className='searchResults-btn'>{props.gameName}</button>
            <button className='searchResults-btn'>See Profile</button>
            <button className='searchResults-btn'>Message</button>
          </div>
          
            
           

        </div>
    )

   

}