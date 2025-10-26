import React, { useState, useRef, useEffect } from 'react';
import { Logger, LogLevel } from '../../Logger/Logger';
import '../../StylingSheets/hybridSearchStyles.css';

interface SearchFilters {
  game: string;
  skillLevel: string;
  tags: string[];
}

interface HybridSearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  onClearFilters?: () => void;
}

const SKILL_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Expert'
];

const POPULAR_GAMES = [
  'Overwatch',
  'Fortnite',
  'Modern Warfare 2',
  'Avatar: Frontiers of Pandora',
  'Call of Duty',
  'Valorant',
  'League of Legends',
  'Counter-Strike 2',
  'Apex Legends',
  'Rocket League'
];

const POPULAR_TAGS = [
  'Competitive',
  'Casual',
  'Speedrun',
  'Exploration',
  'PvP',
  'PvE',
  'Cooperative',
  'Solo',
  'Team-based',
  'Strategy',
  'Action',
  'RPG',
  'FPS',
  'RTS',
  'MOBA',
  'Racing',
  'Fighting',
  'Puzzle'
];

export default function HybridSearchBar({ onSearch, placeholder = "Search by game name (e.g., Overwatch, Fortnite)...", onClearFilters }: HybridSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    game: '',
    skillLevel: '',
    tags: []
  });
  
  // Dropdown states
  const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  
  // Refs for click outside detection
  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const skillDropdownRef = useRef<HTMLDivElement>(null);
  const tagsDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gameDropdownRef.current && !gameDropdownRef.current.contains(event.target as Node)) {
        setGameDropdownOpen(false);
      }
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target as Node)) {
        setSkillDropdownOpen(false);
      }
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target as Node)) {
        setTagsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    Logger(`Searching for: "${searchQuery}" with filters:`, LogLevel.Debug);
    Logger(`Game: ${filters.game}, Skill: ${filters.skillLevel}, Tags: ${filters.tags.join(', ')}`, LogLevel.Debug);
    
    // If user typed in search but didn't select a game, treat the search query as a game name
    const gameToSearch = filters.game || searchQuery.trim();
    
    onSearch(searchQuery, {
      ...filters,
      game: gameToSearch
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGameSelect = (game: string) => {
    setFilters(prev => ({ ...prev, game }));
    setGameDropdownOpen(false);
    Logger(`Selected game: ${game}`, LogLevel.Debug);
  };

  const handleSkillSelect = (skillLevel: string) => {
    setFilters(prev => ({ ...prev, skillLevel }));
    setSkillDropdownOpen(false);
    Logger(`Selected skill level: ${skillLevel}`, LogLevel.Debug);
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
    Logger(`Toggled tag: ${tag}`, LogLevel.Debug);
  };

  const clearFilters = () => {
    setFilters({
      game: '',
      skillLevel: '',
      tags: []
    });
    setSearchQuery('');
    Logger('Cleared all filters', LogLevel.Debug);
    
    // Call the parent's clear filters callback if provided
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const hasActiveFilters = filters.game || filters.skillLevel || filters.tags.length > 0;

  return (
    <div className="hybrid-search-container">
      {/* Main Search Bar */}
      <div className="search-main">
        <div className="search-input-container">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="search-button"
            onClick={handleSearch}
            title="Search"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="search-filters">
        {/* Game Filter */}
        <div className="filter-dropdown" ref={gameDropdownRef}>
          <button
            className={`filter-button ${filters.game ? 'active' : ''}`}
            onClick={() => setGameDropdownOpen(!gameDropdownOpen)}
          >
            <i className="fas fa-gamepad"></i>
            <span>{filters.game || 'Game'}</span>
            <i className={`fas fa-chevron-down ${gameDropdownOpen ? 'rotated' : ''}`}></i>
          </button>
          
          {gameDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-content">
                <div className="dropdown-header">
                  <span>Select Game</span>
                  {filters.game && (
                    <button 
                      className="clear-filter"
                      onClick={() => handleGameSelect('')}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {POPULAR_GAMES.map((game) => (
                  <div
                    key={game}
                    className={`dropdown-item ${filters.game === game ? 'selected' : ''}`}
                    onClick={() => handleGameSelect(game)}
                  >
                    {game}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skill Level Filter */}
        <div className="filter-dropdown" ref={skillDropdownRef}>
          <button
            className={`filter-button ${filters.skillLevel ? 'active' : ''}`}
            onClick={() => setSkillDropdownOpen(!skillDropdownOpen)}
          >
            <i className="fas fa-star"></i>
            <span>{filters.skillLevel || 'Skill Level'}</span>
            <i className={`fas fa-chevron-down ${skillDropdownOpen ? 'rotated' : ''}`}></i>
          </button>
          
          {skillDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-content">
                <div className="dropdown-header">
                  <span>Select Skill Level</span>
                  {filters.skillLevel && (
                    <button 
                      className="clear-filter"
                      onClick={() => handleSkillSelect('')}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {SKILL_LEVELS.map((skill) => (
                  <div
                    key={skill}
                    className={`dropdown-item ${filters.skillLevel === skill ? 'selected' : ''}`}
                    onClick={() => handleSkillSelect(skill)}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tags Filter */}
        <div className="filter-dropdown" ref={tagsDropdownRef}>
          <button
            className={`filter-button ${filters.tags.length > 0 ? 'active' : ''}`}
            onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
          >
            <i className="fas fa-tags"></i>
            <span>
              {filters.tags.length > 0 
                ? `${filters.tags.length} tag${filters.tags.length > 1 ? 's' : ''}`
                : 'Tags'
              }
            </span>
            <i className={`fas fa-chevron-down ${tagsDropdownOpen ? 'rotated' : ''}`}></i>
          </button>
          
          {tagsDropdownOpen && (
            <div className="dropdown-menu tags-dropdown">
              <div className="dropdown-content">
                <div className="dropdown-header">
                  <span>Select Tags</span>
                  {filters.tags.length > 0 && (
                    <button 
                      className="clear-filter"
                      onClick={() => setFilters(prev => ({ ...prev, tags: [] }))}
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="tags-grid">
                  {POPULAR_TAGS.map((tag) => (
                    <div
                      key={tag}
                      className={`tag-item ${filters.tags.includes(tag) ? 'selected' : ''}`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clear All Filters */}
        {hasActiveFilters && (
          <button 
            className="clear-all-button"
            onClick={clearFilters}
            title="Clear all filters"
          >
            <i className="fas fa-times"></i>
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {filters.game && (
            <span className="filter-chip">
              <i className="fas fa-gamepad"></i>
              {filters.game}
              <button onClick={() => handleGameSelect('')}>×</button>
            </span>
          )}
          {filters.skillLevel && (
            <span className="filter-chip">
              <i className="fas fa-star"></i>
              {filters.skillLevel}
              <button onClick={() => handleSkillSelect('')}>×</button>
            </span>
          )}
          {filters.tags.map((tag) => (
            <span key={tag} className="filter-chip">
              <i className="fas fa-tag"></i>
              {tag}
              <button onClick={() => handleTagToggle(tag)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
