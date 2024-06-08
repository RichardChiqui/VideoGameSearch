import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import './headerNavBarStyles.css'; // Ensure this includes your new CSS

export default function CreateGroup() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [playstyle, setPlaystyle] = useState('');
    const [game, setGame] = useState('');
    const [playstyleDropdownOpen, setPlaystyleDropdownOpen] = useState(false);
    const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
    const [playstyleOptions, setPlaystyleOptions] = useState(['Casual', 'Competitive', 'Role-Playing']);
    const [gameOptions, setGameOptions] = useState(['Game 1', 'Game 2', 'Game 3']);

    function closeModal() {
        setIsModalOpen(false);
        setPlaystyleDropdownOpen(false);
        setGameDropdownOpen(false);
    }

    function handlePlaystyleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPlaystyle(event.target.value);
        setPlaystyleDropdownOpen(true);
    }

    function handleGameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setGame(event.target.value);
        setGameDropdownOpen(true);
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
                            <div className="field">
                                <label className="label">Group Name</label>
                                <div className="control">
                                    <input className="input" type="text" placeholder="Enter group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Playstyle</label>
                                <div className="control">
                                    <div className={`dropdown ${playstyleDropdownOpen ? 'is-active' : ''}`} onClick={() => setPlaystyleDropdownOpen(true)}>
                                        <div className="dropdown-trigger">
                                            <input className="input" type="text" placeholder="Search playstyles" value={playstyle} onChange={handlePlaystyleChange} />
                                        </div>
                                        {playstyleDropdownOpen && (
                                            <div className="dropdown-menu" style={{ width: '100%' }}>
                                                <div className="dropdown-content">
                                                    {playstyleOptions.filter(option => option.toLowerCase().includes(playstyle.toLowerCase())).map((option, index) => (
                                                        <a key={index} href="#" className="dropdown-item" onClick={() => {
                                                            setPlaystyle(option);
                                                            setPlaystyleDropdownOpen(false);
                                                        }}>
                                                            {option}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Game</label>
                                <div className="control">
                                    <div className={`dropdown ${gameDropdownOpen ? 'is-active' : ''}`} onClick={() => setGameDropdownOpen(true)}>
                                        <div className="dropdown-trigger">
                                            <input className="input" type="text" placeholder="Search games" value={game} onChange={handleGameChange} />
                                        </div>
                                        {gameDropdownOpen && (
                                            <div className="dropdown-menu" style={{ width: '100%' }}>
                                                <div className="dropdown-content">
                                                    {gameOptions.filter(option => option.toLowerCase().includes(game.toLowerCase())).map((option, index) => (
                                                        <a key={index} href="#" className="dropdown-item" onClick={() => {
                                                            setGame(option);
                                                            setGameDropdownOpen(false);
                                                        }}>
                                                            {option}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button className="button is-primary" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
                </div>
            )}
        </div>
    );
}
