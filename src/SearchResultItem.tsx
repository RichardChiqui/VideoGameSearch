import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {SearchResultsItemType} from './SearchResults';

interface ChildProps {
    key:number;
    gameName:String;

  }

export default function SearchResultsItem(props:ChildProps){

    return(
         <div className='search-results-item'>
          <button>{props.gameName}</button>
          <button>Info</button>
            
           

        </div>
    )

   

}