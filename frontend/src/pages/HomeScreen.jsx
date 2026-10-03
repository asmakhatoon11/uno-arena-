import React from 'react';
import { Play, Zap, Users, GraduationCap, Shield } from 'lucide-react';
import { audioService } from '../services/audioService';
import { GAME_MODES } from '../utils/constants';

export default function HomeScreen({ onSelectMode }) {
  const handleModeClick = (mode) => {
    audioService.playButtonClick();
    onSelectMode(mode);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 20px',
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      {/* Royal Arena Centerpiece Banner */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '24px 16px',
          textAlign: 'center',
          marginTop: '6px',
          marginBottom: '20px',
          background: 'radial-gradient(ellipse at center, rgba(36, 26, 53, 0.9) 0%, rgba(20, 16, 31, 0.85) 100%)',
          border: '1.5px solid var(--gold-primary)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '2px',
            color: 'var(--gold-light)'
          }}
        >
          SEASON 1: ROYAL CORONATION
        </span>
        <h2
          className="gold-text"
          style={{ fontSize: '2.1rem', margin: '4px 0 14px 0', letterSpacing: '1px' }}
        >
          UNO ARENA
        </h2>

        {/* Large Animated Main PLAY Button */}
        <button
          className="btn-royal"
          onClick={() => handleModeClick(GAME_MODES.QUICK_MATCH)}
          style={{
            fontSize: '1.35rem',
            padding: '16px 42px',
            width: '88%',
            boxShadow: '0 8px 30px rgba(212, 175, 55, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.7)'
          }}
        >
          <Play fill="#120E1C" size={26} />
          <span>PLAY NOW</span>
        </button>
      </div>

      {/* Game Mode Selection Grid */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '20px'
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '1px',
            color: 'var(--gold-light)',
            marginLeft: '4px'
          }}
        >
          SELECT ARENA MODE
        </span>

        {/* Quick Match Tile */}
        <div
          className="glass-panel"
          onClick={() => handleModeClick(GAME_MODES.QUICK_MATCH)}
          style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderLeft: '4px solid #FFD60A',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255, 214, 10, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFD60A'
              }}
            >
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                Quick Match
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Instant matchmaking with live rivals & bots
              </div>
            </div>
          </div>
          <span style={{ color: 'var(--gold-light)', fontSize: '1.2rem' }}>❯</span>
        </div>

        {/* Classic Match Tile */}
        <div
          className="glass-panel"
          onClick={() => handleModeClick(GAME_MODES.CLASSIC)}
          style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderLeft: '4px solid #0A84FF',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(10, 132, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A84FF'
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                Classic Arena
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Traditional rules, 2–4 players
              </div>
            </div>
          </div>
          <span style={{ color: 'var(--gold-light)', fontSize: '1.2rem' }}>❯</span>
        </div>

        {/* Play With Friends Tile */}
        <div
          className="glass-panel"
          onClick={() => handleModeClick(GAME_MODES.FRIENDS)}
          style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderLeft: '4px solid #30D158',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(48, 209, 88, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#30D158'
              }}
            >
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                Play With Friends
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Create or join private room with code
              </div>
            </div>
          </div>
          <span style={{ color: 'var(--gold-light)', fontSize: '1.2rem' }}>❯</span>
        </div>

        {/* Practice Mode Tile */}
        <div
          className="glass-panel"
          onClick={() => handleModeClick(GAME_MODES.PRACTICE)}
          style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderLeft: '4px solid #FF3B30',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255, 59, 48, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF3B30'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>🤖</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                Practice vs Bots
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Offline solo match against royal AI
              </div>
            </div>
          </div>
          <span style={{ color: 'var(--gold-light)', fontSize: '1.2rem' }}>❯</span>
        </div>

        {/* Interactive Tutorial Tile */}
        <div
          className="glass-panel"
          onClick={() => handleModeClick(GAME_MODES.TUTORIAL)}
          style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderLeft: '4px solid #D4AF37',
            background: 'linear-gradient(90deg, rgba(36, 26, 53, 0.8) 0%, rgba(212, 175, 55, 0.1) 100%)',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-light)'
              }}
            >
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gold-sparkle)' }}>
                Interactive Tutorial
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Hands-on training match (12 guided steps)
              </div>
            </div>
          </div>
          <span style={{ color: 'var(--gold-light)', fontSize: '1.2rem' }}>❯</span>
        </div>
      </div>
    </div>
  );
}
