import React from 'react';
import { Volume2, VolumeX, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function GameHUD({
  profile,
  onOpenSettings,
  onOpenProfile,
  onToggleSound,
  onOpenHowToPlay,
  soundMuted = false
}) {
  const xpPercent = Math.min(100, Math.round(((profile?.xp || 0) / (profile?.xpNext || 300)) * 100));

  return (
    <div className="game-top-hud">
      {/* Left: Avatar Medallion & Level Ribbon */}
      <div className="hud-player-medallion" onClick={onOpenProfile}>
        <div className="hud-avatar-circle">
          <span>{profile?.avatar || '🦁'}</span>
          <div className="hud-level-ribbon">
            L{profile?.level || 1}
          </div>
        </div>

        <div className="hud-player-info">
          <span className="hud-player-name">{profile?.name || 'Sovereign'}</span>
          <div className="hud-xp-track">
            <div className="hud-xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Right: Currency Counters & Settings Buttons */}
      <div className="hud-resources">
        {/* Coins Pill */}
        <div className="hud-pill">
          <span className="hud-pill-icon">🪙</span>
          <span className="hud-pill-value">{profile?.coins || 0}</span>
          <button
            className="hud-pill-add"
            onClick={() => audioService.playCoin()}
            title="Add Coins"
          >
            +
          </button>
        </div>

        {/* Gems Pill */}
        <div className="hud-pill">
          <span className="hud-pill-icon">💎</span>
          <span className="hud-pill-value">{profile?.gems || 0}</span>
          <button
            className="hud-pill-add"
            style={{ background: 'linear-gradient(180deg, #00F0FF 0%, #0088CC 100%)' }}
            onClick={() => audioService.playCoin()}
            title="Add Gems"
          >
            +
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          className="game-btn-circle"
          onClick={() => {
            audioService.playButtonClick();
            onToggleSound();
          }}
          title={soundMuted ? 'Unmute' : 'Mute'}
        >
          {soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* How to Play & Audio Guide */}
        <button
          className="game-btn-circle"
          onClick={() => {
            audioService.playButtonClick();
            onOpenHowToPlay?.();
          }}
          title="How to Play & Audio Guide"
        >
          <HelpCircle size={18} />
        </button>

        {/* Settings Gear */}
        <button
          className="game-btn-circle"
          onClick={() => {
            audioService.playButtonClick();
            onOpenSettings();
          }}
          title="Game Settings"
        >
          <SettingsIcon size={18} />
        </button>
      </div>
    </div>
  );
}
