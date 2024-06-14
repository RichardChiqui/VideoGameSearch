import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store';
import 'bulma/css/bulma.min.css';
import { changeMainFilter } from './HeaderFilterSlice';
import './headerNavBarStyles.css';
import Avatar from './ProfileNotificationsCounter';
import { userLoggingOut } from '../HomePageComponent/UserstateSlice';
import CreateGroup from './CreateGroupComponent/CreateGroup';
import NotificationsIconComponent from './NotificationsIcon'; // Import the new component

interface HeaderNavbar {
    onButtonClick: () => void;
    dismissHandlerClick: (event: React.FocusEvent<HTMLDivElement>) => void;
    buttonClicked: boolean;
}

export default function HeaderNavBar({ onButtonClick, dismissHandlerClick, buttonClicked }: HeaderNavbar) {
    const mainFilter = useSelector((state: RootState) => state.mainfilter.value);
    const numofNotifcations = useSelector((state: RootState) => state.notifications.value);
    const dispatch = useDispatch();

    const isUserLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
    const boldStyle: React.CSSProperties = { fontWeight: 'bold' };
    const normalStyle: React.CSSProperties = { fontWeight: 'light' };
    const [peopleFilter, setPeopleFilter] = useState(true);
    const [groupFilter, setGroupFilter] = useState(false);
    const [titleFilter, setTitleFilter] = useState(false);

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [playstyle, setPlaystyle] = useState('');
    const [game, setGame] = useState('');
    const [playstyleDropdownOpen, setPlaystyleDropdownOpen] = useState(false);
    const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
    const [playstyleOptions] = useState(['Casual', 'Competitive', 'Role-Playing']);
    const [gameOptions] = useState(['Game 1', 'Game 2', 'Game 3']);

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

    function handleLogOut() {
        dispatch(userLoggingOut());
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
                            {isUserLoggedIn && <CreateGroup />}
                            {isUserLoggedIn && <NotificationsIconComponent />}
                            {isUserLoggedIn ? (
                                <>
                                    <div className="dropdown is-right is-hoverable">
                                        <div className="dropdown-trigger" onClick={() => setDropdownVisible(!dropdownVisible)} style={{ fontSize: '1.5em' }}>
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
                                                <a href="#" className="dropdown-item" onClick={() => handleLogOut()} >
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
