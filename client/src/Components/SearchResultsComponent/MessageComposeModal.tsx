import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.min.css';

interface MessageComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  recipientName: string;
  gameName?: string;
}

const MessageComposeModal: React.FC<MessageComposeModalProps> = ({
  isOpen,
  onClose,
  onSend,
  recipientName,
  gameName
}) => {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Pre-written message templates
  const messageTemplates = [
    `Hey ${recipientName}! Let's play ${gameName || 'some games'} together! 🎮 Ready to team up?`,
    `Hi ${recipientName}! I saw you're into ${gameName || 'gaming'}. Want to play together? 🎯`,
    `Hey ${recipientName}! Looking for a gaming buddy for ${gameName || 'some games'}. Interested? 🚀`,
    `Hi ${recipientName}! I'm also into ${gameName || 'gaming'}. Want to team up sometime? ⚡`,
    `Hey ${recipientName}! Let's squad up in ${gameName || 'some games'}! Are you down? 🔥`
  ];

  // Initialize with first template when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessage(messageTemplates[0]);
      setSelectedTemplate(messageTemplates[0]);
    }
  }, [isOpen, recipientName, gameName]);

  const handleTemplateSelect = (template: string) => {
    setMessage(template);
    setSelectedTemplate(template);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
        <div className="box" style={{ background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F4F8 100%)' }}>
          <div className="field">
            <label className="label" style={{ color: '#2C3E50', fontWeight: 'bold' }}>
              Send Message to {recipientName}
            </label>
            <p className="help" style={{ color: '#6B73FF' }}>
              Choose a template or write your own message
            </p>
          </div>

          {/* Quick Template Selection */}
          <div className="field">
            <label className="label is-small" style={{ color: '#2C3E50' }}>
              Quick Templates:
            </label>
            <div className="buttons are-small">
              {messageTemplates.map((template, index) => (
                <button
                  key={index}
                  className={`button is-small ${selectedTemplate === template ? 'is-primary' : 'is-light'}`}
                  onClick={() => handleTemplateSelect(template)}
                  style={{ 
                    fontSize: '0.75rem',
                    marginBottom: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px'
                  }}
                >
                  Template {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="field">
            <label className="label is-small" style={{ color: '#2C3E50' }}>
              Your Message:
            </label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={4}
                style={{
                  border: '2px solid #E8F4F8',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
            <p className="help" style={{ color: '#6B73FF' }}>
              Press Ctrl+Enter to send quickly
            </p>
          </div>

          {/* Action Buttons */}
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <button
                className="button is-primary"
                onClick={handleSend}
                disabled={!message.trim()}
                style={{
                  background: 'linear-gradient(135deg, #6B73FF 0%, #9B59B6 100%)',
                  border: 'none',
                  fontWeight: '600'
                }}
              >
                <span className="icon">
                  <i className="fas fa-paper-plane"></i>
                </span>
                <span>Send Message</span>
              </button>
            </div>
            <div className="control">
              <button
                className="button is-light"
                onClick={onClose}
                style={{
                  color: '#2C3E50',
                  border: '1px solid #E8F4F8'
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Character Count */}
          <div className="field">
            <p className="help has-text-right" style={{ color: '#6B73FF' }}>
              {message.length} characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposeModal;
