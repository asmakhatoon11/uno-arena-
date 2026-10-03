import React from 'react';
import { Volume2, VolumeX, Settings as SettingsIcon } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function NavigationHeader({
  profile,
  onOpenSettings,
  onToggleSound,
  soundMuted = false
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'linear-gradient(180deg, rgba(20, 16, 31, 0.95) 0%, rgba(13, 11, 22, 0.8) 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        zIndex: 50
      }}
    >
      {/* Left: Avatar & Level */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--surface-royal-2)',
            border: '2px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
          }}
        >
          {profile?.avatar || '👑'}
          <span
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-6px',
              background: 'var(--gold-dark)',
              color: '#FFF1A8',
              fontSize: '0.6rem',
              fontWeight: 900,
              padding: '1px 5px',
              borderRadius: '8px',
              border: '1px solid var(--gold-light)'
            }}
          >
            {profile?.level || 1}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-pure)' }}>
            {profile?.name || 'Player'}
          </span>
          {/* XP Bar */}
          <div
            style={{
              width: '80px',
              height: '5px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginTop: '3px'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, ((profile?.xp || 0) / (profile?.xpNext || 200)) * 100)}%`,
                height: '100%',
                background: 'var(--gold-gradient)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Right: Currencies & Settings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Coins Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(26, 20, 40, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
            padding: '3px 8px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--gold-light)'
          }}
        >
          <span>🪙</span>
          <span>{profile?.coins || 0}</span>
        </div>

        {/* Gems Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(26, 20, 40, 0.85)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '16px',
            padding: '3px 8px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#00F0FF'
          }}
        >
          <span>💎</span>
          <span>{profile?.gems || 0}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            audioService.playButtonClick();
            onToggleSound();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold-light)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
          title={soundMuted ? 'Unmute' : 'Mute'}
        >
          {soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            audioService.playButtonClick();
            onOpenSettings();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold-light)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
          title="Settings"
        >
          <SettingsIcon size={18} />
        </button>
      </div>
    </div>
  );
}
