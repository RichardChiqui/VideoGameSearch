import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store';
import { setUserData } from '../../ReduxStore/UserstateSlice';
import { REGIONS_DESCRIPTIONS, REGIONS_ENUMS } from '../../enums/RegionsEnums';
import { apiClient } from '../../utils/apiClient';
import { Logger, LogLevel } from '../../Logger/Logger';
import '../../StylingSheets/profileStyles.css';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get current user data from Redux
  const currentUser = useSelector((state: RootState) => state.user);
  
  const [displayName, setDisplayName] = useState(currentUser.display_name || '');
  const [email, setEmail] = useState(currentUser.userEmail || '');
  const [region, setRegion] = useState<string>(() => {
    if (currentUser.region && typeof currentUser.region === 'number') {
      return REGIONS_DESCRIPTIONS[currentUser.region] || '';
    }
    return currentUser.region || '';
  });
  const [profileDescription, setProfileDescription] = useState(currentUser.profile_description || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Update form when user data changes
  useEffect(() => {
    setDisplayName(currentUser.display_name || '');
    setEmail(currentUser.userEmail || '');
    if (currentUser.region && typeof currentUser.region === 'number') {
      setRegion(REGIONS_DESCRIPTIONS[currentUser.region] || '');
    } else {
      setRegion(currentUser.region || '');
    }
    setProfileDescription(currentUser.profile_description || '');
  }, [currentUser]);

  const handleCancel = () => {
    // Reset to original values
    setDisplayName(currentUser.display_name || '');
    setEmail(currentUser.userEmail || '');
    if (currentUser.region && typeof currentUser.region === 'number') {
      setRegion(REGIONS_DESCRIPTIONS[currentUser.region] || '');
    } else {
      setRegion(currentUser.region || '');
    }
    setProfileDescription(currentUser.profile_description || '');
    setError('');
    setSuccess('');
    navigate('/');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Find region enum ID from description
    let regionEnumId: REGIONS_ENUMS | undefined;
    const regionEntry = Object.entries(REGIONS_DESCRIPTIONS).find(([_, desc]) => desc === region);
    if (regionEntry) {
      regionEnumId = Number(regionEntry[0]) as REGIONS_ENUMS;
    }

    try {
      const response = await apiClient.request('/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display_name: displayName,
          email: email,
          region: regionEnumId,
          profile_description: profileDescription
        })
      });

      if (response.success && response.data) {
        // Update Redux store with new data
        dispatch(setUserData({
          userId:  response.data.userId,
          userEmail:  response.data.email,
          display_name: response.data.display_name,
          region: response.data.region,
          profile_description: response.data.profile_description
        }));

        setSuccess('Profile updated successfully!');
        Logger('Profile updated successfully', LogLevel.Info);
        
        // Navigate back after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (error) {
      Logger(`Error updating profile: ${error}`, LogLevel.Error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Profile Settings</h1>
          <button 
            className="profile-close-btn"
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {success && (
            <div className="profile-success">
              {success}
            </div>
          )}

          <div className="profile-field">
            <label htmlFor="displayName" className="profile-label">
              Display Name *
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="profile-input"
              placeholder="Enter display name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="email" className="profile-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="profile-input"
              placeholder="Enter email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="region" className="profile-label">
              Region *
            </label>
            <select
              id="region"
              name="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="profile-input profile-select"
              required
              disabled={isLoading}
            >
              <option value="">Select Region</option>
              {Object.entries(REGIONS_DESCRIPTIONS).map(([id, name]) => (
                <option key={id} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="profile-field">
            <label htmlFor="profileDescription" className="profile-label">
              Profile Description
            </label>
            <textarea
              id="profileDescription"
              name="profileDescription"
              value={profileDescription}
              onChange={(e) => setProfileDescription(e.target.value)}
              className="profile-input profile-textarea"
              placeholder="Enter a short profile description (optional)"
              rows={4}
              maxLength={300}
              disabled={isLoading}
            />
            <div className="profile-char-count">
              {profileDescription.length}/300 characters
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="button"
              className="profile-btn profile-btn-cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="profile-btn profile-btn-save"
              onClick={handleSave}
              disabled={isLoading || !displayName.trim() || !email.trim() || !region}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

