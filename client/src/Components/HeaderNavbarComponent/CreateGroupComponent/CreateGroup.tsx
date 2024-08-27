import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../headerNavBarStyles.css'; // Ensure this includes your new CSS
import GameInput from './VideoGameInput'; // Adjust the path as necessary
import PlaystyleInput from './PlayStyleInput'; // Adjust the path as necessary

import {sendCreateGroup} from '../../../NetworkCalls/createCalls/createGroupsCall';

export default function CreateGroup(): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');

    function closeModal(): void {
        setIsModalOpen(false);
    }

    async function createGroup(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        // Empty method for creating group logic
        event.preventDefault();

       
        const groupData = {
            fk_adminId: 1, // example value
            groupName: "test", // example value
            groupGame: "blops6", // example value
            groupPlayStyle: ['playstyle1', 'playstyle2'] // example value
        };
        const usersData = await sendCreateGroup(groupData);
    }

    return (
        <div>
            <button className="button is-primary" onClick={() => setIsModalOpen(true)}>Create Group</button>
            {isModalOpen && (
                <div className={`modal is-active`}>
                    <div className="modal-background" onClick={closeModal}></div>
                    <div className="modal-content" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="box">
                            <h1 className="title">Create Group</h1>
                            <div className="field is-horizontal">
                                <div className="field-label is-normal">
                                    <label className="label">Group Name</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                            <input className="input" type="text" placeholder="Enter group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <PlaystyleInput />
                            <GameInput />
                            <div className="field is-grouped is-grouped-centered">
                                <div className="control">
                                    <button className="button is-primary" onClick={createGroup}>Create Group</button>
                                </div>
                                <div className="control">
                                    <button className="button is-light" onClick={closeModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
                </div>
            )}
        </div>
    );
}
