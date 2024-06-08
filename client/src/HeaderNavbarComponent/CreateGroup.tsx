import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import 'bulma/css/bulma.min.css';
import './headerNavBarStyles.css'; // Ensure this includes your new CSS

export default function CreateGroup(): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [playstyle, setPlaystyle] = useState('');
    const [game, setGame] = useState('');
    const [playstyleDropdownOpen, setPlaystyleDropdownOpen] = useState(false);
    const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
    const [playstyleOptions, setPlaystyleOptions] = useState<string[]>(['Casual', 'Competitive', 'Role-Playing']);
    const [gameOptions, setGameOptions] = useState<string[]>(['Game 1', 'Game 2', 'Game 3']);
    const [selectedPlaystyles, setSelectedPlaystyles] = useState<string[]>([]);
    const [selectedGames, setSelectedGames] = useState<string[]>([]);

    const playstyleInputRef = useRef<HTMLInputElement>(null);
    const gameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (playstyleDropdownOpen && playstyleInputRef.current) {
            playstyleInputRef.current.focus();
        }
        if (gameDropdownOpen && gameInputRef.current) {
            gameInputRef.current.focus();
        }
    }, [playstyleDropdownOpen, gameDropdownOpen]);

    function closeModal(): void {
        setIsModalOpen(false);
        setPlaystyleDropdownOpen(false);
        setGameDropdownOpen(false);
    }

    function handlePlaystyleChange(event: ChangeEvent<HTMLInputElement>): void {
        const value: string = event.target.value;
        setPlaystyle(value);
    }

    function handleGameChange(event: ChangeEvent<HTMLInputElement>): void {
        const value: string = event.target.value;
        setGame(value);
    }

    function handlePlaystyleSelection(option: string): void {
        if (!selectedPlaystyles.includes(option)) {
            setSelectedPlaystyles([...selectedPlaystyles, option]);
        }
        setPlaystyle(option);
        setPlaystyleDropdownOpen(false);
    }

    function handleGameSelection(option: string): void {
        if (!selectedGames.includes(option)) {
            setSelectedGames([...selectedGames, option]);
        }
        setGame(option);
        setGameDropdownOpen(false);
    }

    function removeSelectedPlaystyle(index: number): void {
        const updatedPlaystyles: string[] = [...selectedPlaystyles];
        updatedPlaystyles.splice(index, 1);
        setSelectedPlaystyles(updatedPlaystyles);
    }

    function removeSelectedGame(index: number): void {
        const updatedGames: string[] = [...selectedGames];
        updatedGames.splice(index, 1);
        setSelectedGames(updatedGames);
    }

    function handlePlaystyleInputBlur(): void {
        setPlaystyleDropdownOpen(false);
    }

    function handleGameInputBlur(): void {
        setGameDropdownOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, handler: () => void): void {
        if (event.key === 'Enter' || event.key === 'Escape') {
            handler();
        }
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
                            <div className="field is-horizontal">
                                <div className="field-label is-normal">
                                    <label className="label">Playstyle</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                        <div className={`dropdown ${playstyleDropdownOpen ? 'is-active' : ''}`} onBlur={handlePlaystyleInputBlur} ref={playstyleInputRef}>
                                            <div className="dropdown-trigger">
                                                <input className="input" type="text" placeholder="Search playstyles" value={playstyle} onChange={handlePlaystyleChange} onFocus={() => setPlaystyleDropdownOpen(true)} onKeyDown={(e) => handleKeyDown(e, handlePlaystyleInputBlur)} />
                                            </div>
                                            {playstyleDropdownOpen && (
                                                <div className="dropdown-menu" style={{ width: '100%' }}>
                                                    <div className="dropdown-content">
                                                        {playstyleOptions.map((option, index) => (
                                                            <a key={index} href="#" className="dropdown-item" onClick={() => handlePlaystyleSelection(option)}>
                                                                {option}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {selectedPlaystyles.length > 0 && (
                                            <div className="tags">
                                                {selectedPlaystyles.map((item, index) => (
                                                    <span key={index} className="tag is-info is-light">
                                                        {item}
                                                        <button className="delete is-small" onClick={() => removeSelectedPlaystyle(index)}></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="field is-horizontal">
                                <div className="field-label is-normal">
                                    <label className="label">Game</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                        <div className={`dropdown ${gameDropdownOpen ? 'is-active' : ''}`} onBlur={handleGameInputBlur} ref={gameInputRef}>
                                            <div className="dropdown-trigger">
                                                <input className="input" type="text" placeholder="Search games" value={game} onChange={handleGameChange} onFocus={() => setGameDropdownOpen(true)} onKeyDown={(e) => handleKeyDown(e, handleGameInputBlur)} />
                                            </div>
                                            {gameDropdownOpen && (
                                                <div className="dropdown-menu" style={{ width: '100%' }}>
                                                    <div className="dropdown-content">
                                                        {gameOptions.map((option, index) => (
                                                            <a key={index} href="#" className="dropdown-item" onClick={() => handleGameSelection(option)}>
                                                                {option}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {selectedGames.length > 0 && (
                                            <div className="tags">
                                                {selectedGames.map((item, index) => (
                                                    <span key={index} className="tag is-info is-light">
                                                        {item}
                                                        <button className="delete is-small" onClick={() => removeSelectedGame(index)}></button>
                                                    </span>
                                                ))}
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
