import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

const LeftSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <aside className="menu" style={{ borderRight: '1px solid black', height: '100vh' }}>
            {/* <p className="menu-label">General</p>
            <ul className="menu-list">
                <li><a>Dashboard</a></li>
                <li><a>Customers</a></li>
            </ul> */}
            <p className="menu-label">General</p>
            <ul className="menu-list">
                <li><a>Team Settings</a></li>
                <li>
                <a className="is-active">New</a>
                {/* <ul>
                    <li><a>Members</a></li>
                    <li><a>Plugins</a></li>
                    <li><a>Add a member</a></li>
                </ul> */}
                </li>
                <li><a>Popular</a></li>
                {/* <li><a>Cloud Storage Environment Settings</a></li> */}
                <li><a>Settings</a></li>
            </ul>
            {/* <p className="menu-label">Transactions</p>
            <ul className="menu-list">
                <li><a>Payments</a></li>
                <li><a>Transfers</a></li>
                <li><a>Balance</a></li>
            </ul> */}
            </aside>
    );
};

export default LeftSidebar;
