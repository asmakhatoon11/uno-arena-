import React, { useState } from 'react';
import { AVATARS } from '../utils/constants';
import { audioService } from '../services/audioService';

export default function WelcomeScreen({ profile, onContinue }) {
  const [name, setName] = useState(profile?.name || 'Royal Challenger');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || '👑');

  const handleStart = () => {
    audioService.playButtonClick();
    onContinue({
      name: name.trim() || 'Royal Challenger',
      avatar: selectedAvatar
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '36px 20px 28px 20px',
        background: 'radial-gradient(ellipse at center, #241A35 0%, #14101F 65%, #08070D 100%)',
        overflowY: 'auto'
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <h1
          className="gold-text"
          style={{ fontSize: '2.6rem', letterSpacing: '2px', lineHeight: 1.1 }}
        >
          UNO ARENA
        </h1>
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            color: 'var(--text-light)',
            marginTop: '4px'
          }}
        >
          ENTER THE ROYAL CHAMBER
        </p>
      </div>

      {/* Profile Setup Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '340px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          margin: '20px 0'
        }}
      >
        {/* Selected Avatar Large Circle */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'var(--surface-royal-2)',
            border: '3px solid var(--gold-light)',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem'
          }}
        >
          {selectedAvatar}
        </div>

        {/* Avatar Picker Row */}
        <div style={{ width: '100%', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 700 }}>
            CHOOSE YOUR CREST
          </span>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '8px'
            }}
          >
            {AVATARS.slice(0, 5).map((av) => (
              <button
                key={av.id}
                onClick={() => {
                  audioService.playButtonClick();
                  setSelectedAvatar(av.icon);
                }}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: selectedAvatar === av.icon ? 'var(--gold-dark)' : 'rgba(36, 26, 53, 0.8)',
                  border: selectedAvatar === av.icon ? '2px solid #FFF1A8' : '1px solid rgba(212, 175, 55, 0.3)',
                  fontSize: '1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: selectedAvatar === av.icon ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
              >
                {av.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Player Name Field */}
        <div style={{ width: '100%' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '6px'
            }}
          >
            SOVEREIGN NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={18}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(13, 11, 22, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'var(--font-game)',
              outline: 'none',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          width: '100%',
          maxWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <button className="btn-royal" onClick={handleStart} style={{ width: '100%' }}>
          CONTINUE TO ARENA ⚔️
        </button>

        <button
          className="btn-royal-glass"
          onClick={handleStart}
          style={{ width: '100%', fontSize: '0.95rem' }}
        >
          PLAY AS GUEST
        </button>
      </div>
    </div>
  );
}
