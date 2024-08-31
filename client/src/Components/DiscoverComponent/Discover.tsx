import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoriesNavBar from '../CategoriesComponent/CategoriesNavBar';
import SearchResults from '../SearchResultsComponent/SearchResults';
import FiltersNavBar from '../FiltersLeftSideComponent/FitlersNavBar';
import '../../StylingSheets/homePageStyles.css';   
import DiscoverFilters from './Discover';                                                                        
import { useDispatch } from 'react-redux';
import { changeDiscoverSubFilter } from '../../ReduxStore/HeaderFilterSlice';


interface SignUpForm {
    username: string;
    password:String;
    email:String;

}

interface CategoriesNavBarProps {
    onButtonClick: () => void;
    buttonClicked: boolean;
  }

export default function DiscoverTab({onButtonClick, buttonClicked }: CategoriesNavBarProps){

    const [peopleFilter, setPeopleFilter] = useState(true);
    const [groupFilter, setGroupFilter] = useState(false);
    const [titleFilter, setTitleFilter] = useState(false);
    const dispatch = useDispatch();
    const boldStyle: React.CSSProperties = {
        fontWeight: 'bold'
        
    };

    function onClick(event: React.MouseEvent<HTMLLIElement, MouseEvent>, filterType: string) {
        switch (filterType) {
            case "People":
                setPeopleFilter(true);       
                setGroupFilter(false);
                setTitleFilter(false);
                dispatch(changeDiscoverSubFilter("People"));
                break;
            case "Title":
                setPeopleFilter(false);
                setGroupFilter(false);
                setTitleFilter(true);
                dispatch(changeDiscoverSubFilter("Title"));
                break;
            case "Group":
                setPeopleFilter(false);
                setGroupFilter(true);
                setTitleFilter(false);
                dispatch(changeDiscoverSubFilter("Group"));
                break;
        }
    }

    return(
       <div className='container'>
         <div className='discover-filters'>
                    <div className="tabs is-centered">
                        <ul>
                            <li className={peopleFilter ? 'is-active' : ''} onClick={(e) => onClick(e, "People")}>
                                <a>People</a>
                            </li>
                            <li className={groupFilter ? 'is-active' : ''} onClick={(e) => onClick(e, "Group")}>
                                <a>Groups</a>
                            </li>
                            <li className={titleFilter ? 'is-active' : ''} onClick={(e) => onClick(e, "Title")}>
                                <a>Game</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <SearchResults  onButtonClick={onButtonClick} buttonClicked={buttonClicked}/>
       </div>
    )
   

}