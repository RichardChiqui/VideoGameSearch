import React, { useState, useEffect, useRef } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './headerNavBarStyles.css';

const NotificationsIconComponent = () => {
    const [notifWindowVisible, setNotifWindowVisible] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
            setNotifWindowVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="notifications-icon-container" ref={notifRef}>
            <NotificationsIcon
                className="notifications-icon"
                onClick={() => setNotifWindowVisible(!notifWindowVisible)}
            />
            {notifWindowVisible && (
                <div className="notif-window">
                    <div className="notif-header">Notifications</div>
                    <div className="notif-content">
                        <p className="notif-item">FriendRequest</p>
                        <p className="notif-item">FriendRequest</p>
                        <p className="notif-item">FriendRequest</p>
                        {/* Add more FriendRequest entries here */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsIconComponent;
