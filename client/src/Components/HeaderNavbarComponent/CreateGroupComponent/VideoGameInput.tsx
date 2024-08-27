import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import 'bulma/css/bulma.min.css';

export default function GameInput(): JSX.Element {
    const [game, setGame] = useState('');
    const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
    const [gameOptions, setGameOptions] = useState<string[]>(['Game 1', 'Game 2', 'Game 3']);
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const gameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (gameDropdownOpen && gameInputRef.current) {
            gameInputRef.current.focus();
        }
    }, [gameDropdownOpen]);

    function handleGameChange(event: ChangeEvent<HTMLInputElement>): void {
        const value: string = event.target.value;
        setGame(value);
        setGameDropdownOpen(true);
    }

    function handleGameSelection(option: string): void {
        setSelectedGame(option);
        setGame('');
        setGameDropdownOpen(false);
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
        <div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label">Game</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Search games"
                            value={game}
                            onChange={handleGameChange}
                            onFocus={() => setGameDropdownOpen(true)}
                            onKeyDown={(e) => handleKeyDown(e, handleGameInputBlur)}
                        />
                    </div>
                    {gameDropdownOpen && (
                        <div className="dropdown is-active" onBlur={handleGameInputBlur}>
                            <div className="dropdown-menu" style={{ width: '100%' }}>
                                <div className="dropdown-content">
                                    {gameOptions.filter(option => option.toLowerCase().includes(game.toLowerCase())).map((option, index) => (
                                        <a key={index} href="#" className="dropdown-item" onClick={() => handleGameSelection(option)}>
                                            {option}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="field">
                    <div className="control">
                        {selectedGame && (
                            <div className="tags">
                                <span className="tag is-info is-light">
                                    {selectedGame}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
