import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoriesNavBar from '../CategoriesComponent/CategoriesNavBar';
import SearchResults from '../SearchResultsComponent/SearchResults';
import FiltersNavBar from '../FiltersLeftSideComponent/FitlersNavBar';
import '../../StylingSheets/homePageStyles.css';   
import Discover from '../DiscoverComponent/Discover';                                                                        
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import Social from '../SocialComponent/Social';
import { Logger, LogLevel } from '../../Logger/Logger';


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

    const mainFilter = useSelector((state: RootState) => state.mainfilter.value);
    const boolean = mainFilter === 'Discover';
    const [peopleFilter, setPeopleFilter] = useState(true);
    const [groupFilter, setGroupFilter] = useState(false);
    const [titleFilter, setTitleFilter] = useState(false);
    const boldStyle: React.CSSProperties = {
        fontWeight: 'bold'
        
    };

    function onClick(event: React.MouseEvent<HTMLLIElement, MouseEvent>, filterType: string) {
        switch (filterType) {
            case "People":
                setPeopleFilter(true);       
                setGroupFilter(false);
                setTitleFilter(false);
                break;
            case "Title":
                setPeopleFilter(false);
                setGroupFilter(false);
                setTitleFilter(true);
                break;
            case "Group":
                setPeopleFilter(false);
                setGroupFilter(true);
                setTitleFilter(false);
                break;
        }
    }
    return (
        <div className='maincontent'>
            <FiltersNavBar />
            {mainFilter === 'Discover' ? (
                <Discover onButtonClick={onButtonClick} buttonClicked={buttonClicked} />
            ) : (
                <Social onButtonClick={onButtonClick} buttonClicked={buttonClicked} />
            )}
           
        </div>
    );
    

}