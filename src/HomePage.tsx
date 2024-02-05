import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import CategoriesTab from './CategoriesNavBar';
import HeaderNavBar from './HeaderNavBar';
import SearchResults from './SearchResults';


export default function HomePage(){
    const [buttonClicked, setButtonClicked] = React.useState(false);


    const styles= {display: buttonClicked? "block":"none"}
    const backdrop = {filter: buttonClicked? "brightness(50%)": "brightness(100%)"}
    const handleButtonClick = () => {
      setButtonClicked(!buttonClicked);
    };
    return(
        <div className='homePage' style={backdrop}>

       
       
         <HeaderNavBar onButtonClick={handleButtonClick}/>
         <CategoriesTab/>
         <SearchResults buttonClicked={buttonClicked}/>
         
        </div>
    )

   

}