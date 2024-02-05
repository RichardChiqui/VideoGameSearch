import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import CategoriesTab from './CategoriesNavBar';
import HeaderNavBar from './HeaderNavBar';
import SearchResults from './SearchResults';
import LoginForm from './LoginForm';


export default function HomePage(){
    const [buttonClicked, setButtonClicked] = React.useState(false);


    const displayStyle= {display: buttonClicked? "block":"none"}
    const backdrop = {filter: buttonClicked? "brightness(50%)": "brightness(100%)"}
    const handleButtonClick = () => {
      setButtonClicked(!buttonClicked);
    };
    
    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setButtonClicked(false);
        }
      };
    //Pass button clicked to each prop individually, this way the popup login page does not also inherit css styles
    return(
        <div className='homePage'>

       
    
        {buttonClicked && <LoginForm />}
         <HeaderNavBar onButtonClick={handleButtonClick} dismissHandlerClick={dismissHandler}  buttonClicked={buttonClicked}/>
         <CategoriesTab buttonClicked={buttonClicked}/>
         <SearchResults buttonClicked={buttonClicked}/>
         
        </div>
    )

   

}