import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import 'bulma/css/bulma.min.css';

export default function PlaystyleInput(): JSX.Element {
    const [playstyle, setPlaystyle] = useState('');
    const [playstyleDropdownOpen, setPlaystyleDropdownOpen] = useState(false);
    const [playstyleOptions, setPlaystyleOptions] = useState<string[]>(['Casual', 'Competitive', 'Role-Playing']);
    const [selectedPlaystyles, setSelectedPlaystyles] = useState<string[]>([]);

    const playstyleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (playstyleDropdownOpen && playstyleInputRef.current) {
            playstyleInputRef.current.focus();
        }
    }, [playstyleDropdownOpen]);

    function handlePlaystyleChange(event: ChangeEvent<HTMLInputElement>): void {
        const value: string = event.target.value;
        setPlaystyle(value);
        setPlaystyleDropdownOpen(true);
    }

    function handlePlaystyleSelection(option: string): void {
        if (!selectedPlaystyles.includes(option)) {
            setSelectedPlaystyles([...selectedPlaystyles, option]);
            setPlaystyleOptions(playstyleOptions.filter(opt => opt !== option));
        }
        setPlaystyle('');
        setPlaystyleDropdownOpen(false);
    }

    function removeSelectedPlaystyle(index: number): void {
        const updatedPlaystyles: string[] = [...selectedPlaystyles];
        const removedPlaystyle: string = updatedPlaystyles.splice(index, 1)[0];
        setSelectedPlaystyles(updatedPlaystyles);
        setPlaystyleOptions([...playstyleOptions, removedPlaystyle]);
    }

    function handlePlaystyleInputBlur(): void {
        setPlaystyleDropdownOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, handler: () => void): void {
        if (event.key === 'Enter' || event.key === 'Escape') {
            handler();
        }
    }

    return (
        <div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label">Playstyle</label>
            </div>
            <div className="field-body">
                <div className="field">
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Search playstyles"
                            value={playstyle}
                            onChange={handlePlaystyleChange}
                            onFocus={() => setPlaystyleDropdownOpen(true)}
                            onKeyDown={(e) => handleKeyDown(e, handlePlaystyleInputBlur)}
                        />
                    </div>
                    {playstyleDropdownOpen && (
                        <div className="dropdown is-active" onBlur={handlePlaystyleInputBlur}>
                            <div className="dropdown-menu" style={{ width: '100%' }}>
                                <div className="dropdown-content">
                                    {playstyleOptions.filter(option => option.toLowerCase().includes(playstyle.toLowerCase())).map((option, index) => (
                                        <a key={index} href="#" className="dropdown-item" onClick={() => handlePlaystyleSelection(option)}>
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
        </div>
    );
}
