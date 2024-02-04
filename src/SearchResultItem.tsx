import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

interface ChildProps {
    gameTitle: string;

  }

export default function SearchResultsItem(props:ChildProps){

    return(
         <div className='search-results-item'>
          <div className='item-card'> {props.gameTitle}</div>
          <button>find friends</button>
          <button>Info</button>
            
           

        </div>
    )

   

}