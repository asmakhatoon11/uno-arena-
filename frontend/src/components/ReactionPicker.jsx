import React from 'react';
import { EMOTES, QUICK_CHAT } from '../utils/constants';
import { audioService } from '../services/audioService';

export default function ReactionPicker({ isOpen, onClose, onSendReaction }) {
  if (!isOpen) return null;

  const handleSelect = (emote, phrase = null) => {
    audioService.playButtonClick();
    onSendReaction({ emote, phrase });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 7, 13, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '18px',
          border: '1.5px solid var(--gold-primary)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="gold-text" style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>
            QUICK EMOTES
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Emote Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            marginBottom: '16px'
          }}
        >
          {EMOTES.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(emoji)}
              style={{
                fontSize: '1.6rem',
                height: '46px',
                background: 'rgba(36, 26, 53, 0.7)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Quick Chat Phrases */}
        <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '8px' }}>
          QUICK SHOUTS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {QUICK_CHAT.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect('💬', phrase)}
              style={{
                background: 'rgba(26, 20, 40, 0.8)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                color: 'var(--text-light)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(48, 32, 68, 0.9)';
                e.currentTarget.style.borderColor = 'var(--gold-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(26, 20, 40, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
