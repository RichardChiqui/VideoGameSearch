import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import 'bulma/css/bulma.min.css';
import { changeMainFilter } from '../../ReduxStore/HeaderFilterSlice';
import '../../StylingSheets/headerNavBarStyles.css';
import Avatar from './ProfileNotificationsCounter';
import { userLoggingOut } from '../../ReduxStore/UserstateSlice';
import CreateGroup from './CreateGroupComponent/CreateGroup';
import NotificationsIconComponent from './FriendRequestNotification'; // Import the new component
import ChatIcon from '@mui/icons-material/Chat';
import { useAppSelectors } from '../../hooks/useAppSelector';
import authService from '../../services/AuthService';
import FeedbackModal from './FeedbackModal';

interface HeaderNavbar {
    onButtonClick: () => void;
    dismissHandlerClick: (event: React.FocusEvent<HTMLDivElement>) => void;
    buttonClicked: boolean;
}

export default function HeaderNavBar({ onButtonClick, dismissHandlerClick, buttonClicked }: HeaderNavbar) {
    const appSelectors = useAppSelectors();
    const mainFilter = appSelectors.mainFilter;
    const numofNotifications = appSelectors.numofNotifications;
    const userLoggedIn = appSelectors.userLoggedIn;
    const display_name = useSelector((state: RootState) => state.user.display_name);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = appSelectors.dispatch;
    const boldStyle: React.CSSProperties = {
        fontWeight: 'bold'
        
    };
    const normalStyle: React.CSSProperties = { fontWeight: 'light' };
    const [peopleFilter, setPeopleFilter] = useState(false);
    const [socialFilter, setSocialFilter] = useState(false);
    const [discoverFilter, setDiscoverFilter] = useState(true);
    const [groupFilter, setGroupFilter] = useState(false);
    const [titleFilter, setTitleFilter] = useState(false);

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [playstyle, setPlaystyle] = useState('');
    const [game, setGame] = useState('');
    const [playstyleDropdownOpen, setPlaystyleDropdownOpen] = useState(false);
    const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
    const [playstyleOptions] = useState(['Casual', 'Competitive', 'Role-Playing']);
    const [gameOptions] = useState(['Game 1', 'Game 2', 'Game 3']);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, filterType: string) {
        switch (filterType) {
            case "social":
                setSocialFilter(true);
                setDiscoverFilter(false);
                dispatch(changeMainFilter("social"));
                break;
            case "discover":
                setSocialFilter(false);
                setDiscoverFilter(true);
                dispatch(changeMainFilter("discover"));
                break;
          
        }
    }

    function handleLogOut() {
        dispatch(userLoggingOut());
        authService.logout();
    }

    // Handle clicks outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                console.log('Click outside detected, closing dropdown');
                setDropdownVisible(false);
            }
        };

        if (dropdownVisible) {
            console.log('Adding click outside listener');
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            console.log('Removing click outside listener');
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownVisible]);

    // Debug dropdown state changes
    useEffect(() => {
        console.log('Dropdown state changed to:', dropdownVisible);
    }, [dropdownVisible]);

    return (
        <>
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
                        {/* <div className='navbar-item topnav-cats' style={peopleFilter ? boldStyle : {}} onClick={(e) => onClick(e, "People")}>People</div>
                        <div className='navbar-item topnav-cats' style={groupFilter ? boldStyle : {}} onClick={(e) => onClick(e, "Group")}>Groups</div>
                        <div className='navbar-item topnav-cats' style={titleFilter ? boldStyle : {}} onClick={(e) => onClick(e, "Title")}>Game</div> */}
                         {/* <div className='navbar-item topnav-cats' style={discoverFilter ? boldStyle : {}} onClick={(e) => onClick(e, "discover")}>Discover</div>
                       {userLoggedIn && <div className='navbar-item topnav-cats' style={socialFilter ? boldStyle : {}} onClick={(e) => onClick(e, "social")}>Social</div>} 
                        */}
                    </div>

                    <div className="navbar-end">
                        {userLoggedIn && (
                            <div className="navbar-item">
                                <span className="has-text-white" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                    Welcome, {display_name}!
                                </span>
                            </div>
                        )}
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
                                {/* {userLoggedIn && <CreateGroup />} */}
                                {userLoggedIn && <NotificationsIconComponent />}
                                {userLoggedIn ? (
                                    <>
                                    <div className="dropdown is-right" ref={dropdownRef}>
                                        <div className="dropdown-trigger" onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log('Dropdown clicked, current state:', dropdownVisible);
                                            setDropdownVisible(!dropdownVisible);
                                        }} style={{ fontSize: '1.5em', cursor: 'pointer', padding: '8px' }}>
                                            <Avatar />
                                        </div>
                                            <div className={`dropdown-menu ${dropdownVisible ? 'is-active' : ''}`} style={{
                                                display: dropdownVisible ? 'block' : 'none',
                                                position: 'absolute',
                                                top: '100%',
                                                right: '0',
                                                backgroundColor: 'white',
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                zIndex: 1100,
                                                minWidth: '200px'
                                            }}>
                                                <div className="dropdown-content">
                                                    <a href="#" className="dropdown-item">
                                                        Welcome, {display_name}!
                                                    </a>
                                                    <a href="#" className="dropdown-item" onClick={() => setDropdownVisible(false)}>
                                                        Profile
                                                    </a>
                                                    <a href="#" className="dropdown-item" onClick={() => setDropdownVisible(false)}>
                                                        Settings
                                                    </a>
                                                    <a href="#" className="dropdown-item" onClick={() => {
                                                        setIsFeedbackModalOpen(true);
                                                        setDropdownVisible(false);
                                                    }}>
                                                        📧 Contact Us
                                                    </a>
                                                    {/* <a href="#" className="dropdown-item">
                                                        Friend Requests {numofNotifcations > 0 ? `(${numofNotifcations})` : ''}
                                                    </a> */}
                                                    <hr className="dropdown-divider" />
                                                    <a href="#" className="dropdown-item" onClick={() => {
                                                        handleLogOut();
                                                        setDropdownVisible(false);
                                                    }}>
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
            
            {/* Feedback Modal */}
            <FeedbackModal 
                isOpen={isFeedbackModalOpen} 
                onClose={() => setIsFeedbackModalOpen(false)} 
            />
        </>
    );
}
