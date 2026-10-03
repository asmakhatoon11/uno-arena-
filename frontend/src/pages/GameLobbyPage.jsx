import React, { useState } from 'react';
import { Play, Zap, Shield, Users, BookOpen, X } from 'lucide-react';
import MascotCharacter from '../components/MascotCharacter';
import EnvironmentLayer from '../components/EnvironmentLayer';
import { audioService } from '../services/audioService';
import { GAME_MODES, ARENAS } from '../utils/constants';

export default function GameLobbyPage({
  profile,
  onSelectMode,
  onUpdateProfile
}) {
  const [isArenaPickerOpen, setIsArenaPickerOpen] = useState(false);

  const activeArenaId = profile?.activeArena || 'ROYAL_PALACE';
  const currentArena = ARENAS.find(a => a.id === activeArenaId) || ARENAS[0];

  const handleModeTap = (mode) => {
    try { audioService.unlock?.(); } catch {}
    audioService.playButtonClick();
    onSelectMode(mode);
  };

  const handleSelectArena = (arenaId) => {
    audioService.playButtonClick();
    setIsArenaPickerOpen(false);
    onUpdateProfile?.({ activeArena: arenaId });
  };

  return (
    <div className="lobby-stage-container">
      {/* Dynamic Background Environment Layer */}
      <EnvironmentLayer arenaId={activeArenaId} />

      {/* Main Center Stage Area */}
      <div className="lobby-hero-section">
        {/* Season Banner Ribbon */}
        <div className="lobby-season-ribbon">
          <span>⚔️ SEASON 1 • ROYAL CORONATION</span>
        </div>

        {/* Original Animated Mascot Hero Character */}
        <MascotCharacter name={profile?.name || 'Aurelius The Sovereign'} />

        {/* Arena Selector Quick Pill */}
        <div style={{ marginTop: '2px', marginBottom: '8px' }}>
          <button
            className="game-btn-pill"
            style={{
              padding: '6px 16px',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(23, 17, 46, 0.85)',
              borderColor: 'var(--gold-main)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
            onClick={() => setIsArenaPickerOpen(true)}
            title="Change Playing Arena World"
          >
            <span>{currentArena.icon}</span>
            <span style={{ color: 'var(--gold-glow)', fontWeight: 800 }}>Arena: {currentArena.name}</span>
            <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>▾</span>
          </button>
        </div>

        {/* The Giant 3D Mobile Game PLAY Button */}
        <div className="lobby-play-btn-wrapper">
          <button
            className="game-btn-play"
            onClick={() => handleModeTap(GAME_MODES.QUICK_MATCH)}
          >
            <Play fill="#1A0F00" size={28} />
            <span>PLAY NOW</span>
          </button>
        </div>
      </div>

      {/* Game Mode Horizontal Capsules */}
      <div className="lobby-mode-capsules-grid">
        {/* Quick Match Capsule */}
        <div
          className="game-mode-capsule c-yellow"
          onClick={() => handleModeTap(GAME_MODES.QUICK_MATCH)}
        >
          <div className="mode-badge-pill hot">POPULAR</div>
          <div className="mode-icon-circle yellow">
            <Zap size={22} color="#FFD60A" />
          </div>
          <div className="mode-text-meta">
            <span className="mode-title">Quick Match</span>
            <span className="mode-desc">Live Rivals & Fast AI</span>
          </div>
        </div>

        {/* Classic Match Capsule */}
        <div
          className="game-mode-capsule c-blue"
          onClick={() => handleModeTap(GAME_MODES.CLASSIC)}
        >
          <div className="mode-icon-circle blue">
            <Shield size={22} color="#0A84FF" />
          </div>
          <div className="mode-text-meta">
            <span className="mode-title">Classic Arena</span>
            <span className="mode-desc">Standard Rules • 4 Players</span>
          </div>
        </div>

        {/* Play With Friends Capsule */}
        <div
          className="game-mode-capsule c-green"
          onClick={() => handleModeTap(GAME_MODES.FRIENDS)}
        >
          <div className="mode-icon-circle green">
            <Users size={22} color="#30D158" />
          </div>
          <div className="mode-text-meta">
            <span className="mode-title">Play With Friends</span>
            <span className="mode-desc">Custom Private Rooms</span>
          </div>
        </div>

        {/* Practice vs Bots Capsule */}
        <div
          className="game-mode-capsule c-red"
          onClick={() => handleModeTap(GAME_MODES.PRACTICE)}
        >
          <div className="mode-icon-circle red">
            <span style={{ fontSize: '1.25rem' }}>🤖</span>
          </div>
          <div className="mode-text-meta">
            <span className="mode-title">Practice vs Bots</span>
            <span className="mode-desc">Offline Solo Training</span>
          </div>
        </div>
      </div>

      {/* Interactive Academy Training Banner */}
      <div
        className="lobby-tutorial-bar"
        onClick={() => handleModeTap(GAME_MODES.TUTORIAL)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="tutorial-book-icon">
            <BookOpen size={20} color="#FFD60A" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFF1A8' }}>
              Royal Training Academy
            </span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              12 Interactive steps to master every card rule!
            </span>
          </div>
        </div>
        <span style={{ color: '#FFD60A', fontSize: '1.2rem', fontWeight: 900 }}>❯</span>
      </div>

      {/* Lobby Arena Selector Modal */}
      {isArenaPickerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 4, 12, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsArenaPickerOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '20px',
              border: '2px solid var(--gold-main)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-glow)', fontSize: '1.15rem', fontWeight: 900 }}>
                SELECT ARENA WORLD
              </div>
              <button
                className="game-btn-circle"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setIsArenaPickerOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ARENAS.map(a => {
                const isSelected = activeArenaId === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => handleSelectArena(a.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      background: isSelected ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(36, 26, 53, 0.9) 100%)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '2px solid var(--gold-main)' : '1px solid rgba(255, 255, 255, 0.12)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{a.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? 'var(--gold-glow)' : '#FFFFFF' }}>
                          {a.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                          {a.desc}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: 'var(--gold-glow)', fontWeight: 900, fontSize: '0.8rem' }}>
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
