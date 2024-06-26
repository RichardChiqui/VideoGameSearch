import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {SearchResultsItemType} from './SearchResults';
import './searchResultsStyles.css';

interface ChildProps {
    key:number;
    gameName:String;

  }

export default function SearchResultsItem(props:ChildProps){
    console.log("Are we sure we went into here:" + props.gameName);

    return(
         <div className='search-results-item'>
          <div className='button-container'>  
            <button className='searchResults-btn'>{props.gameName}</button>
            <button className='searchResults-btn'>Search People</button>
            <button className='searchResults-btn'>Search Groups</button>
          </div>
          
            
           

        </div>
    )

   

}