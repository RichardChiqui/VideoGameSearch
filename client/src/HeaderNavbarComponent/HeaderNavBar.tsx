import React, { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store';
import 'bulma/css/bulma.min.css';
import { changeMainFilter } from './HeaderFilterSlice';
import './headerNavBarStyles.css'; // Make sure you have custom styles if needed
import Avatar from './ProfileNotificationsCounter';

interface HeaderNavbar {
    onButtonClick: () => void;
    dismissHandlerClick: (event: React.FocusEvent<HTMLDivElement>) => void;
    buttonClicked: boolean;
}

export default function HeaderNavBar({ onButtonClick,dismissHandlerClick ,buttonClicked }: HeaderNavbar) {
    const mainFilter = useSelector((state: RootState) => state.mainfilter.value);
    const numofNotifcations = useSelector((state: RootState) => state.notifications.value);
    const dispatch = useDispatch();

    const isUserLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);

    useEffect(() => {
        if (isUserLoggedIn) {
            console.log('Element is visible');
        } else {
            console.log('Element is hidden');
        }
    }, [isUserLoggedIn]);

    const boldStyle: React.CSSProperties = { fontWeight: 'bold' };
    const normalStyle: React.CSSProperties = { fontWeight: 'light' };
    const [peopleFilter, setPeopleFilter] = React.useState(false);
    const [groupFilter, setGroupFilter] = React.useState(false);
    const [titleFilter, setTitleFilter] = React.useState(true);

    const [dropdownVisible, setDropdownVisible] = useState(false);

    function onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, filterType: string) {
        switch (filterType) {
            case "People":
                setPeopleFilter(true);
                setGroupFilter(false);
                setTitleFilter(false);
                dispatch(changeMainFilter("People"));
                break;
            case "Title":
                setPeopleFilter(false);
                setGroupFilter(false);
                setTitleFilter(true);
                dispatch(changeMainFilter("Title"));
                break;
            case "Group":
                setPeopleFilter(false);
                setGroupFilter(true);
                setTitleFilter(false);
                dispatch(changeMainFilter("Group"));
                break;
        }
    }

    return (
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <strong>GameLink</strong>
                </a>
                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMenu" onClick={() => {
                    const burger = document.querySelector('.navbar-burger');
                    const menu = document.getElementById('navbarMenu');
                    burger?.classList.toggle('is-active');
                    menu?.classList.toggle('is-active');
                }}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarMenu" className="navbar-menu">
                <div className="navbar-start">
                    <div className='navbar-item topnav-cats' style={peopleFilter ? boldStyle : {}} onClick={(e) => onClick(e, "People")}>People</div>
                    <div className='navbar-item topnav-cats' style={groupFilter ? boldStyle : {}} onClick={(e) => onClick(e, "Group")}>Groups</div>
                    <div className='navbar-item topnav-cats' style={titleFilter ? boldStyle : {}} onClick={(e) => onClick(e, "Title")}>Game</div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="field">
                            <div className="control has-icons-left">
                                <input className="input" type="text" placeholder="Search" />
                                <span className="icon is-left">
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-item">
                        <div className="buttons">
                            {isUserLoggedIn && <button className="button is-primary">Create Group</button>}
                            {isUserLoggedIn ? (
                                <>
                                    <div className="dropdown is-right is-hoverable">
                                        <div className="dropdown-trigger" onClick={() => setDropdownVisible(!dropdownVisible)}>
                                            <Avatar />
                                        </div>
                                        <div className={`dropdown-menu ${dropdownVisible ? 'is-active' : ''}`}>
                                            <div className="dropdown-content">
                                                <a href="#" className="dropdown-item">
                                                    Profile
                                                </a>
                                                <a href="#" className="dropdown-item">
                                                    Settings
                                                </a>
                                                <a href="#" className="dropdown-item">
                                                    Friend Requests {numofNotifcations > 0 ? `(${numofNotifcations})` : ''}
                                                </a>
                                                <hr className="dropdown-divider" />
                                                <a href="#" className="dropdown-item">
                                                    Logout
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <button className={`signinbutton ${buttonClicked ? 'no-hover' : ''}`} onClick={onButtonClick} >SignUp/Login</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
