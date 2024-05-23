import React, { useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Modal from 'react-modal';

import CategoriesTab from '../CategoriesComponent/CategoriesNavBar';
import './headerNavBarStyles.css';
import { BreakfastDining } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store';
import { changeMainFilter } from './HeaderFilterSlice';

interface HeaderNavbar {
    onButtonClick: () => void;
    dismissHandlerClick: (event: React.FocusEvent<HTMLDivElement>) => void; // Add dismissHandler
    buttonClicked: boolean;
  }





export default function HeaderNavBar({ onButtonClick,dismissHandlerClick ,buttonClicked }: HeaderNavbar){
 

    const mainFilter = useSelector((state:RootState) => state.mainfilter.value);
    const dispatch = useDispatch();

    const isUserLoggedIn = useSelector((state:RootState) => state.userLoggedIn.value);
    //console.log("during first load user should not be loggedin:" + isUserLoggedIn);

    
    useEffect(() => {
      if (isUserLoggedIn) {
        console.log('Element is visible');
      } else {
        console.log('Element is hidden');
      }
    }, [isUserLoggedIn]);
    
    console.log("Current show value " + buttonClicked);
    const filterValue = buttonClicked ? "brightness(50%)" : "brightness(100%)";
    console.log("filterecaled is " + filterValue);
    const style= {filter: filterValue};

    const boldStyle: React.CSSProperties = { fontWeight: 'bold' };
    const normalStyle: React.CSSProperties = { fontWeight: 'light' };
    const [show, setShow] = React.useState(false)
    const [showLogin, setshowLogin] = React.useState(false)

    const [peopleFilter, setPeoleFilter] = React.useState(false)
    const [groupFilter, setGroupFilter] = React.useState(false)
    const [titleFilter, setTitleFilter] = React.useState(true)
    function displayDropDown(){
        setShow(!show);
    }
    function onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, filterType: string) {
        // Use myString parameter in the function body
        console.log("we entering bolding method or....:" + filterType);
        switch(filterType){
            case "People":
                setPeoleFilter(true);
                setGroupFilter(false);
                setTitleFilter(false);
                dispatch(changeMainFilter("People"))
                break;
            case "Title":
                setPeoleFilter(false);
                setGroupFilter(false);
                setTitleFilter(true);
                dispatch(changeMainFilter("Title"))
                break;
             case "Group":
                setPeoleFilter(false);
                setGroupFilter(true);
                setTitleFilter(false);
                dispatch(changeMainFilter("Group"))
                break;
        }
        console.log("People filter:" + peopleFilter + ", group filter:" + groupFilter + " and titlefitler:" + titleFilter);
    }


    
    return(
     

       
            <div className="topNavbar"  style={style}>
             

                <h1 className='WebsiteName'>SQUAD SEEKER</h1>
                <div className='topNav-currpageinfo'>
                    
                    
                        <div className='topNav-currPageFitler'>GameTitle</div>
                        <div className='topnav-cats'style={peopleFilter ? { ...boldStyle } : {}} onClick={(e) => onClick(e, "People")}>People</div>
                        <div className='topnav-cats'style={groupFilter ? { ...boldStyle } : {}} onClick={(e) => onClick(e, "Group")}>Groups</div>
                        <div className='topnav-cats'style={titleFilter ? { ...boldStyle } : {}} onClick={(e) => onClick(e, "Title")}>Title</div>
                   
                </div>
                <div className='searchLogin'>
                    {/* <form> */}

            
        
                    <input type="text"  
                            className="search-input" 
                            placeholder="Search...">
                        </input> 


                    {/* </form> */}
                    <button className={`searchResultsButton ${buttonClicked ? 'no-hover' : ''}`} onClick={onButtonClick} >Search</button>
                
                </div>
               {isUserLoggedIn? <><PersonIcon /> </> : <button className={`signinbutton ${buttonClicked ? 'no-hover' : ''}`} onClick={onButtonClick} >SignUp/Login</button>} 
                

            </div>
         
    )

   

}