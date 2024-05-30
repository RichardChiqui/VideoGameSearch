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
    buttonClicked: boolean;
  }

export default function HomePageMainContent({ buttonClicked }: CategoriesNavBarProps){

    return(
        <div className='maincontent'>
        
                <FiltersNavBar />
                <SearchResults buttonClicked={buttonClicked}/>
            
            
        </div>
    )
   

}