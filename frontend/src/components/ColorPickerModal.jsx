import React from 'react';
import { COLORS } from '../utils/constants';
import { audioService } from '../services/audioService';

export default function ColorPickerModal({ onSelectColor }) {
  const options = [
    { color: COLORS.RED, label: 'Red', bg: '#FF3B30', glow: 'rgba(255, 59, 48, 0.7)' },
    { color: COLORS.BLUE, label: 'Blue', bg: '#0A84FF', glow: 'rgba(10, 132, 255, 0.7)' },
    { color: COLORS.GREEN, label: 'Green', bg: '#30D158', glow: 'rgba(48, 209, 88, 0.7)' },
    { color: COLORS.YELLOW, label: 'Yellow', bg: '#FFD60A', glow: 'rgba(255, 214, 10, 0.7)' }
  ];

  const handleSelect = (color) => {
    audioService.playButtonClick();
    onSelectColor(color);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 7, 13, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          width: '100%',
          maxWidth: '340px',
          textAlign: 'center',
          border: '2px solid var(--gold-light)'
        }}
      >
        <h3
          className="gold-text"
          style={{ fontSize: '1.4rem', marginBottom: '8px', letterSpacing: '1px' }}
        >
          CHOOSE ARENA COLOR
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Select the next color of power for the arena:
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
            marginBottom: '10px'
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.color}
              onClick={() => handleSelect(opt.color)}
              style={{
                backgroundColor: opt.bg,
                color: '#FFFFFF',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                height: '74px',
                fontSize: '1.1rem',
                fontWeight: 800,
                fontFamily: 'var(--font-game)',
                cursor: 'pointer',
                boxShadow: `0 6px 20px ${opt.glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s ease, filter 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
