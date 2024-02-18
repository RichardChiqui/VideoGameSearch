import React from 'react';
import { Link } from 'react-router-dom';
import CategoriesNavBar from '../CategoriesComponent/CategoriesNavBar';
import SearchResults from '../SearchResultsComponent/SearchResults';
import FiltersNavBar from '../FiltersLeftSideComponent/FitlersNavBar';


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
        <>
            <div className='homepage-description'>
            <h1>Ready To Play? </h1>
            <h6>Find your next teammate, squad or game to play. Use filters to search</h6>
            </div>
            
            <CategoriesNavBar buttonClicked={buttonClicked}/>

            <div>
                <FiltersNavBar />
                <SearchResults buttonClicked={buttonClicked}/>
            </div>
            
        </>
    )
   

}