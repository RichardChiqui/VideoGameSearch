import React, { useState } from 'react';
import { Logger, LogLevel } from '../../Logger/Logger';
import '../../StylingSheets/feedbackModalStyles.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'feature' | 'bug' | 'general';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    { value: 'feature', label: 'Feature Request', icon: '💡' },
    { value: 'bug', label: 'Bug Report', icon: '🐛' },
    { value: 'general', label: 'General Feedback', icon: '💬' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      Logger('Feedback form validation failed - missing required fields', LogLevel.Warn);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create mailto link with pre-filled content
      const emailSubject = encodeURIComponent(`[${feedbackTypes.find(t => t.value === feedbackType)?.label}] ${subject}`);
      const emailBody = encodeURIComponent(
        `Feedback Type: ${feedbackTypes.find(t => t.value === feedbackType)?.label}\n\n` +
        `Message:\n${message}\n\n` +
        `---\n` +
        `Submitted from GameLink App\n` +
        `Timestamp: ${new Date().toLocaleString()}`
      );
      
      const mailtoLink = `mailto:your-email@example.com?subject=${emailSubject}&body=${emailBody}`;
      
      // Open user's default email client
      window.open(mailtoLink, '_blank');
      
      Logger(`Feedback submitted: ${feedbackType} - ${subject}`, LogLevel.Info);
      
      // Show success state
      setIsSubmitted(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setSubject('');
        setMessage('');
        setFeedbackType('general');
        onClose();
      }, 2000);
      
    } catch (error) {
      Logger(`Error submitting feedback: ${error}`, LogLevel.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={handleClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <h2 className="feedback-modal-title">
            <span className="feedback-icon">📧</span>
            Contact Us
          </h2>
          <button 
            className="feedback-modal-close" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {isSubmitted ? (
          <div className="feedback-success">
            <div className="success-icon">✅</div>
            <h3>Thank you!</h3>
            <p>Your feedback has been submitted. We'll get back to you soon!</p>
          </div>
        ) : (
          <form className="feedback-modal-form" onSubmit={handleSubmit}>
            <div className="feedback-modal-field">
              <label className="feedback-modal-label">
                What can we help you with?
              </label>
              <div className="feedback-type-buttons">
                {feedbackTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`feedback-type-button ${feedbackType === type.value ? 'active' : ''}`}
                    onClick={() => setFeedbackType(type.value as FeedbackType)}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="feedback-modal-field">
              <label htmlFor="subject" className="feedback-modal-label">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="feedback-modal-input"
                placeholder="Brief description of your feedback"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="feedback-modal-field">
              <label htmlFor="message" className="feedback-modal-label">
                Message *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="feedback-modal-textarea"
                placeholder="Please provide detailed information about your feedback, bug report, or feature request..."
                rows={6}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="feedback-modal-actions">
              <button
                type="button"
                onClick={handleClose}
                className="feedback-modal-cancel"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="feedback-modal-submit"
                disabled={isSubmitting || !subject.trim() || !message.trim()}
              >
                {isSubmitting ? 'Opening Email...' : 'Send Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
