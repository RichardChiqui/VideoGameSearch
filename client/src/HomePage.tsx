import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import CategoriesTab from './CategoriesNavBar';
import HeaderNavBar from './HeaderNavBar';
import SearchResults from './SearchResults';
import LoginForm from './LoginForm';
import Modal from 'react-modal';


export default function HomePage(){
    const [buttonClicked, setButtonClicked] = React.useState(false);

    const [isModalOpen, setIsModalOpen] = React.useState(false);

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
                className="ReactModal__Content" // Add custom class name
                
             
            > 
            <LoginForm />
            </Modal>
    
        {/* {buttonClicked && <LoginForm />} */}
         <HeaderNavBar onButtonClick={handleButtonClick} dismissHandlerClick={dismissHandler}  buttonClicked={buttonClicked}/>
         <div className='homepage-description'>
          <h1>Ready To Play? </h1>
          <h6>Find your next teammate, squad or game to play. Use filters to search</h6>
         </div>
         
         <CategoriesTab buttonClicked={buttonClicked}/>
         <SearchResults buttonClicked={buttonClicked}/>
         
        </div>
    )

   

}