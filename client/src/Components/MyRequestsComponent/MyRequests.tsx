import React, { useState, useEffect, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { loadLinkRequestsByUser } from '../../NetworkCalls/FetchCalls/LinkRequests/FetchLinkRequests';
import { deleteLinkRequest } from '../../NetworkCalls/deleteCalls/deleteLinkRequest';
import { updateLinkRequest } from '../../NetworkCalls/updateCalls/updateLinkRequest';
import { LinkRequest } from '../../models/LinkRequest';
import { REGIONS_DESCRIPTIONS, REGIONS_ENUMS } from '../../enums/RegionsEnums';
import { Logger, LogLevel } from '../../Logger/Logger';
import LinkRequestModal from '../SearchResultsComponent/LinkRequestModal';
import '../../StylingSheets/searchResultsStyles.css';
import '../../StylingSheets/myRequestsStyles.css';

export default function MyRequests() {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.userId);
  const userLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);

  const [linkRequestsList, setLinkRequestsList] = useState<LinkRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deletedRequests, setDeletedRequests] = useState<Set<number>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LinkRequest | null>(null);

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/');
      return;
    }

    fetchMyRequests();
  }, [userLoggedIn, userId]);

  const fetchMyRequests = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError('');

    try {
      const linkRequestsData = await loadLinkRequestsByUser(userId);
      
      const linkRequestsList: LinkRequest[] = linkRequestsData.linkRequests.map((req: LinkRequest) => {
        // Convert region enum ID to description if it exists
        let regionDescription: string | undefined = req.region;
        if (req.region && typeof req.region === 'number') {
          const enumValue = req.region as REGIONS_ENUMS;
          regionDescription = REGIONS_DESCRIPTIONS[enumValue] || String(req.region);
        } else if (!req.region) {
          regionDescription = undefined;
        }
        
        return {
          id: req.id,
          user_id: req.user_id,
          display_name: req.display_name,
          game_name: req.game_name,
          tags: req.tags,
          description: req.description || '',
          status: req.status,
          region: regionDescription
        };
      });
    
      setLinkRequestsList(linkRequestsList);
    } catch (err) {
      Logger('Failed to load my link requests: ' + err, LogLevel.Error);
      setError('Failed to load your link requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  async function handleDeleteLinkRequest(linkRequest: LinkRequest) {
    if (!linkRequest.id) {
      Logger('Cannot delete link request: missing ID', LogLevel.Error);
      return;
    }

    try {
      Logger(`Deleting link request with ID: ${linkRequest.id}`, LogLevel.Debug);
      
      const response = await deleteLinkRequest(linkRequest.id);
      
      if (response.success) {
        // Add to deleted requests set for visual feedback
        setDeletedRequests(prev => new Set(prev).add(linkRequest.id!));
        
        // Remove from the list after a short delay for visual feedback
        setTimeout(() => {
          setLinkRequestsList(prev => prev.filter(req => req.id !== linkRequest.id));
          setDeletedRequests(prev => {
            const newSet = new Set(prev);
            newSet.delete(linkRequest.id!);
            return newSet;
          });
        }, 1000);
        
        Logger('Link request deleted successfully!', LogLevel.Info);
      } else {
        Logger(`Failed to delete link request: ${response.error}`, LogLevel.Error);
        setError(response.error || 'Failed to delete link request');
      }
    } catch (error) {
      Logger(`Error deleting link request: ${error}`, LogLevel.Error);
      setError('An error occurred while deleting the link request');
    }
  }

  function handleEditLinkRequest(linkRequest: LinkRequest) {
    setEditingRequest(linkRequest);
    setIsEditModalOpen(true);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setEditingRequest(null);
  }

  async function handleUpdateLinkRequest(updatedData: any) {
    if (!editingRequest || !editingRequest.id) {
      return;
    }

    try {
      const response = await updateLinkRequest(editingRequest.id, updatedData);
      
      if (response.success) {
        Logger('Link request updated successfully', LogLevel.Info);
        // Refresh the list
        await fetchMyRequests();
        handleCloseEditModal();
      } else {
        setError(response.error || 'Failed to update link request');
      }
    } catch (error) {
      Logger('Error updating link request: ' + error, LogLevel.Error);
      setError('An error occurred while updating the link request');
    }
  }

  const cardStyle: CSSProperties = { minHeight: '350px', display: 'flex', flexDirection: 'column' };
  const cardContentStyle: CSSProperties = { flex: '1' };

  if (isLoading) {
    return (
      <div className="my-requests-page">
        <div className="my-requests-container">
          <div className="loading-message">Loading your requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-requests-page">
      <div className="my-requests-container">
        <div className="my-requests-header">
          <h1 className="my-requests-title">MY Requests</h1>
          <button 
            className="my-requests-close-btn"
            onClick={() => navigate('/')}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="my-requests-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {linkRequestsList.length === 0 ? (
          <div className="my-requests-empty">
            <p>You haven't created any link requests yet.</p>
            <p>Create your first link request from the Discover page!</p>
          </div>
        ) : (
          <div className="columns is-multiline my-requests-grid">
            {linkRequestsList.map((item: LinkRequest) => (
              <div className="column is-one-quarter" key={item.id}>
                <div className="card" style={cardStyle}>
                  <header className="card-header">
                    <p className="card-header-title" style={{ margin: 0, flex: 1 }}>{item.display_name}</p>
                    {item.region && (
                      <span className="card-header-region" style={{ 
                        color: 'white', 
                        fontSize: '0.9em', 
                        opacity: 0.9,
                        fontWeight: 500
                      }}>
                        {item.region}
                      </span>
                    )}
                  </header>
                  <div className="card-content" style={cardContentStyle}>
                    <div className="content">
                      {/* Game Information */}
                      {item.game_name && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Game:</strong> {item.game_name}
                        </div>
                      )}
                      
                      {/* Horizontal line separator */}
                      <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                      
                      {/* Play Style Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Play Style:</strong>
                          <div style={{ marginTop: '5px' }}>
                            {item.tags.map((style, index) => (
                              <span 
                                key={index}
                                className="tag is-info is-light" 
                                style={{ marginRight: '5px', marginBottom: '3px', fontSize: '0.75rem' }}
                              >
                                {style}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Horizontal line separator */}
                      <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                      
                      {/* Description */}
                      {item.description && (
                        <div>
                          <strong>Description:</strong>
                          <p style={{ marginTop: '5px', marginBottom: '0', fontSize: '0.9rem', color: '#2C3E50', lineHeight: '1.4' }}>
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <footer className="card-footer">
                    <button 
                      className={`button card-footer-item ${deletedRequests.has(item.id!) ? 'is-success' : 'is-primary'}`}
                      onClick={() => handleEditLinkRequest(item)}
                      disabled={deletedRequests.has(item.id!)}
                      style={{ flex: 1 }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className={`button card-footer-item ${deletedRequests.has(item.id!) ? 'is-success' : 'is-danger'}`}
                      onClick={() => handleDeleteLinkRequest(item)}
                      disabled={deletedRequests.has(item.id!)}
                      style={{ flex: 1 }}
                    >
                      {deletedRequests.has(item.id!) ? '✓ Deleted!' : '🗑️ Delete'}
                    </button>
                  </footer>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal - Reuse LinkRequestModal but in edit mode */}
      {isEditModalOpen && editingRequest && (
        <EditLinkRequestModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleUpdateLinkRequest}
          linkRequest={editingRequest}
        />
      )}
    </div>
  );
}

// Edit Modal Component - similar to LinkRequestModal but for editing
interface EditLinkRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  linkRequest: LinkRequest;
}

const EditLinkRequestModal: React.FC<EditLinkRequestModalProps> = ({ isOpen, onClose, onSuccess, linkRequest }) => {
  const [formData, setFormData] = useState({
    game_name: linkRequest.game_name || '',
    tags: linkRequest.tags || [],
    description: linkRequest.description || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedGameOption, setSelectedGameOption] = useState<string>(linkRequest.game_name || '');
  const [otherGameName, setOtherGameName] = useState<string>('');
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const tagsDropdownRef = React.useRef<HTMLDivElement>(null);
  const tagsButtonRef = React.useRef<HTMLButtonElement>(null);
  const [tagsDropdownPos, setTagsDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const { GAME_NAME_DESCRIPTIONS } = require('../../enums/gameNameEnums');
  const { PLAY_STYLE_TAGS } = require('../../enums/PlayStyleTagsEnums');

  React.useEffect(() => {
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

  const handleToggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
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
      await onSuccess({
        ...formData,
        game_name: effectiveGameName
      });
    } catch (error) {
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
          <h2 className="link-request-modal-title">Edit Link Request</h2>
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
                <option key={id} value={name as string}>{name as string}</option>
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
            
            {formData.tags.length > 0 && (
              <div className="link-request-modal-tags" style={{ marginBottom: '10px' }}>
                {formData.tags.map(tag => (
                  <span key={tag} className="link-request-modal-tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className="link-request-modal-tag-remove"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

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
                onMouseDown={(e) => e.stopPropagation()}
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
                          onClick={() => setFormData(prev => ({ ...prev, tags: [] }))}
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
                    {PLAY_STYLE_TAGS.map((tag: string) => (
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
              {isLoading ? 'Updating...' : 'Update Link Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

