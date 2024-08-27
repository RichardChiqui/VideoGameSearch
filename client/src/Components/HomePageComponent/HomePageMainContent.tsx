import React from 'react';
import { Link } from 'react-router-dom';
import CategoriesNavBar from '../CategoriesComponent/CategoriesNavBar';
import SearchResults from '../SearchResultsComponent/SearchResults';
import FiltersNavBar from '../FiltersLeftSideComponent/FitlersNavBar';
import './homePageStyles.css';                                                                             


interface SignUpForm {
    username: string;
    password:String;
    email:String;

}

interface CategoriesNavBarProps {
    onButtonClick: () => void;
    buttonClicked: boolean;
  }

export default function HomePageMainContent({onButtonClick, buttonClicked }: CategoriesNavBarProps){

    return(
        <div className='maincontent'>
        
                <FiltersNavBar />
                <SearchResults  onButtonClick={onButtonClick} buttonClicked={buttonClicked}/>
            
            
        </div>
    )
   

}