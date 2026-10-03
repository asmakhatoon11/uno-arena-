import React, { useState } from 'react';
import { X, Volume2, Gamepad2, Eye, Shield, Sun, Moon, Palette } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  profile
}) {
  const [testVoiceIdx, setTestVoiceIdx] = useState(0);

  if (!isOpen) return null;

  const currentTheme = settings.theme || 'dark';

  const testVoices = [
    { label: 'UNO!', phrase: 'uno' },
    { label: 'SKIP!', phrase: 'skip' },
    { label: 'PLUS TWO!', phrase: 'plus two' },
    { label: 'REVERSE!', phrase: 'reverse' },
    { label: 'WILD!', phrase: 'wild' },
    { label: 'WILD PLUS FOUR!', phrase: 'wild plus four' }
  ];

  const toggle = (key) => {
    audioService.playButtonClick();
    const updated = !settings[key];
    onUpdateSettings({ [key]: updated });

    if (key === 'musicEnabled') {
      audioService.setMusicEnabled(updated);
    } else if (key === 'sfxEnabled') {
      audioService.setSfxEnabled(updated);
    } else if (key === 'voiceEnabled') {
      audioService.setVoiceEnabled(updated);
    }
  };

  const handleThemeChange = (newTheme) => {
    audioService.playButtonClick();
    onUpdateSettings({ theme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    audioService.setVolume(val);
    onUpdateSettings({ volume: val });
  };

  const handleVoiceVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    audioService.setVoiceVolume(val);
    onUpdateSettings({ voiceVolume: val });
  };

  const handleTestVoice = () => {
    const item = testVoices[testVoiceIdx % testVoices.length];
    setTestVoiceIdx(prev => prev + 1);
    audioService.playVoiceCallout(item.phrase);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 7, 13, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '22px 18px',
          border: '1.5px solid var(--gold-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="gold-text" style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>
            ROYAL SETTINGS
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Section: Display Theme Mode */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Palette size={16} color="var(--gold-light)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              THEME MODE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => handleThemeChange('dark')}
              style={{
                padding: '9px 10px',
                borderRadius: '12px',
                border: currentTheme === 'dark' ? '2px solid var(--gold-main)' : '1px solid rgba(255,255,255,0.15)',
                background: currentTheme === 'dark' ? 'linear-gradient(135deg, #2A1D45 0%, #161028 100%)' : 'rgba(255,255,255,0.06)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: currentTheme === 'dark' ? '0 0 12px rgba(212, 175, 55, 0.35)' : 'none'
              }}
            >
              <Moon size={15} color={currentTheme === 'dark' ? '#FFDF00' : 'inherit'} />
              <span>Dark Royalty</span>
            </button>

            <button
              onClick={() => handleThemeChange('light')}
              style={{
                padding: '9px 10px',
                borderRadius: '12px',
                border: currentTheme === 'light' ? '2px solid var(--gold-main)' : '1px solid rgba(255,255,255,0.15)',
                background: currentTheme === 'light' ? 'linear-gradient(135deg, #FFF9E6 0%, #EBDBC0 100%)' : 'rgba(255,255,255,0.06)',
                color: currentTheme === 'light' ? '#180E28' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: currentTheme === 'light' ? '0 0 12px rgba(212, 175, 55, 0.35)' : 'none'
              }}
            >
              <Sun size={15} color={currentTheme === 'light' ? '#B87800' : 'inherit'} />
              <span>Daylight Arena</span>
            </button>
          </div>
        </div>

        {/* Section: Audio */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Volume2 size={16} color="var(--gold-light)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              AUDIO & MUSIC
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Sound Effects (SFX)</span>
              <input
                type="checkbox"
                checked={settings.sfxEnabled}
                onChange={() => toggle('sfxEnabled')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Ambient Music Loop</span>
              <input
                type="checkbox"
                checked={settings.musicEnabled}
                onChange={() => toggle('musicEnabled')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Voice Announcer (UNO, Skip, +2)</span>
              <input
                type="checkbox"
                checked={settings.voiceEnabled ?? true}
                onChange={() => toggle('voiceEnabled')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Master Volume</span>
                <span>{Math.round((settings.volume || 0.8) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.volume ?? 0.8}
                onChange={handleVolumeChange}
                style={{ accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Announcer Voice Volume</span>
                <span>{Math.round((settings.voiceVolume ?? 0.8) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.voiceVolume ?? 0.8}
                onChange={handleVoiceVolumeChange}
                disabled={!(settings.voiceEnabled ?? true)}
                style={{ accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>

            <button
              className="game-btn-pill"
              onClick={handleTestVoice}
              style={{ fontSize: '0.78rem', padding: '6px 14px', alignSelf: 'flex-start', marginTop: '4px' }}
            >
              🔊 Test Voice: {testVoices[testVoiceIdx % testVoices.length].label}
            </button>
          </div>
        </div>

        {/* Section: Game Options */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Gamepad2 size={16} color="var(--gold-light)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              GAMEPLAY
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Move Hints & Card Glow</span>
              <input
                type="checkbox"
                checked={settings.hintsEnabled}
                onChange={() => toggle('hintsEnabled')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Cinematic Animations</span>
              <input
                type="checkbox"
                checked={settings.animationsEnabled}
                onChange={() => toggle('animationsEnabled')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Section: Accessibility */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Eye size={16} color="var(--gold-light)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              ACCESSIBILITY
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>Reduced Motion</span>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={() => toggle('reducedMotion')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>High Contrast Borders</span>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={() => toggle('highContrast')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            SOVEREIGN ID: <span style={{ color: 'var(--gold-light)' }}>{profile?.id}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            UNO ARENA v1.0.0 • Royal Edition
          </div>
        </div>
      </div>
    </div>
  );
}
