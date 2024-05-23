import React, { useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import CategoriesTab from '../CategoriesComponent/CategoriesNavBar';
import HeaderNavBar from '../HeaderNavbarComponent/HeaderNavBar';
import SearchResults from '../SearchResultsComponent/SearchResults';
import LoginForm from '../LoginFormComponent/LoginForm';
import Modal from 'react-modal';
import HomePageMainContent from './HomePageMainContent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store';

export default function HomePage(){
    const [buttonClicked, setButtonClicked] = React.useState(false);

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    
   
    const isUserLoggedIn = useSelector((state:RootState) => state.userLoggedIn.value);
    //console.log("during first load user should not be loggedin:" + isUserLoggedIn);

    
    useEffect(() => {
      if (isUserLoggedIn) {
        console.log('Element is visible');
        closeModal();
      } else {
        console.log('Element is hidden');
      }
    }, [isUserLoggedIn]);
    // Function to open the modal
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    // Function to close the modal
    const closeModal = () => {
      setIsModalOpen(false);
      setButtonClicked(!buttonClicked);

    };

    const displayStyle= {display: buttonClicked? "block":"none"}
    const backdrop = {filter: buttonClicked? "brightness(100%)": "brightness(50%)"}
    const handleButtonClick = () => {
      setButtonClicked(!buttonClicked);
      openModal();
    };
    
    const dismissHandler = (event: React.FocusEvent<HTMLDivElement>): void => {
        // Check if the event target is outside the LoginForm component
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setButtonClicked(false);
        }
    };
    //Pass button clicked to each prop individually, this way the popup login page does not also inherit css styles
    return(
        <div className='homePage'>

       
        <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="ReactModal__Content" 
                
             
            > 
            <LoginForm />
          </Modal>
    
       

         <HeaderNavBar onButtonClick={handleButtonClick} dismissHandlerClick={dismissHandler}  buttonClicked={buttonClicked}/>
         <HomePageMainContent buttonClicked={buttonClicked}/>
         
        </div>
    )

   

}