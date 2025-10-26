import React, { useState } from 'react';
import { CreateLinkRequestData, SkillLevel } from '../../models/LinkRequest';
import { createLinkRequest } from '../../NetworkCalls/createCalls/createLinkRequest';
import { Logger, LogLevel } from '../../Logger/Logger';
import '../../StylingSheets/linkRequestModalStyles.css';

interface LinkRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LinkRequestModal: React.FC<LinkRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateLinkRequestData>({
    game: '',
    tags: [],
    skill_level: SkillLevel.INTERMEDIATE
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [newTag, setNewTag] = useState('');

  const skillLevels = [
    { value: SkillLevel.BEGINNER, label: 'Beginner' },
    { value: SkillLevel.INTERMEDIATE, label: 'Intermediate' },
    { value: SkillLevel.ADVANCED, label: 'Advanced' },
    { value: SkillLevel.EXPERT, label: 'Expert' }
  ];

  const commonPlaystyleTags = [
    'Competitive', 'Casual', 'Speedrun', 'Exploration', 'PvP', 'PvE',
    'Cooperative', 'Solo', 'Team-based', 'Strategy', 'Action', 'RPG',
    'FPS', 'RTS', 'MOBA', 'Racing', 'Fighting', 'Puzzle'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCustomTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      handleAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.game.trim()) {
      setError('Game name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await createLinkRequest(formData);
      
      if (response.success) {
        Logger('Link request created successfully', LogLevel.Info);
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          game: '',
          tags: [],
          skill_level: SkillLevel.INTERMEDIATE
        });
      } else {
        setError(response.error || 'Failed to create link request');
      }
    } catch (error) {
      Logger('Error creating link request: ' + error, LogLevel.Error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="link-request-modal-overlay" onClick={handleClose}>
      <div className="link-request-modal" onClick={(e) => e.stopPropagation()}>
        <div className="link-request-modal-header">
          <h2 className="link-request-modal-title">Create Link Request</h2>
          <button 
            className="link-request-modal-close" 
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form className="link-request-modal-form" onSubmit={handleSubmit}>
          <div className="link-request-modal-field">
            <label htmlFor="game" className="link-request-modal-label">
              Game Name *
            </label>
            <input
              type="text"
              id="game"
              name="game"
              value={formData.game}
              onChange={handleInputChange}
              className="link-request-modal-input"
              placeholder="Enter the game you want to play"
              required
              disabled={isLoading}
            />
          </div>

          <div className="link-request-modal-field">
            <label htmlFor="skillLevel" className="link-request-modal-label">
              Skill Level
            </label>
            <select
              id="skillLevel"
              name="skillLevel"
              value={formData.skill_level}
              onChange={handleInputChange}
              className="link-request-modal-select"
              disabled={isLoading}
            >
              {skillLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="link-request-modal-field">
            <label className="link-request-modal-label">
              Playstyle Tags
            </label>
            <div className="link-request-modal-tags">
              {formData.tags.map(tag => (
                <span key={tag} className="link-request-modal-tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="link-request-modal-tag-remove"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <div className="link-request-modal-tag-suggestions">
              <p className="link-request-modal-tag-label">Quick add:</p>
              <div className="link-request-modal-tag-buttons">
                {commonPlaystyleTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="link-request-modal-tag-button"
                    disabled={isLoading || formData.tags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCustomTagSubmit} className="link-request-modal-custom-tag">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add custom tag"
                className="link-request-modal-input"
                disabled={isLoading}
              />
              <button type="submit" className="link-request-modal-add-tag-btn" disabled={isLoading}>
                Add
              </button>
            </form>
          </div>

          {error && (
            <div className="link-request-modal-error">
              {error}
            </div>
          )}

          <div className="link-request-modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="link-request-modal-cancel"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="link-request-modal-submit"
              disabled={isLoading || !formData.game.trim()}
            >
              {isLoading ? 'Creating...' : 'Create Link Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkRequestModal;
