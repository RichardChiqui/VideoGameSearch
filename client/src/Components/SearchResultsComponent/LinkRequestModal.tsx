import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { CreateLinkRequestData } from '../../models/LinkRequest';
import { createLinkRequest } from '../../NetworkCalls/createCalls/createLinkRequest';
import { Logger, LogLevel } from '../../Logger/Logger';
import { GAME_NAME_DESCRIPTIONS } from '../../enums/gameNameEnums';
import { PLAY_STYLE_TAGS } from '../../enums/PlayStyleTagsEnums';
import { PLATFORM_OPTIONS } from '../../enums/PlatformEnums';
import { addLinkRequestNotification } from '../../ReduxStore/NotificationsSlice';
import '../../StylingSheets/linkRequestModalStyles.css';

interface LinkRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LinkRequestModal: React.FC<LinkRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<CreateLinkRequestData>({
    game_name: '',
    tags: [],
    description: '',
    platform: 'Any'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedGameOption, setSelectedGameOption] = useState<string>('');
  const [otherGameName, setOtherGameName] = useState<string>('');
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const tagsDropdownRef = useRef<HTMLDivElement>(null);
  const tagsButtonRef = useRef<HTMLButtonElement>(null);
  const [tagsDropdownPos, setTagsDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  // Handle click outside to close tags dropdown
  useEffect(() => {
    if (!tagsDropdownOpen) return;

    const updatePosition = () => {
      if (tagsButtonRef.current) {
        const rect = tagsButtonRef.current.getBoundingClientRect();
        setTagsDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
      }
    };

    updatePosition();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(target) &&
        tagsButtonRef.current &&
        !tagsButtonRef.current.contains(target)
      ) {
        setTagsDropdownOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [tagsDropdownOpen]);

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

  const handleToggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      handleAddTag(tag);
    }
    // Don't close dropdown on selection to allow multiple selections
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveGameName = selectedGameOption === 'OTHER' ? otherGameName.trim() : formData.game_name.trim();

    if (!effectiveGameName) {
      setError('Game name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await createLinkRequest({
        ...formData,
        game_name: effectiveGameName
      });
      
      if (response.success && response.data) {
        Logger('Link request created successfully', LogLevel.Info);
        
        // Add notification for the new link request
        dispatch(addLinkRequestNotification({
          id: response.data.id || Date.now(),
          game_name: effectiveGameName,
          platform: formData.platform || 'Any',
          createdAt: new Date().toISOString()
        }));
        
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          game_name: '',
          tags: [],
          description: '',
          platform: 'Any'
        });
        setSelectedGameOption('');
        setOtherGameName('');
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
            <select
              id="game"
              name="game_name"
              value={selectedGameOption}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedGameOption(value);
                if (value !== 'OTHER') {
                  setFormData(prev => ({ ...prev, game_name: value }));
                  setOtherGameName('');
                } else {
                  setFormData(prev => ({ ...prev, game_name: '' }));
                }
                setError('');
              }}
              className="link-request-modal-select"
              required
              disabled={isLoading}
            >
              <option value="" disabled>Select a game</option>
              {Object.entries(GAME_NAME_DESCRIPTIONS).map(([id, name]) => (
                <option key={id} value={name}>{name}</option>
              ))}
              <option value="OTHER">Other</option>
            </select>
            {selectedGameOption === 'OTHER' && (
              <div className="link-request-modal-field" style={{ marginTop: '8px' }}>
                <input
                  type="text"
                  value={otherGameName}
                  onChange={(e) => {
                    setOtherGameName(e.target.value);
                    setError('');
                  }}
                  className="link-request-modal-input"
                  placeholder="Enter game name"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <div className="link-request-modal-field">
            <label htmlFor="platform" className="link-request-modal-label">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform || 'Any'}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  platform: e.target.value
                }));
                setError('');
              }}
              className="link-request-modal-select"
              disabled={isLoading}
            >
              {PLATFORM_OPTIONS.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div className="link-request-modal-field">
            <label htmlFor="description" className="link-request-modal-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }));
                setError('');
              }}
              className="link-request-modal-input"
              placeholder="Enter a description for your link request..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="link-request-modal-field">
            <label className="link-request-modal-label">
              Playstyle Tags
            </label>
            
            {/* Selected Tags Display */}
            {formData.tags.length > 0 && (
              <div className="link-request-modal-tags" style={{ marginBottom: '10px' }}>
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
            )}

            {/* Tags Dropdown */}
            <div style={{ position: 'relative', overflow: 'visible' }} onMouseDown={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!tagsDropdownOpen && tagsButtonRef.current) {
                    const rect = tagsButtonRef.current.getBoundingClientRect();
                    setTagsDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
                  }
                  setTagsDropdownOpen(!tagsDropdownOpen);
                }}
                onMouseDown={(e) => {
                  // Prevent document-level mousedown handler from closing before click
                  e.stopPropagation();
                }}
                className="link-request-modal-select"
                style={{ 
                  width: '100%', 
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                disabled={isLoading}
                ref={tagsButtonRef}
              >
                <span>{formData.tags.length > 0 ? `${formData.tags.length} tag${formData.tags.length > 1 ? 's' : ''} selected` : 'Select tags'}</span>
                <span style={{ transform: tagsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
              </button>
              
              {tagsDropdownOpen && ReactDOM.createPortal(
                <div
                  ref={tagsDropdownRef}
                  style={{
                    position: 'absolute',
                    top: tagsDropdownPos.top,
                    left: tagsDropdownPos.left,
                    minWidth: Math.max(200, tagsDropdownPos.width),
                    background: 'white',
                    border: '1px solid #E8F4F8',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    zIndex: 3000,
                    marginTop: 4,
                    maxHeight: 300,
                    overflowY: 'auto',
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div style={{ padding: '8px 0', background: 'white' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 16px',
                      borderBottom: '1px solid #e8f4f8',
                      fontWeight: 600,
                      fontSize: '12px',
                      color: '#2c3e50',
                      textTransform: 'uppercase'
                    }}>
                      <span>Select Tags</span>
                      {formData.tags.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, tags: [] }));
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6B73FF',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    {PLAY_STYLE_TAGS.map(tag => (
                      <div
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          transition: 'background 0.3s ease',
                          color: '#2c3e50',
                          fontSize: '14px',
                          backgroundColor: formData.tags.includes(tag) 
                            ? 'rgba(107, 115, 255, 0.1)' 
                            : 'transparent',
                          fontWeight: formData.tags.includes(tag) ? 600 : 400
                        }}
                        onMouseEnter={(e) => {
                          if (!formData.tags.includes(tag)) {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!formData.tags.includes(tag)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {formData.tags.includes(tag) && '✓ '}{tag}
                      </div>
                    ))}
                  </div>
                </div>,
                document.body
              )}
            </div>
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
              disabled={isLoading || !formData.game_name.trim()}
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
